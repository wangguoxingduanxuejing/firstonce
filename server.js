const express = require('express');
const db = require('./config/db');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');

//引入users的API
const user = require("./routes/api/userController");
const menu = require("./routes/api/menuController");
const role = require("./routes/api/roleController");

app.get('/',(req,res)=>{
    // res.send('Hellow World2');
    // res.redirect('/api/demo/select')
});

//注册 body-parser参数解析
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//注册初始化passport
app.use(passport.initialize());
require('./config/passport')(passport);

// 注册路由接口
app.use("/api/user",user);
app.use("/api/menu",menu);
app.use("/api/role",role);

const port = process.env.PORT||5000;
app.listen(port,(res,req)=>{
    console.log(`server running http://localhost:${port}`);
});