commerceApp.controller('mainController', ['$scope', '$location','$http','$log','$route', 'ngCart', 'shareService', '$routeParams', function($scope, $location, $http, $log, $route, ngCart, shareService, $routeParams) {
   ngCart.setTaxRate(7.5);
   ngCart.setShipping(2.99);

   
    // load details page
    $scope.details = function(product){
        // tell share service which product we need details for
        shareService.currentItem = product;
        // move to details path with product :id
        $location.path('/details/' + product._id);
    }
    
    // load cart page
    $scope.toCart = function(){
        $location.path('/cart');
    }
    // load home page
    $scope.goShopping = function(){
        $location.path('/');
    }
    // this function assigns a random shipping cost to each item in the cart & calculates tax (ng-cart tax issue) 
    // this function simply serves to provide paypal with some extra testing data and would not be used on a deployed application
    $scope.cartDetails = function () {
       var items = ngCart.getItems();
       $scope.items = [];
       $scope.shippingTotal = 0;
       // cycle through items and add shipping cost
       for (var i = 0; i < items.length; i++){
        //   console.log(items[i]);
           var shipping = $scope.randomShipping().toFixed(2);
           $scope.shippingTotal = Number($scope.shippingTotal) + Number(shipping);
        //   $log.debug('shipping : ' + shipping);
        //   $log.debug('shipping total + shipping = ' + $scope.shippingTotal)
           var thisItem = { name : items[i]._name , id : items[i]._id, price : items[i]._price, quantity : items[i]._quantity, shipping : shipping}
           $scope.items.push(thisItem);
       }
       
       shareService.items = $scope.items;
       shareService.totalShipping = $scope.shippingTotal;
    //   console.log($scope.items);
       shareService.carttax = (ngCart.getSubTotal() * 0.075).toFixed(2);
    }
    
    // calculate random shipping cost between $5-$50
    $scope.randomShipping = function(){
      return Math.random() * (50.00 - 5.00) + 5.00;
    }
    
$scope.cartDetails();
}]);