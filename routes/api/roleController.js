const express = require("express");
const log4 = require('../../config/log');
const passport = require('passport');
const logger = log4.getLogger('http');
const router = express.Router();
const {
    getGroupTypesService,
    getGroupsService,
    addGroupService,
    updataGroupService,
    deleteGroupService,
    getElementListService,
    addElementService,
    updataElementService,
    deleteElementService
} = require('../../service/roleService')

//获取所有的权限类型
router.get('/groupTypes', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/groupTypes',
        path: __filename
    });
    if (req.user) {
        getGroupTypesService(req, res);
    }
})

//获取角色树
router.get('/groupTree', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/groupTree',
        path: __filename
    });
    if (req.user) {
        getGroupsService(req, res);
    }
})

//获取角色详细信息
router.get('/getGroupInfo/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/getGroupInfo',
        path: __filename
    });
    if (req.user) {
        res.status(200).json({
            code: 0,
            msg: '此接口暂时没有，如有需要再添加'
        });
    }
})

//添加角色组
router.post('/addGroup', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/addGroup',
        path: __filename
    });
    if (req.user) {
        addGroupService(req,res);
    }
})

//修改角色组
router.put('/updateGroup/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/updateGroup',
        path: __filename
    });
    if (req.user) {
        updataGroupService(req,res);
    }
})

//删除角色
router.delete('/deleteGroup/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/deleteMenu',
        path: __filename
    });
    if (req.user) {
        deleteGroupService(req,res);
    }
})

//获取按钮列表
router.get('/getElementList', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/getElementList',
        path: __filename
    });
    if (req.user) {
        getElementListService(req, res);
    }
})

//获取菜单详细信息
router.get('/getElementInfo/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/getElementInfo',
        path: __filename
    });
    if (req.user) {
        res.status(200).json({
            code: 0,
            msg: '接口调用正常'
        });
    }
})

//添加按钮权限
router.post('/addElement', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/addElement',
        path: __filename
    });
    if (req.user) {
        addElementService(req, res, req.user);
    }
})

//修改按钮信息
router.put('/updateElement/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/updateElement',
        path: __filename
    });
    if (req.user) {
        updataElementService(req, res);
    }
})

//删除按钮
router.delete('/deleteElement/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/deleteElement',
        path: __filename
    });
    if (req.user) {
        deleteElementService(req, res);
    }
})


module.exports = router;