// SERVICES
// The service we use to share data between controllers
commerceApp.service('shareService',['$location', '$http', '$log', function($location, $http, $log) {
    
    // shared variables
    // Should header log out? (will be fixed when we transfer functions to shared)
    this.didLogout = false;
    // product database
    this.items;
    // shipping total
    this.totalShipping;
    // cart tax total
    this.carttax;
    // category/department
    this.cat;
    // selected item
    this.currentItem;
    // subcategory 
    this.subcat;
    
    // shared functions
    
    // navigation functions
     // navigate to profile page
    this.toProfile = function(){
        $location.path('/profile');
    };
    // navigate to login page
    this.toLogin = function(){
        $location.path('/login');
    };
    // navigate to registration page
    this.toRegister = function(){
        $location.path('/register');
    };
        // view product details 
        this.details = function(product){
            // share the current item with other controllers via shareService
            this.currentItem = product;
            //use the product id as the route parameter in /details/:id
            $location.path('/details/' + product._id);
        };
            // view shopping cart
        this.toCart = function(){
            $location.path('/cart');
        };
        
        //view our ecommerce homepage (in this case the default route)
        this.goShopping = function(){
            $location.path('/');
        };    
    // auth routes
    // log the user out, set displayLogin to true, redirect to home page
    this.logout = function(){
        $http.get('/logout');
        this.didLogout = true;
        $location.path('/');
        // $route.reload();
    };

    // call authentication debug route
    this.secret = function(){
        $http({
          method: 'GET',
          url: '/secret'
        }).then(function successCallback(response) {
            $log.info(response.data);
          }, function errorCallback(response) {
            $log.error(response);
          });
    };

    
}]);
