const express = require("express");
const router = express.Router();
const {
    connection,
    redisCli
} = require('../../config/db');
const passport = require('passport');
//测试接口
router.get("/update", (req, res) => {
    var updateSql = 'UPDATE demo set uname= ? where id = ?';
    var updateParams = ['无敌强', 2];

    connection.query(updateSql, updateParams, function (err, result) {
        if (err) {
            console.log('[UPDATE ERROR] ' + err.message)
            res.json({
                "err": err.message
            });
        } else {
            console.log(`------------------------------------UPDATE-------------------`);
            console.log(`UPDATE SUCCESS ` + result.affectedRows); //成功影响了x行  1
            console.log(`-------------------------------------------------------------`);
            res.json({
                "mes": `UPDATE SUCCESS ` + result.affectedRows
            });
        }
    })
})
router.get("/select", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    if (req.user) {
        connection.query('SELECT * FROM demo', function (err, results, fields) {
            if (err) {
                console.log(err);
                res.json({
                    "err": err
                });
            } else {
                console.log(results);
                console.log(fields);
                res.json(results);
            }
        })
    }
})
router.get("/add", (req, res) => {
    var addSql = `INSERT INTO demo (uname,age) VALUES(?,?)`;
    var addSqlParams = ["小华", 15];

    connection.query(addSql, addSqlParams, function (err, result) {
        if (err) {
            console.log(err);
            res.json({
                "err": err
            });
        } else {
            res.json(result);
        }
    })

})

router.get("/delete", (req, res) => {
    // res.json({"msg":"demo Worker!"});
    var updateSql = 'DELETE from demo where id = ?';
    var updateParams = [2];

    connection.query(updateSql, updateParams, function (err, result) {
        if (err) {
            console.log('[UPDATE ERROR] ' + err.message)
            res.json({
                "err": err.message
            });
        } else {
            console.log(`------------------------------------UPDATE-------------------`);
            console.log(`UPDATE SUCCESS ` + result.affectedRows); //成功影响了x行  1
            console.log(`-------------------------------------------------------------`);
            res.json({
                "mes": `UPDATE SUCCESS ` + result.affectedRows
            });
        }
    })
})
router.get("/redis", (req, res) => {

    redisCli.set('age', 100);
    redisCli.set('name', 'lisi');
    res.json({
        mes: "success"
    });

})

router.get("/log4", (req, res) => {
    const logger = log4js.getLogger('cheese');
    logger.trace('Entering cheese testing');
    logger.debug('Got cheese.');
    logger.info('Cheese is Comté.');
    logger.warn('Cheese is quite smelly.');
    logger.error('Cheese is too ripe!');
    logger.fatal('Cheese was breeding ground for listeria.');
    console.log("我错了")
    res.json({msg:"success"});

})
module.exports = router;