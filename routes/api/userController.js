const express = require("express");
const {
    loginService,
    getListService,
    addUserService,
    updateUserService,
    deleteUserService
} = require('../../service/userService');
const log4 = require('../../config/log');
const passport = require('passport');

const router = express.Router();
const logger = log4.getLogger('http');

//登录接口
router.post("/login", (req, res) => {
    logger.info({
        method: '/login',
        path: __filename
    });
    loginService(req, res);
})

//获取用户列表
router.get('/userList', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/userList',
        path: __filename
    });
    console.log(req.query);
    if (req.user) {
        getListService(req, res);
    }
})

//新增用户
router.post('/userAdd', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/userAdd',
        path: __filename
    });
    if (req.user) {
        addUserService(req, res, req.user);
    }
})

//编辑用户
router.put('/updateUser/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    logger.info({method: '/updateUser',path: __filename});
    if (req.user) {
        updateUserService(req,res,req.user);
    }
})

//删除用户
router.delete('/deleteUser/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    logger.info({method: '/deleteUser',path: __filename });
    if (req.user) {
        deleteUserService(req,res);
    }
})




module.exports = router;