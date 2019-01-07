const { executeSql } = require("../config/db");
const logger = require("../config/log").getLogger("runtime");
const user = {
  //登录
  loginDao: function(fn, params) {
    // console.log(params);
    logger.info({ methed: "loginDao", path: __filename });
    let sql = "SELECT * FROM base_user where username = ?";
    executeSql(function(connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  },
  //获取用户列表
  getListDao: function(fn, params) {
    // console.log(params);
    logger.info({ methed: "getListDao", path: __filename });
    let sql = "SELECT * FROM base_user where username like ? or name like ? limit ? ,?";
    executeSql(function(connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  },

  //添加用户
  addUserDao: function(fn, params) {
    // console.log(params);
    logger.info({ methed: "addUserDao", path: __filename });
    let sql =
      "INSERT into base_user (username,password,name,sex,description,crt_user,crt_name,crt_time,crt_host)VALUES(?,?,?,?,?,?,?,?,?)";
    executeSql(function(connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  },

  //编辑用户
  updateUserDao: function(fn, params) {
    // console.log(params);
    logger.info({ methed: "updateUserDao", path: __filename });
    let sql =
      "UPDATE base_user set username=?,name=?,sex=?,description=?,upd_user=?,upd_name=?,upd_time=?,upd_host=? WHERE id = ?";
    executeSql(function(connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  },

  //检查账号 登录名的唯一性
  checkUserName: function(fn, params) {
    // console.log(params);
    logger.info({ methed: "checkUserName", path: __filename });
    let sql = "select * from base_user where username=?";
    executeSql(function(connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  },

  //根据id查询单个用户的信息
  getUserInfoDao: function(fn, params) {
    // console.log(params);
    logger.info({ methed: "getUserInfoDao", path: __filename });
    let sql = "select * from base_user where id=?";
    executeSql(function(connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  },

  //根据id删除单个用户
  deleteUserDao: function(fn, params) {
    // console.log(params);
    logger.info({ methed: "deleteUserDao", path: __filename });
    let sql = "delete from base_user where id=?";
    executeSql(function(connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  },

  // 根据登录人获取相应的角色
  // 默认且只启用base_group_member 表 base_group_leader 表暂时不用
  getGroupsByUser:function(fn, params) {
    // console.log(params);
    logger.info({ methed: "getGroupsByUser", path: __filename });
    let sql = "select group_id from base_group_member where user_id =?";
    executeSql(function(connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  }
};
module.exports = user;
