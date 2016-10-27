var mongoose = require("mongoose");   //用于提供数据结构化的数据模型
var express = require("express");     //web服务
var bodyParser = require("body-parser"); //用于处理POST请求JSON数据转换成req.body属性
var db = mongoose.connect("mongodb://localhost/cart"); // 连接数据库

require("./model/cart-model.js");    //全局引用model对象；可以在任何地方使用model集合对象
var app = express();

//配置模版引擎
app.engine(".html",require("ejs").__express); 
app.set("views",__dirname+"/views");
app.set("view engine","html"); 

app.use(bodyParser());              //全局配置POST请求，可以在所有路由下使用
require("./router/router")(app);    //引入路由

app.listen(8080);                   //设置端口号