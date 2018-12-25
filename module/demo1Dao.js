const {executeSql}=require('../config/db');

let getList1 = function (fn){
    console.log('进入dao层了');
    let sql = 'SELECT * FROM demo';
    executeSql(function(connection){
        connection.query(sql, fn);
        connection.release();
    });

}
module.exports={
    getList1
}