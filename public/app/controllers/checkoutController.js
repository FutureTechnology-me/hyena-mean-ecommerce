
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