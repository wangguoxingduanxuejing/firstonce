const express = require("express");
const {
    getGataLogListService,
    addGataLogService
} = require('../../service/gataLogService');
const log4 = require('../../config/log');
const passport = require('passport');

const router = express.Router();
const logger = log4.getLogger('http');

//获取操作日志列表
router.get('/list', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    logger.info({
        method: '/list',
        path: __filename
    });
    console.log(req.query);
    if (req.user) {
        getGataLogListService(req, res);
        addGataLogService({menu:"操作日志",opt:"列表",uri:"/list",hostNmae:req.hostname},req.user);
    }
})

module.exports=router;
