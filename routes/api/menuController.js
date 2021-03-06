const express = require("express");
const log4 = require('../../config/log');
const passport = require('passport');
const logger = log4.getLogger('http');
const router = express.Router();
const {
    getMenuAndElementService,
    getRoleMenusService,
    getMenusService,
    addMenuService,
    updataMenuService,
    deleteMenuService,
    getElementListService,
    getElementByIdService,
    addElementService,
    updataElementService,
    deleteElementService
} = require('../../service/menuService')

const {
    addGataLogService
} = require('../../service/gataLogService');

//登录的时候 获取菜单和按钮(满足当前用户权限的)
router.get('/menuAndElement', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/menuAndElement',
        path: __filename
    });
    if (req.user) {
        getMenuAndElementService(req,res);
    }
});

//登录的时候 获取所有菜单(满足当前用户权限的)
router.get('/menus', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/menus',
        path: __filename
    });
    if (req.user) {
        getRoleMenusService(req,res);
    }
})

//分配权限时获取菜单树
router.get('/menusTree', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/menusTree',
        path: __filename
    });
    if (req.user) {
        getMenusService(req, res);
    }
})

//获取菜单详细信息
router.get('/getMenuInfo/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/getMenuInfo',
        path: __filename
    });
    if (req.user) {
        res.status(200).json({code:0,msg:'接口调用正常'});
    }
})

//添加菜单
router.post('/addMenu', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/addMenu',
        path: __filename
    });
    if (req.user) {
        addMenuService(req,res,req.user);
        addGataLogService({menu:"菜单管理",opt:"新增",uri:"/addMenu",hostNmae:req.hostname},req.user);
    }
})

//修改菜单
router.put('/updateMenu/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/updateMenu',
        path: __filename
    });
    if (req.user) {
        updataMenuService(req,res);
        addGataLogService({menu:"菜单管理",opt:"修改",uri:"/undateMenu",hostNmae:req.hostname},req.user);
        
    }
})

//删除菜单
router.delete('/deleteMenu/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/deleteMenu',
        path: __filename
    });
    if (req.user) {
        deleteMenuService(req,res);
        addGataLogService({menu:"菜单管理",opt:"删除",uri:"/deleteMenu",hostNmae:req.hostname},req.user);
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
        getElementListService(req,res);
    }
})

//获取按钮列表不分页
router.get('/getElementById', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/getElementById',
        path: __filename
    });
    if (req.user) {
        getElementByIdService(req,res);
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
        res.status(200).json({code:0,msg:'接口调用正常'});
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
        addElementService(req,res,req.user);
        addGataLogService({menu:"按钮操作",opt:"新增",uri:"/addElement",hostNmae:req.hostname},req.user);
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
        updataElementService(req,res);
        addGataLogService({menu:"按钮操作",opt:"修改",uri:"/updateElement",hostNmae:req.hostname},req.user);
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
        deleteElementService(req,res);
        addGataLogService({menu:"按钮操作",opt:"删除",uri:"/deleteElement",hostNmae:req.hostname},req.user);
    }
})


module.exports = router;