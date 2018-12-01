
const Koa = require("koa");
const KoaRouter = require("koa-router");
const KoaStatic = require("koa-static");
const KoaBody = require("koa-body");
const KoaSend = require("koa-send");
const KoaLogger = require("koa-logger");
const Sqlite3 = require('sqlite3').verbose();
const Moment = require("moment");
const colors = require("colors");
const fs = require("fs");
const UUID = require("uuid/v4");
const Archiver = require("archiver");
const stream = require("stream");
const Xlsx = require("node-xlsx");




//服务端端口
const serverPort = 10241;

//404中间件
function hold404 (ctx, next) {
    let code = 404;
    ctx.status = code;
    ctx.body = {
        code: code,
        data: null,
        msg: "资源不存在",
    };
}

//500中间件
function setCtx500 (ctx) {
    let code = 500;
    ctx.status = code;
    ctx.body = {
        code: code,
        data: null,
        msg: "服务器内部错误",
    };   
}

//Promise封装SQL查询接口
function select (db, sql) {
    let args = Object.entries(arguments)
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

function run (db, sql) {
    let args = Object.entries(arguments)
                     .map(item => item[1])
                     .slice(2);
    return new Promise((resolve, reject) => {
        db.run(sql, args, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
}

//获取数据库内所有表
async function getTableList2 (db) {
    return select(db, "select * from sqlite_master where type = 'table' order by name");
}

//获取某一表内所有数据
async function pullTable (db, table) {
    return select(db, `select * from ${ table } limit 1000`);
}



//数据库会话
function dbSession(dbKey, session = () => { }) {
    return new Promise((resolve, reject) => {
        try {
            let dbName = dbKey;
            let dbPwd = dbKey.substring(0, 7);
            let dbPath = `./uploads/${ dbName }.db`;
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

//导出前准备导出目录
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

//压缩打包文件夹
function compressDir (dirPath, zipPath) {
    return new Promise((resolve, reject) => {
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
                console.log(err);
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

//导出EXCEL格式数据
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

async function decrypt (dbKey) {
    await dbSession(dbKey, async db => {
        await run(db, "PRAGMA cipher_migrate;");
    });
}

async function getTableList (dbKey) {
    let list = [];
    await dbSession(dbKey, async db => {
        list = await select(db, "select * from sqlite_master where type = 'table' order by name");
    });
    return list;
}


//主函数
async function main () {
    try {
        let app = new Koa();
        let router = new KoaRouter();

        router.get("/api/table", async (ctx, next) => {
            try {
                let dbKey = ctx.request.query.db;
                let list = await getTableList(dbKey);
                let code = 200;
                ctx.status = code;
                ctx.body = {
                    code: code,
                    data: list,
                    msg: "查询成功",
                };
            }
            catch (e) {
                setCtx500(ctx);   
            }
        });
        router.get("/api/table/:name", async (ctx, next) => {
            try {
                let code = 200;
                let list = await pullTable(db, ctx.params.name);
                ctx.status = code;
                ctx.body = {
                    code: code,
                    data: list,
                    msg: "查询成功",
                };
            }
            catch (e) {
                setCtx500(ctx);   
            }
        });

        router.post("/api/upload", async (ctx, next) => {
            const file = ctx.request.files.file;
            let pwd = ctx.request.body.pwd;
            let fileName = `${ pwd }${ Number(new Date()) }`;
            let filePath = `./uploads/${ fileName }.db`;
            const reader = fs.createReadStream(file.path);
            const stream = fs.createWriteStream(filePath);
            reader.pipe(stream);

            await decrypt(fileName);

            let code = 200;
            ctx.status = code;
            ctx.body = {
                code: code,
                data: {
                    dbkey: fileName,
                },
                msg: "查询成功",
            };
        });

        router.post("/api/key", async (ctx, next) => {
            
        });

        router.post("/api/export", async (ctx, next) => {
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
        });

        router.get("/resources/:db/:name", async (ctx, next) => {
            let dbKey = ctx.params.db;
            let fileName = ctx.params.name;
            let filePath = `/Users/jimao/Desktop/EnMicroMsgDBExporter/temp/${ dbKey }`;
            ctx.attachment(fileName);
            await KoaSend(ctx, fileName, {
                root: filePath,
            });
        });

        app
            // .use(KoaStatic(__dirname + "/www"))
            // .use(holdAll)
            .use(KoaLogger())
            .use(KoaBody({
                multipart: true,
                formidable: {
                    maxFileSize: 1024 * 1024 * 1024,
                },     
            }))
            .use(router.routes())
            .use(hold404);
        app.listen(serverPort);
        console.log(`OK！现在后端服务已经启动，工作在 ${ serverPort } 端口，如需一直开启服务请不要关闭此进程...`.green);
    }
    catch (e) {
        console.error(e.message);
    }
}


// const data = [
//     [1, 2, 3], 
//     [true, false, null, 'sheetjs'], 
//     ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], 
//     ['baz', null, 'qux']
// ];
// var buffer = Xlsx.build([
//     {name: "mySheetName", data: data}
// ]); // Returns a buffer

// console.log(buffer);
// fs.writeFileSync("1.xlsx", buffer);

main();

// db.close();



