const { executeSql } = require("../config/db");
const logger = require("../config/log").getLogger("runtime");
const roleDao = {
//   获取所有权限类型
  getGroupTypesDao: function(fn) {
    logger.info({ methed: "getGroupTypesDao", path: __filename });
    let sql = "SELECT * FROM base_group_type";
    executeSql(function(connection) {
      connection.query(sql, fn);
      connection.release();
    });
  },
  //获取角色树
  getGroupsDao: function(fn,params) {
    logger.info({ methed: "getGroupsDao", path: __filename });
    let sql = "SELECT * FROM base_group where group_type = ? ";
    executeSql(function(connection) {
      connection.query(sql,params, fn);
      connection.release();
    });
  },
  

  //添加角色
  addGroupDao: function(fn,params) {
    // code,name,parent_id,path,type,group_type,description,crt_user,crt_name,crt_time,crt_host,upd_user,upd_name,upd_time,upd_host,
    console.log(params);
    logger.info({ methed: "addGroupDao", path: __filename });
    let sql = "insert into base_group (code,name,parent_id,type,group_type,path,description,crt_time,crt_user,crt_name,crt_host) values(?,?,?,?,?,?,?,?,?,?,?)";
    executeSql(function(connection) {
      connection.query(sql,params, fn);
      connection.release();
    });
  },

  //更新角色
  updateGroupDao: function(fn,params) {
    console.log(params);
    logger.info({ methed: "updateGroupDao", path: __filename });
    // code,name,parent_id,type,group_type,path,description,upd_time,upd_user,upd_name,upd_host,id
    let sql = "update base_group set code=?,name=?,parent_id=?,type=?,group_type=?,path=?,description=?,upd_time=?,upd_user=?,upd_name=?,upd_host=? where id = ?";
    executeSql(function(connection) {
      connection.query(sql,params, fn);
      connection.release();
    });
  },

  //删除角色
  deleteGroupDao: function(fn,params) {
    console.log(params);
    logger.info({ methed: "deleteGroupDao", path: __filename });
    let sql = "delete from base_group where id = ?";
    executeSql(function(connection) {
      connection.query(sql,params,fn);
      connection.release();
    });
  },

  //获取所有按钮
  getElementsDao:function(fn) {
    logger.info({ methed: "getElementsDao", path: __filename });
    let sql = "SELECT * FROM base_element";
    executeSql(function(connection) {
      connection.query(sql, fn);
      connection.release();
    });
  },

  
  //根据菜单id获取按钮 带分页
  getElementsByMenuidDao:function(fn,params) {
    logger.info({ methed: "getElementsDao", path: __filename });
    let sql = "SELECT * from base_element WHERE menu_id=? and name like ? limit ?,?";
    executeSql(function(connection) {
      connection.query(sql,params, fn);
      connection.release();
    });
  },

  //添加按钮资源
  addElementDao: function(fn,params) {
    // code,type,name,uri,menu_id,path,method,description,crt_time,crt_user,crt_name,crt_host
    console.log(params);
    logger.info({ methed: "getMenusDao", path: __filename });
    let sql = "insert into base_element (code,type,name,uri,menu_id,path,method,description,crt_time,crt_user,crt_name,crt_host) values(?,?,?,?,?,?,?,?,?,?,?,?)";
    executeSql(function(connection) {
      connection.query(sql,params, fn);
      connection.release();
    });
  },

  //更新按钮资源
  updateElementDao: function(fn,params) {
    console.log(params);
    logger.info({ methed: "getMenusDao", path: __filename });
    let sql = "update base_element set code=?,type=?,name=?,uri=?,menu_id=?,path=?,method=?,description=? where id=?";
    executeSql(function(connection) {
      connection.query(sql,params, fn);
      connection.release();
    });
  },

  //删除按钮资源
  deleteElementDao: function(fn,params) {
    console.log(params);
    logger.info({ methed: "getMenusDao", path: __filename });
    let sql = "DELETE from base_element where id = ?";
    executeSql(function(connection) {
      connection.query(sql,params,fn);
      connection.release();
    });
  },

}
 
module.exports = roleDao;
