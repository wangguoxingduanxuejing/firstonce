const { executeSql } = require("../config/db");
const logger = require("../config/log").getLogger("runtime");
const menuDao = {
  //获取所有菜单
  getMenusDao: function(fn) {
    logger.info({ methed: "getMenusDao", path: __filename });
    let sql = "SELECT * FROM base_menu";
    executeSql(function(connection) {
      connection.query(sql, fn);
      connection.release();
    });
  },

  //添加菜单
  addMenuDao: function(fn,params) {
    console.log(params);
    logger.info({ methed: "getMenusDao", path: __filename });
    let sql = "insert into base_menu (code,title,parent_id,href,icon,type,order_num,description,path,crt_time,crt_user,crt_name,crt_host) values(?,?,?,?,?,?,?,?,?,?,?,?,?)";
    executeSql(function(connection) {
      connection.query(sql,params, fn);
      connection.release();
    });
  },

  //更新菜单
  updateMenuDao: function(fn,params) {
    // code,title,parent_id,href,icon,type,order_num,description,path,upd_time,upd_user,upd_name,upd_host,id
    console.log(params);
    logger.info({ methed: "getMenusDao", path: __filename });
    let sql = "update base_menu set code=?,title=?,parent_id=?,href=?,icon=?,type=?,order_num=?,description=?,path=?,upd_time=?,upd_user=?,upd_name=?,upd_host=? where id = ?";
    executeSql(function(connection) {
      connection.query(sql,params, fn);
      connection.release();
    });
  },

  //删除菜单
  deleteMenuDao: function(fn,params) {
    console.log(params);
    logger.info({ methed: "getMenusDao", path: __filename });
    let sql = "delete from base_menu where id = ?";
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
 
module.exports = menuDao;
