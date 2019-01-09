const { executeSql } = require("../config/db");
const logger = require("../config/log").getLogger("runtime");
const gataLogDao = {
  //获取操作日志
  getGataLogListDao: function(fn, params) {
    logger.info({ methed: "getGataLogListDao", path: __filename });
    let sql = "select id, menu,opt,uri,crt_user,crt_name,crt_time,crt_host from gate_log where crt_name like ? limit ? ,?";
    executeSql(function(connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  },

  //添加操作日志
  addgataLogDao: function(fn, params) {
    logger.info({ methed: "addgataLogDao", path: __filename });
    let sql =
      "INSERT into gate_log (menu,opt,uri,crt_user,crt_name,crt_time,crt_host)VALUES(?,?,?,?,?,?,?)";
    executeSql(function(connection) {
      connection.query(sql, params, fn);
      connection.release();
    });
  },
};
module.exports = gataLogDao;
