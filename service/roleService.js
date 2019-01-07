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
    getMenuAuthorityDao,
    getElementAuthorityDao,
    addAuthorityElementDao,
    removeAuthorityElementDao,
    modifyMenuAuthorityDao,
    getUsersByGroupDao,
    updateUsersByGroupDao

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
    // 根据角色id 获取已经授权的菜单权限
    getMenuAuthorityService:function(req,res){
       
        let id = req.params.id;
        getMenuAuthorityDao(function(err,results,filds){
            if(err){
                logger.error(err.stack); 
                console.log(err);
            }else{
                res.status(200).json({code:1000,msg:"已经获得授权信息",data:results,total:results.length});
            }
        },[id]);
    },

    // 根据角色id 获取已经授权的按钮权限
    getElementAuthorityService:function(req,res){
        let id = req.params.id;
        getElementAuthorityDao(function(err,results,filds){
        if(err){
            logger.error(err.stack); 
            console.log(err);
        }else{
            res.status(200).json({code:0,msg:"已经获得授权信息",data:results,total:results.length});
        }
    },[id]);
},

     //添加按钮权限
     addAuthorityElementService:function (req,res){
        // authority_id,authority_type,resource_id,resource_type,parent_id,crt_user,crt_name,crt_host,crt_host
        let id = req.params.id;
        let elementId = req.query.elementId;
        let crt_time=new Date();
        let crt_user=req.user.id;
        let crt_name=req.user.name;
        let crt_host=req.hostname;
        addAuthorityElementDao(function(err,result){
            if(err){
                logger.error(err.stack);
                console.log(err);
            }
            if(result&&result.affectedRows===1){
                res.status(200).json({code:0,msg:'添加成功'});
            }
        },[id,elementId,crt_user,crt_name,crt_host,crt_time]);
        
    },
    //修改菜单权限
    modifyMenuAuthorityService:function(req,res){
        let crt_time=new Date();
        let crt_user=req.user.id;
        let crt_name=req.user.name;
        let crt_host=req.hostname;
        let id = req.params.id;
        let menuTrees = req.query.menuTrees.split(',');
        let data=menuTrees.map(function(item){
            var temp=[id,'group',item,'menu',-1,crt_user,crt_name,crt_host,crt_time];
            return temp;
        });
        modifyMenuAuthorityDao(function(err,result){
            if(err){
                logger.error(err.stack);
                console.log(err);
                res.status(500).json({code:0,msg:'服务器错误'});
            }
            if(result){
                res.status(200).json({code:0,msg:'修改成功'});
            }
        },{id,data});

    },
    //删除按钮权限
    removeAuthorityElementService:function (req,res){
        let id = req.params.id;
        let elementId = req.query.elementId;
        removeAuthorityElementDao(function(err,result){
            if(err){
                logger.error(err.stack);
                console.log(err);
            }
            if(result&&result.affectedRows===1){
                res.status(200).json({code:0,msg:'删除成功'});
            }
        },[id,elementId]);
    },

    //获取已经关联的用户包含两个领导和员工
    getUsersByGroupService:function(req,res){
        let id = req.params.id;
        getUsersByGroupDao(function(err,result){
            if(err){
                logger.error(err.stack);
                console.log(err);
                res.status(500).json({code:0,msg:'服务器错误'});
            }
            if(result){
                res.status(200).json({code:0,data:result,msg:'陈宫获取到已关联用户'});
            }
        },id);

    },

    //修改菜单权限
    updateUsersByGroupService:function(req,res){
    let id = req.params.id;
    let members = req.query.members?req.query.members.split(','):undefined;
    let leaders = req.query.leaders?req.query.leaders.split(','):undefined;
    // console.log(id,members,leaders);
    let params ={};
    if(members&&members.length>0){
        params.members=members.map(function(item){
            return [id,item];
        });
    }
    if(leaders&&leaders.length>0){
        params.leaders=leaders.map(function(item){
            return [id,item];
        });
    }
    updateUsersByGroupDao(function(err,result){
        if(err){
            logger.error(err.stack);
            console.log(err);
            res.status(500).json({code:0,msg:'服务器错误'});
        }
        if(result){
            res.status(200).json({code:0,msg:'修改成功'});
        }
    },{id,params});

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