const mysql = require('mysql');
const redis = require('redis');
const log4 = require('../config/log');

const logger = log4.getLogger('runtime');
const connection = mysql.createConnection({ //配置连接参数
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'firstonce'
});
connection.connect(function(err){
    if(err){
        logger.error(err.stack);
    }else{
        logger.info('connection as id '+connection.threadId);
    }
}); //连接 

let pool = mysql.createPool({ //配置连接参数
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'firstonce'
});

let executeSql = fn=>{
    pool.getConnection(function(err,connection){
        if (err) {
         logger.error(err.stack);  
        }
        fn(connection);
    });
}

const redisCli = redis.createClient();
redisCli.on('ready',err=>{
    if(err){
        logger.error(err.stack);
    }
})

module.exports={
    connection,
    redisCli,
    executeSql
}