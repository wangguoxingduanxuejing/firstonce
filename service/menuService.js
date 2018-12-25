const async = require('async');
const moment = require('moment');
const secret = require('../config/keys');
const log4 = require('../config/log');
const logger = log4.getLogger('runtime')
const {
    getMenusDao,
    addMenuDao,
    updateMenuDao,
    deleteMenuDao,
    getElementsDao,
    addElementDao,
    updateElementDao,
    deleteElementDao,
    getElementsByMenuidDao
} = require('../module/menuDao');
const menuService = {

    //登录的时候获取菜单和按钮
    getMenuAndElementService: function (req, res) {
        let task1 = function (fn) {
            getMenusDao(function (err, results, filds) {
                if (err) {
                    logger.error(err.stack);
                    console.log(err);
                    res.status(200).json({
                        code: 1000,
                        msg: "获取菜单失败"
                    })
                } else {
                    fn(err, results);
                }
            });
        }

        let task2 = function (fn) {
            getElementsDao(function (err, results, filds) {
                if (err) {
                    logger.error(err.stack);
                    console.log(err);
                    res.status(200).json({
                        code: 1000,
                        msg: "获取按钮失败"
                    })
                } else {
                    fn(err, results);
                }
            });
        }

        async.series([task1, task2], function (err, values) {
            if (err) {
                return;
            }
            const data = {
                menus: values[0],
                elements: values[1]

            }
            res.status(200).json({
                code: 0,
                msg: '获取成功',
                data
            });
        });
    },

    //登录的时候获取所有菜单
    getMenusService: function (req, res) {
        getMenusDao(function (err, results, filds) {
            if (err) {
                logger.error(err.stack);
                console.log(err);
                res.status(200).json({
                    code: 1000,
                    msg: '获取菜单失败'
                });
            } else {
                var result = {}; //虚拟一个顶级节点
                result.id = -1; //虚拟顶级节点id为-1
                createMunus(result, results);
                res.status(200).json({
                    code: 0,
                    msg: '获取菜单成功',
                    data: result.children
                });
            }
        });
    },

    //添加菜单
    addMenuService:function (req,res,user){
        //code,title,parent_id,href,icon,type,order_num,description,path,crt_time,crt_user,crt_name,crt_host
        let code=req.body.code||'';
        let title=req.body.title||'';
        let parent_id=req.body.parent_id;
        let href=req.body.href||'';
        let icon=req.body.icon||'';
        let type=req.body.type||'';
        let order_num=req.body.order_num||0;
        let description=req.body.description||'';
        let path=req.body.path||'';
        let crt_time=new Date();
        let crt_user=user.id;
        let crt_name=user.name;
        let crt_host=req.hostname;
        addMenuDao(function(err,result){
            if(err){
                logger.error(err.stack);
                console.log(err);
            }
            if(result&&result.affectedRows===1){
                res.status(200).json({code:0,msg:'添加成功'});
            }
        },[code,title,parent_id,href,icon,type,order_num,description,path,crt_time,crt_user,crt_name,crt_host]);
        
    },
    //修改菜单
    updataMenuService:function(req,res){
        let code=req.body.code||'';
        let title=req.body.title||'';
        let parent_id=req.body.parent_id;
        let href=req.body.href||'';
        let icon=req.body.icon||'';
        let type=req.body.type||'';
        let order_num=req.body.order_num||0;
        let description=req.body.description||'';
        let path=req.body.path||'';
        let upd_time=new Date();
        let upd_user=req.user.id;
        let upd_name=req.user.name;
        let upd_host=req.hostname;
        let id = req.params.id;
        updateMenuDao(function(err,result){
            if(err){
                logger.error(err.stack);
                console.log(err);
            }
            if(result&&result.affectedRows==1){
                res.status(200).json({code:0,msg:'修改成功'});
            }
        },[code,title,parent_id,href,icon,type,order_num,description,path,upd_time,upd_user,upd_name,upd_host,id]);

    },
    //删除菜单
    deleteMenuService:function (req,res){
        let id = req.params.id;
        deleteMenuDao(function(err,result){
            if(err){
                logger.error(err.stack);
                console.log(err);
            }
            if(result&&result.affectedRows===1){
                res.status(200).json({code:0,msg:'删除成功'});
            }
        },[id]);
    },


    //根据菜单id获取相应的按钮列表
    getElementListService:function(req,res){
        let page = req.query.page;
        let limit=req.query.limit;
        let menuId = req.query.menuId;
        let name = req.query.name?'%'+req.query.name+'%':'%%';
        getElementsByMenuidDao(function(err,results,filds){
            if(err){
                logger.error(err.stack); 
                console.log(err);
            }else{
                res.status(200).json({code:1000,msg:"按钮信息获取成功",data:results,total:results.length});
            }
        },[menuId,name,parseInt(page) - 1, parseInt(limit)]);


    },

     //添加按钮
     addElementService:function (req,res,user){
          // code,type,name,uri,menu_id,path,method,description,crt_time,crt_user,crt_name,crt_host
        let code=req.body.code||'';
        let name=req.body.name||'';
        let menu_id=req.body.menu_id;
        let uri=req.body.uri||'';
        let method=req.body.method||'';
        let type=req.body.type||'';
        let description=req.body.description||'';
        let path=req.body.path||'';
        let crt_time=new Date();
        let crt_user=user.id;
        let crt_name=user.name;
        let crt_host=req.hostname;
        addElementDao(function(err,result){
            if(err){
                logger.error(err.stack);
                console.log(err);
            }
            if(result&&result.affectedRows===1){
                res.status(200).json({code:0,msg:'添加成功'});
            }
        },[code,type,name,uri,menu_id,path,method,description,crt_time,crt_user,crt_name,crt_host]);
        
    },
    //修改按钮
    updataElementService:function(req,res){
        let id = req.params.id;
        let code=req.body.code||'';
        let name=req.body.name||'';
        let menu_id=req.body.menu_id;
        let uri=req.body.uri||'';
        let method=req.body.method||'';
        let type=req.body.type||'';
        let description=req.body.description||'';
        let path=req.body.path||'';
        updateElementDao(function(err,result){
            if(err){
                logger.error(err.stack);
                console.log(err);
            }
            if(result&&result.affectedRows==1){
                res.status(200).json({code:0,msg:'修改成功'});
            }
        },[code,type,name,uri,menu_id,path,method,description,id]);

    },
    //删除按钮
    deleteElementService:function (req,res){
        let id = req.params.id;
        deleteElementDao(function(err,result){
            if(err){
                logger.error(err.stack);
                console.log(err);
            }
            if(result&&result.affectedRows===1){
                res.status(200).json({code:0,msg:'删除成功'});
            }
        },[id]);
    },
}

/**内部方法递归挂载children子节点 */
function createMunus(menu, arr) {
    var children = arr.filter((v) => {
        if (v.parent_id === menu.id) {
            return v;
        }
    });
    if (children && children.length > 0) {
        menu.children = children;
        children.forEach(function (menu) {
            createMunus(menu, arr);
        });
    } else {
        return;
    }
}
module.exports = menuService;