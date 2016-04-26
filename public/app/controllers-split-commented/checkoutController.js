commerceApp.controller('checkoutController', ['$scope', '$location','$http','$log','$route', 'ngCart', 'shareService', function($scope, $location, $http, $log, $route, ngCart, shareService) {
// this controller provides ng-cart with our product listing and tax rate

$scope.items = shareService.items;
$scope.carttax = shareService.carttax;

$scope.$watch('shareService.items', function(){
    $scope.items = shareService.items;
})

$scope.$watch('shareService.carttax', function(){
    $scope.carttax = shareService.carttax;
})

}]);