commerceApp.controller('cartController', ['$scope', '$location','$http','$log','$route', 'ngCart', 'shareService', function($scope, $location, $http, $log, $route, ngCart, shareService) {
// this controller suppliments ng-cart with shipping info


$scope.totalShipping = shareService.totalShipping;

$scope.$watch('shareService.totalShipping', function(){
    $scope.totalShipping = shareService.totalShipping;
})


}]);