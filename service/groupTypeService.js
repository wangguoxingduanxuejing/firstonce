const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const async = require('async');
const moment = require('moment');
const {
    getGroupTypeListDao,
    addGroupTypeDao,
    checkGroupTypeCode,
    updateGroupTypeDao,
    deleteGroupTypeDao,
} = require('../module/groupTypeDao');
const log4 = require('../config/log');
const logger = log4.getLogger('runtime')
const groupTypeService = {

    //获取grouptype列表
    getGroupTypeListService: function (req, res) {
        let page = req.query.page;
        let limit = req.query.limit;
        let name = req.query.name?"%"+req.query.name+"%":"%%";
        console.log('name='+name);
        console.log(page, limit);
        getGroupTypeListDao(function (err, results, filds) {
            if (err) {
                logger.error(err.stack);
                console.log(err);
                res.status(200).json({
                    code: 1000,
                    msg: '角色类型获取失败'
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

    //添加grouptype
    addGroupTypeService: function (req, res, user) {
        //code,name,description,crt_user,crt_name,crt_time,crt_host
        let code = req.body.code;
        let name = req.body.name;
        let description = req.body.description || '';
        let crt_user = user.id;
        let crt_name = user.name;
        let crt_host = req.hostname;
        // let crt_time = moment().format('YYYY-MM-DD HH:mm:ss');
        let crt_time = new Date();
        let task1 = function (fn) {
            checkGroupTypeCode(function (err, results) {
                if (err) {
                    logger.error(err.stack);
                    console.log(err);
                }
                if (results && results.length >= 1) {
                    res.status(200).json({
                        code: 1000,
                        msg: "该code已经被使用"
                    });
                } else {
                    fn(err, true);
                }

            }, [code]);
        }
        let task2 = function(flag,fn){
            if(flag){
                addGroupTypeDao(function(err,result){
                    if(err){
                        console.log(err);
                        logger.error(err.stack);
                    }
                    fn(err,result);
                },[code,name,description,crt_user,crt_name,crt_time,crt_host]);
            }
        }
        async.waterfall([task1,task2],function(err,result){
            if(err){
                console.log(err);
                logger.error(err.stack);
            }
            if(result.affectedRows===1){
                res.status(200).json({code:0,msg:'恭喜你添加成功'});;
            }
        })

    },

    //编辑grouptype
    updateGroupTypeService:function(req,res,user){
        let id = req.params.id;
        let code = req.body.code;
        let name = req.body.name;
        let description = req.body.description || '';
        let upd_user = user.id;
        let upd_name = user.name;
        let upd_host = req.hostname;
        // let upd_time = moment().format('YYYY-MM-DD HH:mm:ss');
        let upd_time = new Date();
        updateGroupTypeDao(function(err,result){
            if(err){
                logger.error(err.stack);
                console.error(err);
            }
            if(result&&result.affectedRows===1){
                res.status(200).json({code:0,msg:'修改成功'});;
            }
        },[code,name,description,upd_user,upd_name,upd_time,upd_host,id]);

    },
    //删除grouptype
    deleteGroupTypeService:function(req,res){
        let id = req.params.id;
        deleteGroupTypeDao(function(err,result){
            if(err){
                logger.error(err.stack);
                console.error(err);
            }
            if(result&&result.affectedRows===1){
                res.status(200).json({code:0,msg:'删除成功'});;
            }
        },[id]);
    }
}

module.exports = groupTypeService;