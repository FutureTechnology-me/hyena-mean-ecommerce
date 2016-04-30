// CONTROLLERS
commerceApp.controller('mainController', ['$scope', '$location','$http','$log','$route', 'ngCart', 'shareService', '$routeParams', function($scope, $location, $http, $log, $route, ngCart, shareService, $routeParams) {
  // set tax rate
  ngCart.setTaxRate(7.5);
  // set default shipping value for ng-cart
  ngCart.setShipping(2.99);

    // view product details
    $scope.details = function(product){
        // share the current item with other controllers via shareService
        shareService.currentItem = product;
        //use the product id as a route parameter in /details/:id
        $location.path('/details/' + product._id);
    };
   
    // view shopping cart
    $scope.toCart = function(){
        $location.path('/cart');
    };
    
    //view our ecommerce homepage (in this case the default route)
    $scope.goShopping = function(){
        $location.path('/');
    };
    
    
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
          // debug 
          $log.debug('shipping : ' + shipping);
          $log.debug('shipping total + shipping = ' + $scope.shippingTotal);
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
      
      //cart details to help debug
      $log.info("Items Array from cartDetails : "+$scope.items);
      
      //calculate and share cart tax 
      shareService.carttax = (ngCart.getSubTotal() * 0.075).toFixed(2);
    }
    
    
    $scope.randomShipping = function(){
        //return a random number between 5 and 50
      return Math.random() * (50.00 - 5.00) + 5.00;
    }
    
    // get cart details any time the mainController is active
    $scope.cartDetails();

}]);

commerceApp.controller('checkoutController', ['$scope', '$location','$http','$log','$route', 'ngCart', 'shareService', function($scope, $location, $http, $log, $route, ngCart, shareService) {

$scope.items = shareService.items;
$scope.carttax = shareService.carttax;

$scope.$watch('shareService.items', function(){
    $scope.items = shareService.items;
})

$scope.$watch('shareService.carttax', function(){
    $scope.carttax = shareService.carttax;
})

}]);

commerceApp.controller('cartController', ['$scope', '$location','$http','$log','$route', 'ngCart', 'shareService', function($scope, $location, $http, $log, $route, ngCart, shareService) {

$scope.totalShipping = shareService.totalShipping;

$scope.$watch('shareService.totalShipping', function(){
    $scope.totalShipping = shareService.totalShipping;
})


}]);

commerceApp.controller('detailsController', ['$scope', '$location','$http','$log','$route', 'ngCart', 'shareService', '$routeParams', function($scope, $location, $http, $log, $route, ngCart, shareService, $routeParams) {

        $scope.department = shareService.cat;
            
        $scope.currentItem = $routeParams.id;

        $scope.details = function(product){
            shareService.currentItem = product;
            $location.path('/details/' + product._id);
        }


        
        $scope.getDetails = function(){
        $http({
            method: 'GET',
            url: '/products'
        }).then(function successCallback(response){
            $log.debug('getDetails success : ' + JSON.stringify(response.data) );
            $scope.products = response.data;
            $log.debug($scope.products);
            for (var i = 0; i < $scope.products.length ; i++){
                if ($scope.products[i]._id == $scope.currentItem){
                    $log.info('MATCH AT product ' + i + ' product id : ' + $scope.products[i]._id + ' matches ' + $scope.currentItem);
                    $scope.thisProduct = $scope.products[i];
                }
            }
            
            if ($scope.thisProduct === undefined){
                $log.error('unable to find match in product database. Please check url');
            }
        }, function errorCallback(response){
            $log.error('getDetails error : ' + response);
        });
    }
    
    $scope.backShopping = function(){
        $location.path('/');
    }
    
    $scope.toCart = function(){
        $location.path('/cart');
    }
    
    $scope.filterFunction = function(element) {
      var departmentMatch = element.department.match(shareService.cat) ? true : false;
      return (departmentMatch === true) ? true : false;
    };
    

    $scope.getDetails();

}]);

