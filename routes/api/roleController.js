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
    getMenuAuthorityService,
    getElementAuthorityService,
    removeAuthorityElementService,
    addAuthorityElementService,
    modifyMenuAuthorityService,
    getUsersByGroupService,
    updateUsersByGroupService
} = require('../../service/roleService')

const {
    addGataLogService
} = require('../../service/gataLogService');
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
        addGataLogService({menu:"角色权限管理",opt:"新增",uri:"/addGroup",hostNmae:req.hostname},req.user);
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
        addGataLogService({menu:"角色权限管理",opt:"修改",uri:"/updateGroup",hostNmae:req.hostname},req.user);
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
        addGataLogService({menu:"角色权限管理",opt:"删除",uri:"/deleteMenu",hostNmae:req.hostname},req.user);
    }
})

//获取已经授权的菜单列表
router.get('/getMenuAuthority/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/getMenuAuthority',
        path: __filename
    });
    if (req.user) {
        getMenuAuthorityService(req, res);
    }
})


//获取已经授权的按钮列表
router.get('/getElementAuthority/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/getElementAuthority',
        path: __filename
    });
    if (req.user) {
        getElementAuthorityService(req, res);
    }
})

//添加按钮权限
router.get('/addAuthorityElement/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/addAuthorityElement',
        path: __filename
    });
    if (req.user) {
        addAuthorityElementService(req, res);
        addGataLogService({menu:"按钮权限",opt:"新增",uri:"/addAuthorityElement",hostNmae:req.hostname},req.user);
    }
})

//删除按钮权限
router.delete('/removeAuthorityElement/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/removeAuthorityElement',
        path: __filename
    });
    if (req.user) {
        removeAuthorityElementService(req, res);
        addGataLogService({menu:"按钮权限",opt:"删除",uri:"/removeAuthorityElement",hostNmae:req.hostname},req.user);
    }
})

//修改菜单权限
router.post('/modifyMenuAuthority/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/modifyMenuAuthority',
        path: __filename
    });
    if (req.user) {
        modifyMenuAuthorityService(req, res);
        addGataLogService({menu:"菜单权限",opt:"修改",uri:"/modifyMenuAuthority",hostNmae:req.hostname},req.user);
    }
})

//获取已经关联的用户包含两个领导和员工
router.get('/getUsersByGroup/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/getUsersByGroup',
        path: __filename
    });
    if (req.user) {
        getUsersByGroupService(req, res);
    }
})
//修改菜单权限
router.get('/updateUsersByGroup/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/updateUsersByGroup',
        path: __filename
    });
    if (req.user) {
        updateUsersByGroupService(req, res);
        addGataLogService({menu:"权限用户关联",opt:"修改",uri:"/updateUsersByGroup",hostNmae:req.hostname},req.user);
    }
})


module.exports = router;