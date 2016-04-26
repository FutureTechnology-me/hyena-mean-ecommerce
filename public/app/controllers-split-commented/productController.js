commerceApp.controller('productController', ['$scope', '$location','$http','$log','$route','ngCart', '$routeParams', 'shareService', function($scope, $location, $http, $log, $route, ngCart, $routeParams, shareService) {
    
    $scope.department = shareService.cat;
    $scope.subcategory = shareService.subcat;
    console.log('department scope' + shareService.cat)

    // retrieve product listing from db
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
    
    
    // generate our shop filter buttons based on product categories and subcategories in the db
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
    
    // reset our shop filters
    $scope.resetFilter = function(){
        $scope.department = "";
        shareService.cat = "";
        $scope.subcategory = "";
        shareService.subcat = "";
    }
    
    // set our category filter
    $scope.setCategory = function(category){
        $scope.department = category;
        shareService.cat = category;
        $scope.subcategory = "";
        shareService.subcat = "";
    }
    
    // set our subcategory filter
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
    
    // get products on load
    $scope.getProducts();
    

}]);