//使用koa.js减少异步的嵌套，代码更加清晰，健壮； 
//koa2完全是由async函数来处理异步；

var mongoose = require("mongoose");                      //提供数据结构化的数据模型
var db = mongoose.connect("mongodb://localhost/cart");   //连接数据库
require("./model/cart-model.js")                         //导入model对象

var Address = mongoose.model("Address");                 //address:地址集合对象
var Billing = mongoose.model("Billing");                 //Billing:支付集合对象
var Product = mongoose.model("Product");                 //Product:产品集合对象
var Quantity = mongoose.model("Quantity");               //Quantity:订单数量和产品数量
var Order = mongoose.model("Order");                     //Order:订单信息
var Customer = mongoose.model("Customer");               //Customer:订单客户信息，包括用户地址、支付通道、购买的产品信息及价格等等

//增加产品，顾客的信息、订单信息、产品的名称、产品的图片、产品的价格、产品的描述、产品的库存
function addProduct(customer,order,name,imagesfile,price,description,instock){
	var product = new Product({                          //在Product集合对象中添加数据
		name:name,
		order:order,
		imagesfile:imagesfile,
		price:price,
		description:description,
		instock:instock
	});
	product.save(function(err,results){                  //把产品信息保存到集合，
		if(results){
			order.items.push(new Quantity({              //在订单中添加此产品
				quantity:1,
				product:[product]
			}));
			order.save();                                //保存订单信息
			customer.save();                             //保存顾客信息
			console.log("Product " + name + " saved");
		}
	})
}
Product.remove().exec(function(){                       //产品的删除
	Order.remove().exec(function(){                     //订单删除
		Customer.remove().exec(function(){              //顾客信息删除
			var shipping = new Address({                //Address集合中添加地址相关的信息
				name:"HuaZai",                          //收件人姓名
				address:"广州市海珠区",                  	//收信人地址
				city:"广州",                            	//城市
				status:"正在发货中...",                  	//发货状态
				zip: "55555"                            //邮编
			});
			var billing = new Billing({                 //支付方式和信息
				cardtype:"alipay",                      //
				name:"HuaZai",                          //信用卡的用户的名称
				number:"12347456576575",                //卡号
				expiremonth: 1,                         //过期月份
				expireyear: 2020,                       //过期的年分
				address:shipping                        //使用Address集合中的地址信息
			})
			var customer = new Customer({               //Customer顾客集合对象
				userId:"HuaZai",                        //
				shipping:shipping,                      //顾客的使用的地址
				billing:billing,                        //顾客使用的制服方式
				cart:[]                                 //目前顾客订单为空
			});
			customer.save(function(err,result){
				if(result){
					var order = new Order({             //Order集合中添加信息
						userId:customer.userId,         //userId :是根据顾客userId
						items:[],                       //购物车产品信息；目前订单中没有选中产品
						sipping:customer.shipping,       //使用顾客选中的地址
						billing:customer.billing         //使用顾客选中的支付方式
					});
					order.save(function(err,result){    //保存订单信息
						addProduct(customer,order,"Delicate Arch Print","index01.jpg",12.34,"kitty猫大礼包 蓝胖子大礼包",Math.floor((Math.random() * 10)+1));
						addProduct(customer,order,"万华牌","index02.jpg",12.34,"零食大礼包",Math.floor((Math.random() * 10)+1));
						addProduct(customer,order,"坑爹牌","index03.jpg",12.34,"kitty猫大礼包  礼包免费送",Math.floor((Math.random() * 10)+1));
						addProduct(customer,order,"哈吃好喝","index04.jpg",12.34,"kitty猫大礼包 送美女",Math.floor((Math.random() * 10)+1));
						addProduct(customer,order,"母婴","index05.jpg",12.34,"kitty猫大礼包 哈哈",Math.floor((Math.random() * 10)+1));
					})
				}
			})
		})
	})
})