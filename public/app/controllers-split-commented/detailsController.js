commerceApp.controller('detailsController', ['$scope', '$location','$http','$log','$route', 'ngCart', 'shareService', '$routeParams', function($scope, $location, $http, $log, $route, ngCart, shareService, $routeParams) {
// this controller handles our details view page
        
        //figure out department
        $scope.department = shareService.cat;
        //figure out product id    
        $scope.currentItem = $routeParams.id;

        
        $scope.details = function(product){
            shareService.currentItem = product;
            $location.path('/details/' + product._id);
        }


        // pull product details from db
        $scope.getDetails = function(){
        $http({
            method: 'GET',
            url: '/products'
        }).then(function successCallback(response){
            $log.debug('getDetails success : ' + JSON.stringify(response.data) );
            $scope.products = response.data;
            $log.debug($scope.products);
            // check response data for match to id
            for (var i = 0; i < $scope.products.length ; i++){
                // if we find a match add product to scope
                if ($scope.products[i]._id == $scope.currentItem){
                    $log.info('MATCH AT product ' + i + ' product id : ' + $scope.products[i]._id + ' matches ' + $scope.currentItem);
                    $scope.thisProduct = $scope.products[i];
                }
            }
            // in event no match is found log message as error
            if ($scope.thisProduct === undefined){
                $log.error('unable to find match in product database. Please check url');
            } // in event of callback error, log error in console
            }, function errorCallback(response){
                $log.error('getDetails error : ' + response);
            });
        }
    
    // return to home page (maintains current filters)
    $scope.backShopping = function(){
        $location.path('/');
    }
    
    // view cart page
    $scope.toCart = function(){
        $location.path('/cart');
    }
    
    // filter for "related items"
    $scope.filterFunction = function(element) {
      var departmentMatch = element.department.match(shareService.cat) ? true : false;
      return (departmentMatch === true) ? true : false;
    };
    
    // get product details on load
    $scope.getDetails();

}]);