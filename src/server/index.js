
const Koa = require("koa");
const KoaRouter = require("koa-router");
const KoaStatic = require("koa-static");
const KoaBody = require("koa-body");
const KoaLogger = require("koa-logger");
const Sqlite3 = require('sqlite3').verbose();
const Moment = require("moment");
const colors = require("colors");
const fs = require("fs");
const UUID = require("uuid/v4");

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
async function getTableList (db) {
    return select(db, "select * from sqlite_master where type = 'table' order by name");
}

//获取某一表内所有数据
async function pullTable (db, table) {
    return select(db, `select * from ${ table } limit 1000`);
}


function decrypt (db, pwd) {
    return new Promise((resolve, reject) => {
        try {
            db.serialize(async () => {
                await run(db, `PRAGMA key = '${ pwd }';`);
                await run(db, "PRAGMA cipher_migrate;");
                resolve();
            });
        }
        catch (e) {
            reject(e);
        }
    });
}


//主函数
async function main () {
    try {
        let app = new Koa();
        let router = new KoaRouter();

        router.get("/api/table", async (ctx, next) => {
            try {
                let dbKey = ctx.request.query.db;
                let fileName = dbKey;
                let filePath = `./uploads/${ fileName }.db`;
                let pwd = dbKey.substring(0, 7);

                let db = new Sqlite3.Database(filePath);
                await run(db, `PRAGMA key = '${ pwd }';`);
                let list = await getTableList(db);
                db.close();

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

            let db = new Sqlite3.Database(filePath);
            await decrypt(db, pwd);
            db.close();

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

main();

// db.close();