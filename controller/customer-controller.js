var mongoose = require("mongoose");
var Customer = mongoose.model("Customer");   //Customer：客户集合集合对象
var Address = mongoose.model("Address");     //Address：地址集合对象
var Billing = mongoose.model("Billing");     //Billing: 支付通道集合对象

//获取顾客信息
exports.getCustmoer = function(req,res){     //获取客户集合信息
	Customer.findOne({userId:"HuaZai"})      //根据userId查询数据
	.exec(function(err,customer){            //回调函数接受两个参数
		if(!customer){
			res.json(404,{msg:"查找失败"});
		}else{
			res.json(customer);
			console.log(customer)
		}
	})
}

//更新购物车；
exports.updateCart = function(req,res){
	Customer.update({userId:"HuaZai"},
		{$set:{cart:req.body.updatedCart}})  //获取post请求参数并缺更改购物车的数据
	.exec(function(err,results){
		if(err || results < 1){
			res.json(404,{msg:"更新失败"});
		}else{
			res.json({msg:"更新成功"});
		}
	})
}

//更新收货地址
exports.updateShipping = function(req,res){
	var shipping = new Address(req.body.updatedShipping);    //req.body: 是获取Post请求参数
	Customer.update({userId:"HuaZai"},          //根据userId查找查询；
		{$set:{shipping:[shipping.toObject()]}} //$set:更改现有字段的值
	).exec(function(err,results){          
		console.log(results);
		if( err || results < 1){
			res.json(404,{msg:"更新地址失败"});
		}else{
			res.json({msg:"更新失败"});
		}
	})
}

//根据userId更新
exports.updateBilling = function(req,res){
	var newBilling = new Billing(req.body.updatedBilling);   //获取支付信息
	Customer.update({userId: "HuaZai"},
		{$set:{billing:[newBilling.toObject()]}} //$set:重新给billing赋值
	)
	.exec(function(err,results){
		if(err || results < 1){
			res.json(404,{msg:"保存支付信息失败"});
		}else{
			res.json({msg:"保存成功"});
		}
	})
}
