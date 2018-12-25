const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const async = require('async');
const moment = require('moment');
const secret = require('../config/keys');
// const passport = require('passport');
const {
    loginDao,
    getListDao,
    addUserDao,
    checkUserName,
    updateUserDao,
    deleteUserDao,
} = require('../module/userDao');
const log4 = require('../config/log');
const logger = log4.getLogger('runtime')
const user = {
    //登录验证生成token
    loginService: function (req, res) {
        let userName = req.body.username;
        let password = req.body.password;
        loginDao(function (err, results, fields) {
            let task1 = function (fn) {
                if (results && results.length === 1) {
                    fn(err, results[0]);
                } else {
                    res.status(200).json({
                        code: 100,
                        msg: '用户名不存在'
                    });
                }
            }
            let task2 = function (user, fn) {
                if (user) {
                    const rule = {
                        id: user.id,
                        username: user.username,
                        name: user.name
                    };
                    bcrypt.compare(password, user.password, function (err, isMatch) {
                        if (isMatch) {
                            fn(err, rule);
                        } else {
                            res.status(200).json({
                                code: 100,
                                msg: '密码错误'
                            });
                        }
                    });
                }
            }
            let task3 = function (rule, fn) {
                if (rule) {
                    jwt.sign(rule, secret.secretName, {
                        expiresIn: 3600*12
                    }, function (err, token) {
                        token = "bearer " + token;
                        fn(err, token);
                    });
                } else {
                    res.status(200).json({
                        code: 100,
                        msg: "token生成失败"
                    });
                }
            }
            async.waterfall([task1, task2, task3], function (err, value) {
                if (err) {
                    logger.error(err.stack);
                    console.log(err);
                }
                // console.log('value==='+value);
                return res.status(200).json({
                    code: 0,
                    token: value,
                    msg: '登录成功'
                });

            })
        }, [userName])
    },
    //获取列表
    getListService: function (req, res) {
        let page = req.query.page;
        let limit = req.query.limit;
        let name = req.query.name?"%"+req.query.name+"%":"%%";
        console.log('name='+name);
        console.log(page, limit);
        getListDao(function (err, results, filds) {
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
        }, [name,name,parseInt(page) - 1, parseInt(limit)]);

    },

    //添加用户
    addUserService: function (req, res, user) {
        //username,password,name,sex,description,crt_user,crt_name,crt_time,crt_host
        let username = req.body.username;
        let password = req.body.password;
        let name = req.body.name;
        let sex = req.body.sex;
        let description = req.body.description || '';
        let crt_user = user.id;
        let crt_name = user.name;
        let crt_host = req.hostname;
        // let crt_time = moment().format('YYYY-MM-DD HH:mm:ss');
        let crt_time = new Date();
        //1 验证用户名是不是唯一的
        //2 密码加密
        //3 保存数据库
        console.log(username,password,name,sex,description,crt_user,crt_name,crt_time,crt_host);
        let task1 = function (fn) {
            checkUserName(function (err, results) {
                if (err) {
                    logger.error(err.stack);
                    console.log(err);
                }
                if (results && results.length >= 1) {
                    res.status(200).json({
                        code: 1000,
                        msg: "该用户名已经注册"
                    });
                } else {
                    fn(err, true);
                }

            }, [username]);
        }
        let task2 = function (flag, fn) {
            if (flag) {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(password, salt, function (err, hash) {
                        if (err) {
                            logger.error(err.stack);
                            console.log(err);
                        } else {
                            password = hash;
                            fn(err, true);
                        }
                    });
                });
            }
        }

        let task3 = function(flag,fn){
            if(flag){
                addUserDao(function(err,result){
                    if(err){
                        console.log(err);
                        logger.error(err.staxk);
                    }
                    fn(err,result);
                },[username,password,name,sex,description,crt_user,crt_name,crt_time,crt_host]);
            }
        }
        async.waterfall([task1,task2,task3],function(err,result){
            console.log(username,password,name,sex,description,crt_user,crt_name,crt_time,crt_host);
            if(err){
                console.log(err);
                logger.error(err.stack);
            }
            if(result.affectedRows===1){
                res.status(200).json({code:0,msg:'恭喜你添加成功'});;
            }
        })

    },

    //编辑用户
    updateUserService:function(req,res,user){
         //username,password,name,sex,description,upd_user,upd_name,upd_time,upd_host,id
        let id = req.params.id;
        let username = req.body.username;
        // let password = req.body.password;
        let name = req.body.name;
        let sex = req.body.sex;
        let description = req.body.description || '';
        let upd_user = user.id;
        let upd_name = user.name;
        let upd_host = req.hostname;
        // let upd_time = moment().format('YYYY-MM-DD HH:mm:ss');
        let upd_time = new Date();
        updateUserDao(function(err,result){
            if(err){
                logger.error(err.stack);
                console.error(err);
            }
            if(result&&result.affectedRows===1){
                res.status(200).json({code:0,msg:'修改成功'});;
            }
        },[username,name,sex,description,upd_user,upd_name,upd_time,upd_host,id]);

    },
    //删除用户
    deleteUserService:function(req,res){
        let id = req.params.id;
        deleteUserDao(function(err,result){
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

module.exports = user;