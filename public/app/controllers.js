// CONTROLLERS
commerceApp.controller('mainController', ['$scope', '$location','$http','$log','$route', 'ngCart', 'shareService', '$routeParams', function($scope, $location, $http, $log, $route, ngCart, shareService, $routeParams) {
    // set tax rate
    ngCart.setTaxRate(7.5);
    // set default shipping value for ng-cart
    ngCart.setShipping(2.99);
    
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
    };
    
    
    $scope.randomShipping = function(){
        //return a random number between 5 and 50
      return Math.random() * (50.00 - 5.00) + 5.00;
    }
    
    // get cart details any time the mainController is active
    $scope.cartDetails();

}]);

commerceApp.controller('checkoutController', ['$scope', '$location','$http','$log','$route', 'ngCart', 'shareService', function($scope, $location, $http, $log, $route, ngCart, shareService) {

// get items from shareService
$scope.items = shareService.items;
// get cart tax from shareService
$scope.carttax = shareService.carttax;
// watch shareService.item for changes 
$scope.$watch('shareService.items', function(){
    // update $scope to match shareService changes
    $scope.items = shareService.items;
});
// watch shareService.item for changes
$scope.$watch('shareService.carttax', function(){
    // update $scope to match shareService changes
    $scope.carttax = shareService.carttax;
});

}]);

commerceApp.controller('cartController', ['$scope', '$location','$http','$log','$route', 'ngCart', 'shareService', function($scope, $location, $http, $log, $route, ngCart, shareService) {

// get shipping total from shareService
$scope.totalShipping = shareService.totalShipping;

//watch shareService.totalShipping
$scope.$watch('shareService.totalShipping', function(){
    //Update $scope to match changes
    $scope.totalShipping = shareService.totalShipping;
});


}]);

commerceApp.controller('detailsController', ['$scope', '$location','$http','$log','$route', 'ngCart', 'shareService', '$routeParams', function($scope, $location, $http, $log, $route, ngCart, shareService, $routeParams) {
        
        // Retrieve department category from shareService
        $scope.department = shareService.cat;
        
        // Retrieve the item id from $routeParams
        $scope.currentItem = $routeParams.id;
        
        // shared functions
        $scope.details= shareService.details;
        $scope.toCart = shareService.toCart;
        $scope.backShopping = shareService.goShopping;


        // retrieve products from db
        $scope.getDetails = function(){
            $http({
                method: 'GET',
                url: '/products'
            }).then(function successCallback(response){
                // debug response data
                //$log.debug('getDetails success : ' + JSON.stringify(response.data) );
                
                //use response data to create products array in scope
                $scope.products = response.data;
                
                // debug products array
                // $log.debug($scope.products);
                
                // loop through products array
                for (var i = 0; i < $scope.products.length ; i++){
                    // find the object which has an id matching the route :id
                    if ($scope.products[i]._id == $scope.currentItem){
                        // display match info for debugging loop
                        $log.info('MATCH AT product ' + i + ' product id : ' + $scope.products[i]._id + ' matches ' + $scope.currentItem);
                        // set thisProduct with matching result
                        $scope.thisProduct = $scope.products[i];
                    }
                }
                
                // If there is no match log as an error for debugging (This should never happen)
                if ($scope.thisProduct === undefined){
                    $log.error('unable to find match in product database. Please check url');
                }
            }, function errorCallback(response){
                $log.error('getDetails error : ' + response);
            });
        };// ========================================================================================== END getDetails()
    

    
    // show other products in category if a category is selected
    $scope.filterFunction = function(element) {
        // Check if the current items department matches the shareService category, and set this bool
      var departmentMatch = element.department.match(shareService.cat) ? true : false;
      // return a bool based on the bool
      return (departmentMatch === true) ? true : false;
    };
    
    // get details any time detailsController is active 
    $scope.getDetails();

}]);

