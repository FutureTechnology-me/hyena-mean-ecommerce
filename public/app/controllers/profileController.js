commerceApp.controller('profileController', ['$scope', '$location','$http','$log','$route','shareService',function($scope, $location, $http, $log, $route, shareService) {


    $scope.shareService = shareService;
    // hide edit form default
    $scope.showEdit = false;
    
    // function to display edit form
    $scope.profileEdit = function() {
    $scope.showEdit = true;
    }
    // function to hide edit form
    $scope.toProfile = function() {
    $scope.showEdit = false;
    }
    
    // delete profile
    $scope.profileDelete = function(){
        // prompt the user to confirm that they wish to delete their account
        var yesno = confirm("Are you sure you want to delete your account? This action can not be undone!");
        if (yesno == true) {
             $http({
              method: 'DELETE',
              url: '/profile'
            }).then(function successCallback(response) {
                // set logout to true in shareService - this will trigger loggout in the headerController
                shareService.logout();
                shareService.didLogout = true;
                // redirect to /
                $location.path('/');
              }, function errorCallback(response) {
                $log.error('failed to delete profile : ' + response);
                });
        } 

    };

    // get profile data for currently logged in user
    $scope.getProfileInfo = function(){
        $http({
          method: 'GET',
          url: '/profile'
        }).then(function successCallback(response) {
            //use response data to set profileData in $scope
            $scope.profileData = response.data;
          }, function errorCallback(response) {
            //debug error
            $log.error('profile fail : ' + response);
            });
    };

    $scope.getProfileInfo();
}]);
