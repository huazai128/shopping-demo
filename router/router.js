//路由的配置
var express = require("express");
module.exports = function(app){
	//引用路由控制
	var order = require("./../controller/order-controller");
	var products = require("./../controller/product-controller");
	var customer = require("./../controller/customer-controller");
	//提供静态文件
	app.use("/static",express.static("./static")).
		use("/images",express.static("../images"));
	app.get("/",function(req,res){
		res.render("index");
	});
	//路由
	app.get("/order/get",order.getOrders);
	app.get("/order/add",order.addOrder);
	app.get("/products/get",products.getProducts);
	app.get("/customer/get",customer.getCustmoer);
	app.post("/customer/update/cart",customer.updateCart);
	app.post("/customer/update/shipping",customer.updateShipping);
	app.post("/customer/update/billing",customer.updateBilling);
}