commerceApp.controller('productController', ['$scope', '$location','$http','$log','$route','ngCart', '$routeParams', 'shareService', function($scope, $location, $http, $log, $route, ngCart, $routeParams, shareService) {
    
    //set filter variable department to shareService category
    $scope.department = shareService.cat;
    // set filter variable subcategory to shareService subcategory
    $scope.subcategory = shareService.subcat;

    //GET products from database
    $scope.getProducts = function(){
        $http({
            method: 'GET',
            url: '/products'
        }).then(function successCallback(response){
            //debug response
            $log.debug('getProducts success : ' + JSON.stringify(response.data) );
            //set products to match response data
            $scope.products = response.data;
            //debug products
            $log.debug($scope.products);
            //execute buttonFilter();
            $scope.buttonFilter();
        }, function errorCallback(response){
            $log.error('getProducts error : ' + response);
        });
    }
    
    
    $scope.buttonFilter = function(){
        // creat blank subcategories array
        var subcategoriesArray = [];
        // create blank categories array
        var categoriesArray = [];
        
        // loop through products
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
          
          // send category array to scope
          $scope.categoriesInfo = categoriesArray;
          // send subcategories array to scope
          $scope.subcategoriesInfo = subcategoriesArray;

    };
    
    // clear filter variables in $scope and shareService
    $scope.resetFilter = function(){
        $scope.department = "";
        shareService.cat = "";
        $scope.subcategory = "";
        shareService.subcat = "";
    }
    
    // set category in $scope and shareService
    $scope.setCategory = function(category){
        $scope.department = category;
        shareService.cat = category;
        $scope.subcategory = "";
        shareService.subcat = "";
    }
    
    // set category and subcategory in $scope and shareService
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
      // return whether or not the product matched so that angular knows whether or not to display it
      return (departmentMatch && subcategoryMatch === true) ? true : false;
    };
    
    // get products from the database any time productController is active
    $scope.getProducts();
    

}]);

commerceApp.controller('headerController', ['$scope', '$location','$http','$log','$route', "shareService",function($scope, $location, $http, $log, $route, shareService) {
  // header template array --- not necessary yet but in the future we'll add easy to change templates
  $scope.header =[ { name: 'header.html', url: 'app/pages/header.html'} ];
  // set header 
  $scope.header = $scope.header[0];
  
  // save shareService to $scope
  $scope.shareService = shareService;
  $scope.toProfile = shareService.toProfile;
  $scope.toLogin = shareService.toLogin;
  $scope.toRegister = shareService.toRegister;
  $scope.logout = shareService.logout;
  
  // default displayLogin bool to true 
  $scope.displayLogin = true;
  
    // watch the logout bool in shareService 
    $scope.$watch('shareService.didLogout', function(newVal, oldVal){
        // if shareService just logged out
        if(newVal === true){
            // reset the trigger
            shareService.didLogout = false;
            // display the login nav
            $scope.displayLogin = true;
        }
    });

    // get username
    $scope.getUser = function(){
    $http({
      method: 'GET',
      url: '/user'
    }).then(function successCallback(response) {
        // set user in $scope with response data
        $scope.user = response.data;
        //debug response data
        $log.debug("/user callback was : " + JSON.stringify(response.data));
        
        // check if a user is logged in and set displayLogin to appropriate value
        if($scope.user === ''){
            $scope.displayLogin = true;
        } else {$scope.displayLogin = false;}
      }, function errorCallback(response) {
        $log.error("/user error was : " + response);
        $scope.user = "user error";
      });
    }
    
    // get user data any time the headerController is active
    $scope.getUser();
}]);

commerceApp.controller('profileController', ['$scope', '$location','$http','$log','$route','shareService',function($scope, $location, $http, $log, $route, shareService) {

    // hide edit form default
    $scope.showEdit = false;
    
    // function to display edit form
    $scope.profileEdit = function() {
    $scope.showEdit = true;
    }
    // function to hide edit form
    $scope.toProfile = function() {
    $scope.showEdit = false;
    }
    
    // delete profile
    $scope.profileDelete = function(){
        // prompt the user to confirm that they wish to delete their account
        var yesno = confirm("Are you sure you want to delete your account? This action can not be undone!");
        if (yesno == true) {
             $http({
              method: 'DELETE',
              url: '/deleteprofile'
            }).then(function successCallback(response) {
                $log.info(response);
                // set logout to true in shareService - this will trigger loggout in the headerController
                shareService.logout();
                // redirect to /
                $location.path('/');
              }, function errorCallback(response) {
                $log.error('failed to delete profile : ' + response);
                });
        } 

    };

    // get profile data for currently logged in user
    $scope.getProfileInfo = function(){
        $http({
          method: 'GET',
          url: '/profileInfo'
        }).then(function successCallback(response) {
            //debug profile response data
            $log.info('profile success : ' + response.data);
            //use response data to set profileData in $scope
            $scope.profileData = response.data;
          }, function errorCallback(response) {
            //debug error
            $log.error('profile fail : ' + response);
            });
    };

    $scope.getProfileInfo();
}]);
