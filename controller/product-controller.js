var mongoose = require("mongoose");               //提供结构化数据模型
var Product = mongoose.model("Product");          //引用model对象

//查询所有产品信息
exports.getProducts = function(req,res){          //查询所有产品   
	Product.find().exec(function(err,products){
		if(!products){                        
			res.json(404,{msg:"没有找到产品"});
		}else{
			res.json(products);
		}
	})	
}

//根据产品ID查询单个产品信息
exports.getProduct = function(req,res){           //根据_id获取单个产品
	Product.findOne({_id: req.query.productId})
	.exec(function(err,product){
		if(!product){
			res.json(404,{msg:"没找到相关的数据"})
		}else{
			res.json(product);
		}
	})
}

