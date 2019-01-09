const jwt = require('jsonwebtoken');
const moment = require('moment');
const secret = require('../config/keys');
const {
    getGataLogListDao,
    addgataLogDao,
} = require('../module/gataLogDao');
const log4 = require('../config/log');
const logger = log4.getLogger('runtime')
const groupGataLogService = {
  
//获取操作日志
getGataLogListService: function(req, res) {
    let page = req.query.page;
    let limit = req.query.limit;
    let name = req.query.crtName?"%"+req.query.crtName+"%":"%%";
    getGataLogListDao(function (err, results, filds) {
        if (err) {
            logger.error(err.stack);
            console.log(err);
            res.status(200).json({
                code: 100,
                msg: '用户列表获取失败'
            })
        } else {
            results.forEach(function(item){
                if(item.upd_time){
                    item.upd_time=moment(item.upd_time).format('YYYY-MM-DD HH:mm:ss');
                }
                if(item.crt_time){
                    item.crt_time=moment(item.crt_time).format('YYYY-MM-DD HH:mm:ss');
                }
            });
            res.status(200).json({
                code: 0,
                total: results.length,
                msg: '恭喜你获取成功',
                rows: results
            })
        }
    }, [name,parseInt(page) - 1, parseInt(limit)]);

},

//添加操作日志
addGataLogService: function (gataLog,user) {
    let menu = gataLog.menu||'';
    let opt = gataLog.opt||'';
    let uri = gataLog.uri||'';
    let crt_host = gataLog.hostNmae||"";
    let crt_user = user.id;
    let crt_name = user.name;
    let crt_time = new Date();
    addgataLogDao(function(err,result){
        if(err){
            console.log(err);
            logger.error(err.stack);
        }
    },[menu,opt,uri,crt_user,crt_name,crt_time,crt_host]);
}
}
module.exports = groupGataLogService;
