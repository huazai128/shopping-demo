var mongoose = require("mongoose");                      //提供结构化数据的数据模型

var Address = mongoose.model("Address");                 //address:地址集合对象
var Billing = mongoose.model("Billing");                 //Billing:支付集合对象
var Order = mongoose.model("Order");                     //Order:订单信息
var Customer = mongoose.model("Customer");               //Customer:订单客户信息，包括用户地址、支付通道、购买的产品信息及价格等等

//根据用户查找所有订单信息
exports.getOrders = function(req,res){                   //根据userId查询所有订单数据
	Order.find({userId: "HuaZai"}).                      //根据userId查找数据；find():查询userId集合对象所有订单 文档信息
	exec(function(err,orders){                           //回调函数接受两个参数；内部是返回promise对象
		if(!orders){
			res.json(404,{msg:"没有订单数据"});
		}else{
			res.json(orders);
		}
	})
}

//根据订单ID查找单个订单信息
exports.getOrder = function(req,res){
	Order.findOne({_id : req.query.orderId})             //req.query:是获取get请求参数
	.exec(function(err,order){                           //exec()：回调函数
		if(!order){
			res.json(404,{msg:"没有找到相应的数据"})
		}else{
			res.json(order);
		}
	})
}

//添加新的订单
exports.addOrder = function(req,res){
	var orderShipping = new Address(req.body.updatedShipping);  //获取新的收货地址
	var orderBilling = new Billing(req,body.updatedBilling);    //获取post请求中的支付信息
	var orderItems =  req.body.orderItems;                      //获取post请求参数中订单信息
	var newOrder = new Order({                           //新的订单参数
		userId:"HuaZai",
		items:orderItems,
		shipping:orderShipping,
		billing:orderBilling
	});
	newOrder.save(function(err,results){
		if(err){
			res.json(500,"保存失败");
		}else{
			Customer.update({userId:"HuaZai"},           //
				{$set:{cart:[]}}).                       //$set:重新给cart字段赋值
			exec(function(err,results){
				if(err || results < 1){
					res.json(404,{msg:"更新购物车失败"})
				}else{
					res.json({msg:"保存成功"})
				}
			})
		}
	})
}