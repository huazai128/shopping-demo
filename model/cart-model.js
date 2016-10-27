var mongoose = require("mongoose");      //由于提供数据结构化的数据模型
var Schema = mongoose.Schema;            //定义数据库模式

//定义收货地址模式，在模型中定义字段
var AddressSchema = new Schema({         //在模型中添加文档对象
	name: String,                        //name字段：收件人姓名
	address:String,                      //address字段:收信人地址
	city:String,                         //city字段:收货城市
	status:String,                        //statu字段:货物发送的状态
	zip:String                           //邮编
},{_id:false});                          //禁止ID属性，表示可以不使用ID查询地址
mongoose.model("Address",AddressSchema); //把Schema模型编译成model对象


//定义账单的信用卡和地址模式
var BillingSchema = new Schema({         //在模型中添加文档对象
	cardtype:{type:String,enum:["alipay","MasterCard","Visa","Amex","UPcash"]},  //支付通道，支付
	name: String,                        //卡的用户姓名
	number: String,                      //卡号
	expiremonth: Number,                 //卡到期月份
	expireyear:Number,                   //卡到期的年份
	address:[AddressSchema]              //引用地址
},{_id:false})                           //禁止ID属性，表示被根据ID来查询当前用户的卡           
mongoose.model("Billing",BillingSchema); //把Schema模型编译成Model对象

//定义仓库产品信息的模式
var ProductSchema = new Schema({         //在模型中添加文档对象
	name:String,                         //产品的名称
	imagesfile:String,                   //产品图片
	description:String,                  //产品的详情
	price: String,                       //产品的价格
	instock:Number                       //库存的数量
});
mongoose.model("Product",ProductSchema); //把Schema模型编译成Model对象


//定义订单的产品数量和购物车的数据模型
var QuantitySchema = new Schema({        //在模型中添加文档对象
	quantity:Number,                     //商品的总数
	product:[ProductSchema]              //关联查询 嵌套
},{_id:false});                          //禁止ID属性，表示不使用ID查询参评数量
mongoose.model("Quantity",QuantitySchema);   //把Schema模型编译成Model对象


//定义订单模式用来存储订单信息
var OrderSchema = new Schema({           //在模型中添加文档对象
	userId:String,                       //订单用户ID,
	items:[QuantitySchema],              //订购商品数量和信息,嵌套
	shipping:[AddressSchema],            //收货地址 嵌套
	billing:[BillingSchema],             //账单信息 嵌套
	status:{type:String,default:"等待发货"},  //货物发送的状态
	timestamp:{type:Date,default: Date.now}  //下单的时间
});
mongoose.model("Order",OrderSchema);     //把Schema模型编译成model对象

//定义客户模型
var CustomerSchema = new Schema({
	userId:{type:String,unique:true,required:true},  //unique:表示ID是唯一的,根据用户ID来识别订单信息
	shipping:[AddressSchema],            //收货地址
	billing:[BillingSchema],             //账单信息
	cart:[QuantitySchema]                //购物车
});
mongoose.model("Customer",CustomerSchema);




