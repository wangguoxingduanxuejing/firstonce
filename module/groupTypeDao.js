const { executeSql } = require("../config/db");
const logger = require("../config/log").getLogger("runtime");
const groupTypeDao = {
  //获取grouptype列表
  getGroupTypeListDao: function(fn, params) {
    // console.log(params);
    logger.info({ methed: "getGroupTypeListDao", path: __filename });
    let sql = "SELECT * FROM base_group_type where code like ? limit ? ,?";
    executeSql(function(connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  },

  //添加grouptype
  addGroupTypeDao: function(fn, params) {
    // console.log(params);
    logger.info({ methed: "addGroupTypeDao", path: __filename });
    let sql =
      "INSERT into base_group_type (code,name,description,crt_user,crt_name,crt_time,crt_host)VALUES(?,?,?,?,?,?,?)";
    executeSql(function(connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  },

  //编辑grouptype
  updateGroupTypeDao: function(fn, params) {
    // console.log(params);
    logger.info({ methed: "updateGroupTypeDao", path: __filename });
    let sql =
      "UPDATE base_group_type set code=?,name=?,description=?,upd_user=?,upd_name=?,upd_time=?,upd_host=? WHERE id = ?";
    executeSql(function(connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  },

  //检查code编码的唯一性
  checkGroupTypeCode: function(fn, params) {
    // console.log(params);
    logger.info({ methed: "checkGroupTypeCode", path: __filename });
    let sql = "select * from base_group_type where code=?";
    executeSql(function(connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  },

  //根据id查询单个grouptype的信息
  getGroupTypeInfoDao: function(fn, params) {
    // console.log(params);
    logger.info({ methed: "getGroupTypeInfoDao", path: __filename });
    let sql = "select * from base_group_type where id=?";
    executeSql(function(connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  },

  //根据id删除单个grouptype
  deleteGroupTypeDao: function(fn, params) {
    // console.log(params);
    logger.info({ methed: "deleteGroupTypeDao", path: __filename });
    let sql = "delete from base_group_type where id=?";
    executeSql(function(connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  },

};
module.exports = groupTypeDao;
