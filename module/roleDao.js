const {
  executeSql
} = require("../config/db");
const async = require('async');
const logger = require("../config/log").getLogger("runtime");
const roleDao = {
  //   获取所有权限类型
  getGroupTypesDao: function (fn) {
    logger.info({
      methed: "getGroupTypesDao",
      path: __filename
    });
    let sql = "SELECT * FROM base_group_type";
    executeSql(function (connection) {
      connection.query(sql, fn);
      connection.release();
    });
  },
  //获取角色树
  getGroupsDao: function (fn, params) {
    logger.info({
      methed: "getGroupsDao",
      path: __filename
    });
    let sql = "SELECT * FROM base_group where group_type = ? ";
    executeSql(function (connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  },

  //添加角色
  addGroupDao: function (fn, params) {
    // code,name,parent_id,path,type,group_type,description,crt_user,crt_name,crt_time,crt_host,upd_user,upd_name,upd_time,upd_host,
    // console.log(params);
    logger.info({
      methed: "addGroupDao",
      path: __filename
    });
    let sql = "insert into base_group (code,name,parent_id,type,group_type,path,description,crt_time,crt_user,crt_name,crt_host) values(?,?,?,?,?,?,?,?,?,?,?)";
    executeSql(function (connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  },

  //更新角色
  updateGroupDao: function (fn, params) {
    // console.log(params);
    logger.info({
      methed: "updateGroupDao",
      path: __filename
    });
    // code,name,parent_id,type,group_type,path,description,upd_time,upd_user,upd_name,upd_host,id
    let sql = "update base_group set code=?,name=?,parent_id=?,type=?,group_type=?,path=?,description=?,upd_time=?,upd_user=?,upd_name=?,upd_host=? where id = ?";
    executeSql(function (connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  },

  //删除角色
  deleteGroupDao: function (fn, params) {
    // console.log(params);
    logger.info({
      methed: "deleteGroupDao",
      path: __filename
    });
    let sql = "delete from base_group where id = ?";
    executeSql(function (connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  },

  //获取所有授权菜单(角色唯一 用于授权回显)
  getMenuAuthorityDao: function (fn, params) {
    logger.info({
      methed: "getMenuAuthorityDao",
      path: __filename
    });
    let sql = "SELECT * FROM base_resource_authority where authority_id = ? and resource_type ='menu' or resource_type = 'dir'";
    executeSql(function (connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  },

  //获取所有授权按钮(角色唯一 用于授权回显)
  getElementAuthorityDao: function (fn, params) {
    // console.log(params);
    logger.info({
      methed: "getElementAuthorityDao",
      path: __filename
    });
    let sql = "SELECT * FROM base_resource_authority where authority_id = ? and resource_type ='button' or resource_type = 'uri'";
    executeSql(function (connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  },

  
  //获取所有授权菜单(角色不唯一 用于登录菜单初始化)
  getMenuAuthorityDao2: function (fn, params) {
    logger.info({
      methed: "getMenuAuthorityDao",
      path: __filename
    });
    let sql = "SELECT * FROM base_resource_authority where authority_id in ("+params.toString()+") and resource_type ='menu' or resource_type = 'dir'";
    executeSql(function (connection) {
      connection.query(sql, fn);
      connection.release();
    });
  },

  //获取所有授权按钮((角色不唯一 用于登录菜单初始化)
  getElementAuthorityDao2: function (fn, params) {
    logger.info({
      methed: "getElementAuthorityDao",
      path: __filename
    });
    let sql = "SELECT * FROM base_resource_authority where authority_id in ("+params.toString()+") and resource_type ='button' or resource_type = 'uri'";
    executeSql(function (connection) {
      connection.query(sql, fn);
      connection.release();
    });
  },

  //添加按钮资源
  addAuthorityElementDao: function (fn, params) {
    // console.log(params);
    logger.info({
      methed: "addAuthorityElementDao",
      path: __filename
    });
    let sql = "insert into base_resource_authority (authority_id,authority_type,resource_id,resource_type,parent_id,crt_user,crt_name,crt_host,crt_time) values(?,'group',?,'button',-1,?,?,?,?)";
    executeSql(function (connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  },

  //删除按钮资源
  removeAuthorityElementDao: function (fn, params) {
    // console.log(params);
    logger.info({
      methed: "removeAuthorityElementDao",
      path: __filename
    });
    let sql = "delete from base_resource_authority where authority_id = ? and resource_id = ? and resource_type in ('button','uri')";
    executeSql(function (connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  },

  //更新按钮资源
  modifyMenuAuthorityDao: function (fn, params) {
    // console.log(params);
    logger.info({
      methed: "modifyMenuAuthorityDao",
      path: __filename
    });
    let sql1 = "delete from base_resource_authority where authority_id = ? and resource_type in ('menu','dir')";
    let sql2 = "insert into base_resource_authority (authority_id,authority_type,resource_id,resource_type,parent_id,crt_user,crt_name,crt_host,crt_time) values ?";
    executeSql(function (connection) {
      let task1 = function (fn) {
        connection.beginTransaction(function (err) {
          fn(err, true);
        })
      }
      let task2 = function (fn) {
        connection.query(sql1, [params.id], function (err, result) {
          fn(err, result);
        })
      }
      let task3 = function (fn) {
        connection.query(sql2, [params.data], function (err, result) {
          fn(err, result);
        })
      }
      let task4 = function(fn){
        connection.commit(function(err) {
          fn(err,true);
        });
      }
      async.series([task1, task2, task3,task4], function (err, values) {
        if (err) {
          connection.rollback(function (err) {
            console.log("事务出错了" + err);
            logger.error(err.stack);

          });
        }
        connection.release();
        fn(err, values);


      });
    });
  },

  //获取已经关联的用户包含两个领导和员工
  getUsersByGroupDao:function(fn,id){
    logger.info({
      methed: "getUsersByGroupDao",
      path: __filename
    });
    let sql1 = "select id,group_id,user_id,user_name from base_group_member where group_id= ?";
    let sql2 = "select id,group_id,user_id,user_name from base_group_leader where group_id= ?";
    executeSql(function (connection) {
      let task1 = function (fn) {
        connection.beginTransaction(function (err) {
          fn(err, true);
        })
      }
      let task2 = function (fn) {
        connection.query(sql1, id, function (err, result) {
          fn(err, result);
        })
      }
      let task3 = function (fn) {
        connection.query(sql2, id, function (err, result) {
          fn(err, result);
        })
      }
      let task4 = function(fn){
        connection.commit(function(err) {
          fn(err,true);
        });
      }
      async.series([task1, task2, task3,task4], function (err, values) {
        if (err) {
          connection.rollback(function (err) {
            console.log("事务出错了" + err);
            logger.error(err.stack);

          });
        }
        connection.release();
        let data={};
        data.members = values[1];
        data.leaders = values[2];
        fn(err, data);


      });
    });
  },

  // 修改关联的用户
  updateUsersByGroupDao:function(fn,data){
    logger.info({
      methed: "updateUsersByGroupDao",
      path: __filename
    });
    let sql1 = "delete from base_group_member where group_id = ?";
    let sql2 = "insert into base_group_member (group_id,user_id) values ?";
    let sql3 = "delete from base_group_leader where group_id = ?";
    let sql4 = "insert into base_group_leader (group_id,user_id) values ?";
    executeSql(function (connection) {
      let task1 = function (fn) {
        connection.beginTransaction(function (err) {
          fn(err, true);
        })
      }
      let task2 = function (fn) {
        connection.query(sql1, [data.id], function (err, result) {
          fn(err, result);
        })
      }
      let task3 = function (fn) {
        if(!data.params.members){
          return  fn('', true);
        }
        connection.query(sql2, [data.params.members], function (err, result) {
          fn(err, result);
        })
      }
      let task4 = function (fn) {
        connection.query(sql3, [data.id], function (err, result) {
          fn(err, result);
        })
      }
      let task5 = function (fn) {
        if(!data.params.leaders){
          return  fn('', true);
        }
        connection.query(sql4, [data.params.leaders], function (err, result) {
          fn(err, result);
        })
      }
      let task6 = function(fn){
        connection.commit(function(err) {
          fn(err,true);
        });
      }
      async.series([task1, task2, task3,task4,task5,task6], function (err, values) {
        if (err) {
          connection.rollback(function (err) {
            console.log("事务出错了" + err);
            logger.error(err.stack);

          });
        }
        connection.release();
        fn(err, values);


      });
    });
  }

}

module.exports = roleDao;