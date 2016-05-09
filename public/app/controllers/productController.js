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
            //set products to match response data
            $scope.products = response.data;
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
          // we have subcategoriesArray[#] containing a list of subcategories for the corresponding value in categoriesArray
          
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