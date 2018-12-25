const {
    getList1
} = require('../module/demo1Dao');
const async = require('async');
let getList = function (req, res) {
    var task1 = function(fn){
        getList1(function (err, results, fields) {
            console.log(1);
            fn(err, results[0]);
        })
    }
    var task2 = function(fn){
        getList1(function (err, results, fields) {
            console.log(2);
            fn(err, results[0]);
        })
    }
    var task3 = function(fn){
        getList1(function (err, results, fields) {
            console.log(3);
            fn(err, results[0]);
        })
    }
    async.series([task1,task2,task3], function (err, values) {
        if (err) throw err;
        console.log(values);
        res.json(values);
    });
}
module.exports = {
    getList
}