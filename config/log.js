const log4js = require('log4js');
var path = require("path");
log4js.configure({
    appenders: {
        http: {
            type: 'file',
            filename: path.join(__dirname, '../log/http', "http.log"),
            maxLogSize: 100000,
            backups: 100
        },
        console: {
            type: 'console',
            filename: path.join(__dirname, '../log/console', "console"),
            maxLogSize: 10000,
            backups: 100
        },
        runtime: {
            type: 'dateFile',
            filename: path.join(__dirname, '../log/info', "run"),
            alwaysIncludePattern: true,
            pattern: "-yyyy-MM-dd.log"
        },
    },
    categories: {
        default: {
            appenders: ['http'],
            level: 'info'
        },
        console: {
            appenders: ['console'],
            level: 'info'
        },
        http: {
            appenders: ['http'],
            level: 'info'
        },
        runtime: {
            appenders: ['runtime'],
            level: 'info'
        }
        
    },
    replaceConsole: true
});
module.exports=log4=log4js;