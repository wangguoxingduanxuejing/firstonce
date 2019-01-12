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
    getElementsByMenuidDao,
    getElementByIdDao
} = require('../module/menuDao');
const {
    getMenuAuthorityDao2,
    getElementAuthorityDao2
} = require('../module/roleDao');

const {
    getGroupsByUser
} = require ('../module/userDao');

const menuService = {

    //登录的时候获取菜单和按钮(满足当前用户权限的)
    //     getMenuAndElementService: function (req, res) {
    //         let task1 = function (fn) {
    //             getMenusDao(function (err, results, filds) {
    //                 if (err) {
    //                     logger.error(err.stack);
    //                     console.log(err);
    //                     res.status(200).json({
    //                         code: 1000,
    //                         msg: "获取菜单失败"
    //                     })
    //                 } else {
    //                     fn(err, results);
    //                 }
    //             });
    //         }

    //         let task2 = function (fn) {
    //             getElementsDao(function (err, results, filds) {
    //                 if (err) {
    //                     logger.error(err.stack);
    //                     console.log(err);
    //                     res.status(200).json({
    //                         code: 1000,
    //                         msg: "获取按钮失败"
    //                     })
    //                 } else {
    //                     fn(err, results);
    //                 }
    //             });
    //         }

    //         async.series([task1, task2], function (err, values) {
    //             if (err) {
    //                 return;
    //             }
    //             const data = {
    //                 menus: values[0],
    //                 elements: values[1]

    //             }
    //             res.status(200).json({
    //                 code: 0,
    //                 msg: '获取成功',
    //                 data
    //             });
    //         });
    // },

     //登录的时候获取菜单和按钮(满足当前用户权限的)
     getMenuAndElementService: function (req, res) {
        let userId = req.user.id;
        //获取当前用户的所有角色
        let task1 = function(fn){
            getGroupsByUser(function (err, results, filds) {
                fn(err,results);
            },[userId])
        }
        let task2 = function (params,fn) {
            
            params=params.map(function(item){
                return item.group_id;
            });
            //防止没有任何授权 程序报错
            if(params&&params.length===0){
                params.push('');
            }
            getMenuAuthorityDao2(function (err, results1, filds) {
                if(!results1){
                    results1=[];//防止没有任何授权 程序报错 上线时用 try catch处理
                }
                let data={};
                data.params=params;
                // data.results=results;
                // fn(err, data);
                getMenusDao(function (err, results2, filds) {
                    if (err) {
                        logger.error(err.stack);
                        console.log(err);
                        res.status(200).json({
                            code: 1000,
                            msg: "获取菜单失败"
                        })
                    } else {
                        let temp=[];
                        results2.forEach(function(item){
                           for(var i=0;i<results1.length;i++){
                            if(item.id==results1[i].resource_id){
                                temp.push(item);
                                continue;
                            }
                           }
                        });
                        data.results=temp;
                        fn(err, data);
                    }
                });
            },params);
        }

        let task3 = function (data,fn) {
            getElementAuthorityDao2(function (err, results1, filds) {
                // console.log(results);
                const temp1 = {
                    menus: data.results,
                    // elements: results
                }
                // fn(err, temp);
                getElementsDao(function (err, results2, filds) {
                    if (err) {
                        logger.error(err.stack);
                        console.log(err);
                        res.status(200).json({
                            code: 1000,
                            msg: "获取按钮失败"
                        })
                    } else {
                        let temp=[];
                        results2.forEach(function(item){
                           for(var i=0;i<results1.length;i++){
                            if(item.id==results1[i].resource_id){
                                temp.push(item);
                                continue;
                            }
                           }
                        });
                        temp1.elements=temp;
                        fn(err, temp1);
                    }
                });
            },data.params);
        }

        async.waterfall([task1, task2,task3], function (err, values) {
           if(err){
            logger.error(err.stack);
            console.log(err);
              return res.status(200).json({code:1000,msg:"发生了未知的错误"});
           }
           res.status(200).json({
                code: 0,
                msg: '获取成功',
                data:values
            });
        });
    },

    // 登录的时候获取所有菜单(满足当前用户权限的)
    //     getRoleMenusService: function (req, res) {
    //         getMenusDao(function (err, results, filds) {
    //             if (err) {
    //                 logger.error(err.stack);
    //                 console.log(err);
    //                 res.status(200).json({
    //                     code: 1000,
    //                     msg: '获取菜单失败'
    //                 });
    //             } else {
    //                 var result = {}; //虚拟一个顶级节点
    //                 result.id = -1; //虚拟顶级节点id为-1
    //                 createMunus(result, results);
    //                 res.status(200).json({
    //                     code: 0,
    //                     msg: '获取菜单成功',
    //                     data: result.children
    //                 });
    //             }
    //         });
    // },

    //登录的时候获取所有菜单(满足当前用户权限的)
    getRoleMenusService: function (req, res) {
        let userId = req.user.id;

        // 获取当前用户的所有角色
        let task1 = function(fn){
            getGroupsByUser(function (err, results, filds) {
                fn(err,results);
            },[userId])
        }
        // 获取所有的授权角色的菜单
        let task2 = function(params,fn){
            //防止没有任何授权 程序报错
            params=params.map(function(item){
                return item.group_id;
            });
            if(params&&params.length===0){
            params.push('');
            }
            getMenuAuthorityDao2(function (err, results, filds) {
                fn(err,results);
            },params)
        }
         // 获取所有的菜单
        let task3 = function(params,fn){
            getMenusDao(function (err, results, filds) {
                let temp=[];
                params.forEach(function(item){
                   for(var i=0;i<results.length;i++){
                    if(item.resource_id==results[i].id){
                        temp.push(results[i]);
                        continue;
                    }
                   }
                });
                var result = {}; //虚拟一个顶级节点
                result.id = -1; //虚拟顶级节点id为-1
                createMunus(result, temp);
                fn(err,result);
            })
        }

        async.waterfall([task1,task2,task3],function(err,values){
            if(err){
                logger.error(err.stack);
                console.log(err);
                return res.status(200).json({code:1000,msg:"发生了未知的错误"});
            }
            // console.log(values);
            res.status(200).json({
                code: 0,
                msg: '获取菜单成功',
                data: values.children
            });
        });
    },

    //分配权限的时候 获取所有菜单树
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

    //根据菜单id获取相应的按钮列表 不分页
    getElementByIdService:function(req,res){
        let menuId = req.query.menuId;
        getElementByIdDao(function(err,results,filds){
            if(err){
                logger.error(err.stack); 
                console.log(err);
            }else{
                res.status(200).json({code:0,msg:"按钮信息获取成功",data:results,total:results.length});
            }
        },[menuId]);
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