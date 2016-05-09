commerceApp.controller('mainController', ['$scope', '$location','$http','$log','$route', 'ngCart', 'shareService', '$routeParams', function($scope, $location, $http, $log, $route, ngCart, shareService, $routeParams) {
 
    if ($route.current.tellUser){
      $scope.tellUser = $route.current.tellUser;
    }
  
    // set tax rate
    ngCart.setTaxRate(7.5);
    // set default shipping value for ng-cart
    ngCart.setShipping(2.99);
    
    //set shareService for details function
    $scope.shareService = shareService;
    // shared functions
    $scope.details= shareService.details;
    $scope.goShopping = shareService.goShopping;
    $scope.toCart = shareService.toCart;

    
    $scope.cartDetails = function () {
        // get the items from ngCart
      var items = ngCart.getItems();
        // make an empty items array in $scope
      $scope.items = [];
        // Make a variable for shipping total in scope and set it to 0
      $scope.shippingTotal = 0;
        // loop through the contents of the items array sent by ngCart
      for (var i = 0; i < items.length; i++){
          
          // ====================================== Generate random shipping for demo
          // You will need to replace this with whatever method you use to get shipping
          // prices.
          var shipping = $scope.randomShipping().toFixed(2);
          
          // add shipping value of item to shipping total
          $scope.shippingTotal = Number($scope.shippingTotal) + Number(shipping);
          // =================================================================================
          
          // Create an item containing desired data 
          var thisItem = { name : items[i]._name , id : items[i]._id, price : items[i]._price, quantity : items[i]._quantity, shipping : shipping};
          // Push that item to our $scope items array
          $scope.items.push(thisItem);
      }
      
      // share complete items array with other controllers using shareService 
      shareService.items = $scope.items;
      // share shippingTotal with other controllers using shareService
      shareService.totalShipping = $scope.shippingTotal;
      
      //calculate and share cart tax 
      shareService.carttax = (ngCart.getSubTotal() * 0.075).toFixed(2);
    };
    
    //random shipping for demo deployment
    $scope.randomShipping = function(){
        //return a random number between 5 and 50
      return Math.random() * (50.00 - 5.00) + 5.00;
    };
    
    // get cart details any time the mainController is active
    $scope.cartDetails();

}]);
