const express = require("express");
const {
    getGroupTypeListService,
    addGroupTypeService,
    updateGroupTypeService,
    deleteGroupTypeService
} = require('../../service/groupTypeService');

const {
    addGataLogService
} = require('../../service/gataLogService');

const log4 = require('../../config/log');
const passport = require('passport');

const router = express.Router();
const logger = log4.getLogger('http');

//获取grouptype列表
router.get('/list', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/list',
        path: __filename
    });
    console.log(req.query);
    if (req.user) {
        getGroupTypeListService(req, res);
        addGataLogService({menu:"角色类型管理",opt:"列表",uri:"/list",hostNmae:req.hostname},req.user);
    }
})

//新增grouptype
router.post('/add', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/add',
        path: __filename
    });
    if (req.user) {
        addGroupTypeService(req, res, req.user);
        addGataLogService({menu:"角色类型管理",opt:"新增",uri:"/add",hostNmae:req.hostname},req.user);
    }
})

//编辑grouptype
router.put('/update/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    logger.info({method: '/update',path: __filename});
    if (req.user) {
        updateGroupTypeService(req,res,req.user);
        addGataLogService({menu:"角色类型管理",opt:"更新",uri:"/update",hostNmae:req.hostname},req.user);
    }
})

//删除grouptype
router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    logger.info({method: '/delete',path: __filename });
    if (req.user) {
        deleteGroupTypeService(req,res);
        addGataLogService({menu:"角色类型管理",opt:"删除",uri:"/delete",hostNmae:req.hostname},req.user);
    }
})




module.exports = router;