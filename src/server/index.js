
const Koa = require("koa");
const KoaRouter = require("koa-router");
const KoaBody = require("koa-body");
const KoaSend = require("koa-send");
const KoaLogger = require("koa-logger");
const Sqlite3 = require('sqlite3').verbose();
const colors = require("colors");
const fs = require("fs");
const Archiver = require("archiver");
const Xlsx = require("node-xlsx");
const path = require("path");

//服务端端口
const serverPort = 10241;
//最大上传文件体积
const maxUploadFileSize = 1024 * 1024 * 1024;

//#region Http中间件
    function hold200 (ctx, data, msg = "操作成功") {
        let code = 200;
        ctx.status = code;
        ctx.body = {
            code: code,
            data: data,
            msg: msg,
        };
    }
    function hold500 (ctx, msg = "服务器内部错误") {
        let code = 500;
        ctx.status = code;
        ctx.body = {
            code: code,
            msg: msg,
        };
    }
    function hold404 (ctx) {
        let code = 404;
        ctx.status = code;
        ctx.body = {
            code: code,
            msg: "资源不存在",
        };
    }
//#endregion

//#region 数据访问方法
    //数据库会话
    function dbSession(dbKey, session = () => { }) {
        return new Promise((resolve, reject) => {
            try {
                let dbName = dbKey;
                let dbPwd = dbKey.substring(0, 7);
                let dbPath = `./upload/${ dbName }.db`;
                let db = new Sqlite3.Database(dbPath);
                db.serialize(async () => {
                    await run(db, `PRAGMA key = '${ dbPwd }';`);
                    await session(db);
                    setTimeout(() => {
                        db.close();
                        resolve();
                    }, 0);
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    //执行SQL语句
    function run (db, sql) {
        let args = Object
                        .entries(arguments)
                        .map(item => item[1])
                        .slice(2);
        return new Promise((resolve, reject) => {
            db.run(sql, args, err => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    //Select数据
    function select (db, sql) {
        let args = Object
                        .entries(arguments)
                        .map(item => item[1])
                        .slice(2);
        return new Promise((resolve, reject) => {
            db.all(sql, args, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
//#endregion

//#region 业务逻辑方法
    //迁移数据库到新版本
    async function migrateDB (dbKey) {
        await dbSession(dbKey, async db => {
            await run(db, "PRAGMA cipher_migrate;");
        });
    }
    //获取数据库内所有表
    async function getTableList (dbKey) {
        let list = [];
        await dbSession(dbKey, async db => {
            list = await select(db, "select * from sqlite_master where type = 'table' order by name");
        });
        return list;
    }
    //准备导出目录
    function prepareExportDir (dbKey, type) {
        let tempPath = `./temp/${ dbKey }`;
        let result = fs.existsSync(tempPath);
        if (!result) {
            fs.mkdirSync(tempPath);
        }
        let tempExportPath = `./temp/${ dbKey }/${ type.toUpperCase() }`;
        result = fs.existsSync(tempExportPath);
        if (!result) {
            fs.mkdirSync(tempExportPath);
        }
        let files = fs.readdirSync(tempExportPath);
        files.forEach(fileName => {
            fs.unlinkSync(`${ tempExportPath }/${ fileName }`);
        });
        return tempPath;
    }
    //压缩文件夹
    function compressDir (dirPath, zipPath) {
        return new Promise((resolve, reject) => {
            try {
                let output = fs.createWriteStream(zipPath);
                let archive = Archiver("zip", {
                    zlib: {
                        level: 9
                    },
                });
                output.on("close", () => {
                    resolve();
                });
                output.on("end", () => { });
                archive.on("warning", err => {
                    if (err.code == "ENOENT") {
                        console.warn(err);
                    }
                    else {
                        reject(err);
                    }
                });
                archive.on("error", err => {
                    reject(err);
                });
                archive.pipe(output);
                archive.directory(dirPath, false);
                archive.finalize();
            }
            catch (e) {
                reject(e);
            }
        });
    }
    //导出JSON格式数据
    async function exportJSON (dbKey, tableNameList) {
        let type = "JSON";
        type = type.toUpperCase();
        let tempPath = prepareExportDir(dbKey, type);
        let tempExportPath = `${ tempPath }/${ type }`;
        await dbSession(dbKey, async db => {
            for (let i = 0; i < tableNameList.length; ++i) {
                let name = tableNameList[i];
                let list = await select(db, `select * from ${ name }`);
                let jsonStr = JSON.stringify(list, null, 4);
                fs.writeFileSync(`${ tempExportPath }/${ name }.json`, jsonStr);
            }
        });
        let downloadFileName = `${ type }${ Number(new Date()) }.zip`;
        let tempDownloadPath = `${ tempPath }/${ downloadFileName }`;
        await compressDir(tempExportPath, tempDownloadPath);
        return downloadFileName;
    }
    //导出Excel格式数据
    async function exportExcel (dbKey, tableNameList) {
        let type = "EXCEL";
        type = type.toUpperCase();
        let tempPath = prepareExportDir(dbKey, type);
        let tempExportPath = `${ tempPath }/${ type }`;
        await dbSession(dbKey, async db => {
            for (let i = 0; i < tableNameList.length; ++i) {
                let name = tableNameList[i];
                let list = await select(db, `select * from ${ name }`);
                let result = list.map(item => Object.values(item));
                let excelBuffer = Xlsx.build([
                    { data: result }
                ]);
                fs.writeFileSync(`${ tempExportPath }/${ name }.xlsx`, excelBuffer);
            }
        });
        let downloadFileName = `${ type }${ Number(new Date()) }.zip`;
        let tempDownloadPath = `${ tempPath }/${ downloadFileName }`;
        await compressDir(tempExportPath, tempDownloadPath);
        return downloadFileName;
    }
//#endregion

//#region 控制器方法
    //数据库上传控制器
    async function uploadControler (ctx, next) {
        let pwd = ctx.request.body.pwd;
        let file = ctx.request.files.file;

        let fileName = `${ pwd }${ Number(new Date()) }`;
        let filePath = `./upload/${ fileName }.db`;
        
        let reader = fs.createReadStream(file.path);
        let stream = fs.createWriteStream(filePath);
        reader.pipe(stream);

        await migrateDB(fileName);

        hold200(ctx, {
            dbkey: fileName,
        });
    }

    //获取表控制器
    async function tablesControler (ctx, next) {
        try {
            let dbKey = ctx.request.query.db;
            let list = await getTableList(dbKey);
            hold200(ctx, list, "查询成功");
        }
        catch (e) {
            console.error(e.message);
            hold500(ctx, e.message);
        }
    }

    //导出数据控制器
    async function exportControler (ctx, next) {
        let dbKey = ctx.request.body.db;
        let exportType = ctx.request.body.type.toUpperCase();
        let tableNameList = ctx.request.body.names;
        let fileName = "";
        if (exportType == "JSON") {
            fileName = await exportJSON(dbKey, tableNameList);
        }
        else if (exportType == "EXCEL") {
            fileName = await exportExcel(dbKey, tableNameList);
        }
        let code = 200;
        ctx.status = code;
        ctx.body = {
            code: code,
            data: fileName,
            msg: "导出成功",
        };  
    }

    //下载导出结果控制器
    async function downloadControler (ctx, next) {
        try {
            let dbKey = ctx.params.db;
            let fileName = ctx.params.name;
            let filePath = path.join(__dirname, "../..", "temp", dbKey);
            ctx.attachment(fileName);
            await KoaSend(ctx, fileName, {
                root: filePath,
            });
        }
        catch (e) {
            console.error(e.message);
            hold500(ctx, e.message);
        }
    }
//#endregion

//#region 主函数
    //主函数
    async function main () {
        try {
            let app = new Koa();
            let router = new KoaRouter();

            router.post("/api/upload", uploadControler);
            router.get("/api/table", tablesControler);
            router.post("/api/export", exportControler);
            router.get("/resource/:db/:name", downloadControler);

            app
                .use(KoaLogger())
                .use(KoaBody({
                    multipart: true,
                    formidable: {
                        maxFileSize: maxUploadFileSize,
                    },
                }))
                .use(router.routes())
                .use(hold404);
            app.listen(serverPort);
            console.log(`服务已经启动，工作在 ${ serverPort } 端口...`.green);
        }
        catch (e) {
            console.error(e.message);
        }
    }
//#endregion

main();



