commerceApp.controller('detailsController', ['$scope', '$location','$http','$log','$route', 'ngCart', 'shareService', '$routeParams', function($scope, $location, $http, $log, $route, ngCart, shareService, $routeParams) {
        
        // Retrieve department category from shareService
        $scope.department = shareService.cat;
        
        // Retrieve the item id from $routeParams
        $scope.currentItem = $routeParams.id;
        
        
        // shared functions
        $scope.details= shareService.details;
        $scope.toCart = shareService.toCart;
        $scope.goShopping = shareService.goShopping;


        // retrieve products from db
        $scope.getDetails = function(){
            $http({
                method: 'GET',
                url: '/products'
            }).then(function successCallback(response){
                //use response data to create products array in scope
                $scope.products = response.data;
                
                // debug products array
                // $log.debug($scope.products);
                
                // loop through products array
                for (var i = 0; i < $scope.products.length ; i++){
                    // find the object which has an id matching the route :id
                    if ($scope.products[i]._id == $scope.currentItem){
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
      var sameItem = element._id.match($scope.thisProduct._id) ? true : false;
      // return a bool based on the bool
      return (departmentMatch === true && sameItem === false) ? true : false;
    };
    
    // get details any time detailsController is active 
    $scope.getDetails();

}]);
