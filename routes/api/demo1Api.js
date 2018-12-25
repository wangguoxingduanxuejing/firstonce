const express = require("express");
const router = express.Router();
const passport = require('passport');
const {getList} = require('../../service/demo1Service');

router.get("/select1", passport.authenticate('jwt', {
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
                res.json(results);
            }
        })
    }
})

router.get("/select", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    if (req.user) {
        console.log('用户验证通过 即将进入service层');
       getList(req,res);
    }
})

module.exports = router;