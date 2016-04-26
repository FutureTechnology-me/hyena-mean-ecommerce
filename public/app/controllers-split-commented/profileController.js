commerceApp.controller('profileController', ['$scope', '$location','$http','$log','$route',function($scope, $location, $http, $log, $route) {
$log.debug('profile controller reporting in');

    $scope.showEdit = false;
    
    // toggle edit form on
    $scope.profileEdit = function() {
    $scope.showEdit = true;
    }
    // toggle edit form off
    $scope.toProfile = function() {
    $scope.showEdit = false;
    }

        // retrieve profile data from db (if no user is logged in a warning message replaces the profile template)
        $http({
          method: 'GET',
          url: '/profileInfo'
        }).then(function successCallback(response) {
            $log.info('profile success : ' + response.data);
            $scope.profileData = response.data;
          }, function errorCallback(response) {
            $log.error('profile fail : ' + response);
            });
}]);