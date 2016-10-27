 var myApp = angular.module("myApp",[]);
myApp.controller("myCtrl",["$scope","$http","$window",function($scope,$http,$window){
	$scope.months = [1,2,3,4,5,6,7,8,9,10,11,12];
	$scope.years = [2016,2017,2018,2019,2020,2021,2022];
	//获取所有订单
	$http.get("/order/get")                            //请求所有当前用户所有的订单信息
	.success(function(data,status,headers,config){
		$scope.orders = data;
	})
	.error(function(data,status,headers,config){
		$scope.orders = [];
	})

	//获取所有产品信息
	$http.get("/products/get")                         
	.success(function(data,status,headers,config){
		$scope.products = data;
		$scope.product = data[0];
		$scope.content = "/static/products.html";      //content:是注入到ng-inlude中，
	})
	.error(function(data,status,headers,config){
		$scope.products = [];
	})

	//设置页面展示
	$scope.setContent = function(content){
		$scope.content = "/static/"+content;
	};

	//获取当前点击对象
	$scope.setProduct = function(id){
		$scope.product = this.product;                 //this.product:是获取当前页面对象数据
		$scope.content = "/static/product.html";
	}

	//获取顾客订单信息
	$http.get("/customer/get")
	.success(function(data,status,headers,config){
		$scope.customer = data;                        //在
	})
	.error(function(data,status,headers,config){
		$scope.customer = [];
	})
	//在产品详情中点击添加到购物车中;添加到购物车需要考虑商品是否存在当前的商品信息；
	$scope.addTocart = function(productId){
		var found = false;
		//遍历购物车中所有的产品；判断当前产品是否勋在雨购物车
		for(var i = 0; i < $scope.customer.cart.length;i++){  //判断购物车中是否已经存在当前产品信息；如果存在久不添加新的数据
			var item = $scope.customer.cart[i];
			if(item.product[0]._id == productId){ // 如果存在就不添加商品只追加数量 
				item.quantity += 1;
				found = true;
			}
		}
		if(!found){                                           //如果购物车中不存在当前产品久保存到购物车中
			$scope.customer.cart.push({quantity :1,product:[this.product]});  //添加到$scope.customer.cart中
		}
		//更新购物车
		$http.post("/customer/update/cart",{updatedCart:$scope.customer.cart})
		.success(function(data,status,headers,config){        //保存成功就显示这个页面
			$scope.content = "/static/cart.html";
		})
		.error(function(data,status,headers,config){
			$window.alert(data);
		})
	}
	//删除当前id下的数据，
	$scope.deleteCart = function(id){
		for(var i = 0; i < $scope.customer.cart.length;i++){  //遍历当前用户购物车的订单数据
			var item = $scope.customer.cart[i];               
			if(item.product[0]._id == id){                    //当前点击产品的id和遍历订单数据id相同
				$scope.customer.cart.splice(i,1);        //删除数据
				break;
			}
		}
		$http.post("/customer/update/cart",             //重新保存购物车
			{updatedCart:$scope.customer.cart}          //post携带参数保存数据
		).success(function(data,status,headers,config){ 
			console.log(data);
			$scope.content = "/static/cart.html";
		}).error(function(data,status,headers,config){
			$window.alert(data);
		})
	}
	$scope.cartTotal = function(){               
		var total = 0;                                 //购物车的总价
		for(var i = 0; i < $scope.customer.cart.length;i++){  //遍历购物车所有数据
			var item = $scope.customer.cart[i];        //获取购物车中产品的价格
			total += item.product[0].price * item.quantity; //
		}
		$scope.shipping = total * 0.05;                //运输费
		return total + $scope.shipping;                //返回总价
	} 
	$scope.checkout = function(){                      //在购物车中点击支付；显示支付
		$http.post("/customer/update/cart",
			{updatedCart:$scope.customer.cart}         
		).success(function(data,status,headers,config){
			$scope.content = "/static/address.html";   
		}).error(function(data,status,headers,config){
			$window.alert(data);
		})
	}
	$scope.setShipping = function(){                  //确认收货地址；保存收货地址；显示支付信息页面
		$http.post("/customer/update/shipping",       //
			{updatedShipping:$scope.customer.shipping[0]}
		).success(function(data,status,headers,config){
			$scope.content = "/static/billing.html";
		}).error(function(data,status,headers){
			//$window.alert(data);
		})
	}
	$scope.verifyBIlling = function(ccv){   //点击继续支付,显示商品信息，及总价格  以及收货地址，支付信息页面
		$scope.ccv = ccv;
		$http.post("/customer/update/billing",     //保存支付信息
			{updatedBilling:$scope.customer.billing[0],ccv:ccv}
		).success(function(data,static,headers,config){
			$scope.content = "/static/review.html"
		}).error(function(data,status,headers,config){
			$window.alert(data)
		})
	}
	$scope.makePur = function(){
		
	}
}])