commerceApp.controller('productController', ['$scope', '$location','$http','$log','$route','ngCart', '$routeParams', 'shareService', function($scope, $location, $http, $log, $route, ngCart, $routeParams, shareService) {
    
    $scope.department = shareService.cat;
    $scope.subcategory = shareService.subcat;
    console.log('department scope' + shareService.cat)

    
    $scope.getProducts = function(){
        $http({
            method: 'GET',
            url: '/products'
        }).then(function successCallback(response){
            $log.debug('getProducts success : ' + JSON.stringify(response.data) );
            $scope.products = response.data;
            $log.debug($scope.products);
            $scope.buttonFilter();
        }, function errorCallback(response){
            $log.error('getProducts error : ' + response);
        });
    }
    
    
    
    $scope.buttonFilter = function(){
        var subcategoriesArray = [];
        var categoriesArray = [];
        console.log($scope.products);
         
        for (var y = 0; y < $scope.products.length; y++){
            // for each product add it's category to the categories array
        	categoriesArray[y] = $scope.products[y].department;

          // cull categories - remove duplicates from categories array
             categoriesArray = categoriesArray.filter(function(elem, pos) {
                return categoriesArray.indexOf(elem) == pos;
            }); 
          }

          // for each category in the categoriesArray
          for (var i=0; i< categoriesArray.length; i++) {
                // create a nested array for this category
                subcategoriesArray[i] = [];
                // and each product.department in product array
                for (var x = 0; x < $scope.products.length; x++){
                    
                    // check for a match
                    if ($scope.products[x].department === categoriesArray[i]) {
                        $log.debug(categoriesArray[i] + " " + $scope.products[x].productAdjective);
                        // match
                        // push subcategory to appropriate nested array in subcategoriesArray
                        subcategoriesArray[i].push($scope.products[x].productAdjective);
                        
                        // cull subcategories
                        subcategoriesArray[i] = subcategoriesArray[i].filter(function(elem, pos) {
                            return subcategoriesArray[i].indexOf(elem) == pos;
                        }); 
                    }
                }
          }
          
          // we have categoriesArray[#] for our button title, and separated link
          $log.debug(categoriesArray);
          // we have subcategoriesArray[#] containing a list of subcategories for the corresponding value in categoriesArray
          $log.debug(subcategoriesArray);
          
          $scope.categoriesInfo = categoriesArray;
          $scope.subcategoriesInfo = subcategoriesArray;

    };
    
    
    $scope.resetFilter = function(){
        $scope.department = "";
        shareService.cat = "";
        $scope.subcategory = "";
        shareService.subcat = "";
    }
    
    $scope.setCategory = function(category){
        $scope.department = category;
        shareService.cat = category;
        $scope.subcategory = "";
        shareService.subcat = "";
    }
    
    $scope.setSubcategory = function(category, subcategory){
        $scope.department = category;
        shareService.cat = category;
        $scope.subcategory = subcategory;
        shareService.subcat = subcategory;
    }
    
    // filter products by department and category using $scope.department and $scope.subcategory which are set by clicking filters in the view
    $scope.filterFunction = function(element) {
      var departmentMatch = element.department.match($scope.department) ? true : false;
      var subcategoryMatch = element.productAdjective.match($scope.subcategory) ? true : false;
      return (departmentMatch && subcategoryMatch === true) ? true : false;
    };
    
    
    $scope.getProducts();
    

}]);

commerceApp.controller('headerController', ['$scope', '$location','$http','$log','$route', "shareService",function($scope, $location, $http, $log, $route, shareService) {
  $scope.header =[ { name: 'header.html', url: 'app/pages/header.html'} ];
  $scope.header = $scope.header[0];
  $scope.shareService = shareService;
  $scope.displayLogin = true;
  
      $scope.$watch('shareService.logout', function(newVal, oldVal){
        if(newVal === true){
            shareService.logout=false;
            $scope.logout();
        }
    })
  
    $scope.getUser = function(){
    $http({
      method: 'GET',
      url: '/user'
    }).then(function successCallback(response) {
        // $scope.user = JSON.stringify(response.data);
        $scope.user = response.data;
        $log.debug("/user callback was : " + JSON.stringify(response.data));
        // check if a user is logged in and set displayLogin for css
        if($scope.user === ''){
            console.log('detected no user')
            $scope.displayLogin = true;
        } else {$scope.displayLogin = false;}
      }, function errorCallback(response) {
        $log.error("/user error was : " + response);
        $scope.user = "user error";
      });
    }
    
    $scope.toProfile = function(){
        $location.path('/profile');
    }
    
    $scope.toLogin = function(){
        $location.path('/login');
    }
    
    $scope.toRegister = function(){
        $location.path('/register');
    }
    
    $scope.logout = function(){
        $http.get('/logout');
        $scope.displayLogin = true;
        $location.path('/');
        // $route.reload();
    }
    $scope.secret = function(){
        $http({
          method: 'GET',
          url: '/secret'
        }).then(function successCallback(response) {
            $log.info(response.data);
          }, function errorCallback(response) {
            $log.error(response);
          });
    }
    

    $scope.getUser();
}]);

commerceApp.controller('profileController', ['$scope', '$location','$http','$log','$route','shareService',function($scope, $location, $http, $log, $route, shareService) {
$log.debug('profile controller reporting in');

    $scope.showEdit = false;

    $scope.profileEdit = function() {
    $scope.showEdit = true;
    }
    $scope.toProfile = function() {
    $scope.showEdit = false;
    }
    
    $scope.profileDelete = function(){
        var yesno = confirm("Are you sure you want to delete your account? This action can not be undone!");
        if (yesno == true) {
             $http({
              method: 'DELETE',
              url: '/deleteprofile'
            }).then(function successCallback(response) {
                $log.info(response);
                $log.debug(shareService.resetHeader);
                shareService.logout = true;
                $log.info(shareService.resetHeader);
                $location.path('/');
              }, function errorCallback(response) {
                $log.error('failed to delete profile : ' + response);
                });
        } else {

        }

    }


        $http({
          method: 'GET',
          url: '/profileInfo'
        }).then(function successCallback(response) {
            $log.info('profile success : ' + response.data);
            $scope.profileData = response.data;
          }, function errorCallback(response) {
            $log.error('profile fail : ' + response);
            });
}]);
