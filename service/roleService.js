const async = require('async');
const moment = require('moment');
const secret = require('../config/keys');
const log4 = require('../config/log');
const logger = log4.getLogger('runtime')
const {
    getGroupTypesDao,
    getGroupsDao,
    addGroupDao,
    updateGroupDao,
    deleteGroupDao,
    addElementDao,
    updateElementDao,
    deleteElementDao,
    getElementsByMenuidDao
} = require('../module/roleDao');
const roleService = {

    //获取所有的权限类型
    getGroupTypesService: function (req, res) {
        getGroupTypesDao(function (err, results, filds) {
            if (err) {
                logger.error(err.stack);
                console.log(err);
                res.status(200).json({
                    code: 1000,
                    msg: '获取权限类型失败'
                });
            } else {
                res.status(200).json({
                    code: 0,
                    msg: '获取权限类型成功',
                    data: results
                });
            }
        });
    },

    //获取权限树
    getGroupsService: function (req, res) {
        let groupType =req.query.groupType;
        console.log(groupType);
        getGroupsDao(function (err, results, filds) {
            if (err) {
                logger.error(err.stack);
                console.log(err);
                res.status(200).json({
                    code: 1000,
                    msg: '获取角色树失败'
                });
            } else {
                var result = {}; //虚拟一个顶级节点
                result.id = -1; //虚拟顶级节点id为-1
                createMunus(result, results);
                res.status(200).json({
                    code: 0,
                    msg: '获取角色成功',
                    data: result.children||[]
                });
            }
        },[groupType]);
    },

    //添加权限组
    addGroupService:function (req,res){
        // code,name,parent_id,type,group_type,path,description,crt_time,crt_user,crt_name,crt_host
        let code=req.body.code||'';
        let name=req.body.name||'';
        let parent_id=req.body.parent_id;
        let group_type=req.body.group_type;
        let type=req.body.type||'';
        let path=req.body.path||'';
        let description=req.body.description||'';
        let crt_time=new Date();
        let crt_user=req.user.id;
        let crt_name=req.user.name;
        let crt_host=req.hostname;
        addGroupDao(function(err,result){
            if(err){
                logger.error(err.stack);
                console.log(err);
            }
            if(result&&result.affectedRows===1){
                res.status(200).json({code:0,msg:'添加成功'});
            }
        },[code,name,parent_id,type,group_type,path,description,crt_time,crt_user,crt_name,crt_host]);
        
    },
    //修改权限组
    updataGroupService:function(req,res){
        // code,name,parent_id,type,group_type,path,description,crt_time,crt_user,crt_name,crt_host
        let code=req.body.code||'';
        let name=req.body.name||'';
        let parent_id=req.body.parent_id;
        let group_type=req.body.group_type;
        let type=req.body.type||'';
        let path=req.body.path||'';
        let description=req.body.description||'';
        let upd_time=new Date();
        let upd_user=req.user.id;
        let upd_name=req.user.name;
        let upd_host=req.hostname;
        let id = req.params.id;
        updateGroupDao(function(err,result){
            if(err){
                logger.error(err.stack);
                console.log(err);
            }
            if(result&&result.affectedRows==1){
                res.status(200).json({code:0,msg:'修改成功'});
            }
        },[code,name,parent_id,type,group_type,path,description,upd_time,upd_user,upd_name,upd_host,id]);

    },
    //删除权限组
    deleteGroupService:function (req,res){
        let id = req.params.id;
        deleteGroupDao(function(err,result){
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
module.exports = roleService;