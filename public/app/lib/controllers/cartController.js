
commerceApp.controller('cartController', ['$scope', '$location','$http','$log','$route', 'ngCart', 'shareService', function($scope, $location, $http, $log, $route, ngCart, shareService) {

// get shipping total from shareService
$scope.totalShipping = shareService.totalShipping;

//watch shareService.totalShipping
$scope.$watch('shareService.totalShipping', function(){
    //Update $scope to match changes
    $scope.totalShipping = shareService.totalShipping;
});


}]);