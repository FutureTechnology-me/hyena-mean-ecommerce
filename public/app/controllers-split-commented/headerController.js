commerceApp.controller('headerController', ['$scope', '$location','$http','$log','$route',function($scope, $location, $http, $log, $route) {
  // header object to hold header templates
  $scope.header =[ { name: 'header.html', url: 'app/pages/header.html'} ];
  // select header template  (though this is irrelivent with 1 template, I've used this method to remind myself
  // how easy it is to set up a modular system like a blog with custom layouts)
  $scope.header = $scope.header[0];
  
  $scope.displayLogin = true;
  
  // check if there is a user logged in
    $scope.getUser = function(){
    $http({
      method: 'GET',
      url: '/user'
    }).then(function successCallback(response) {
        // $scope.user = JSON.stringify(response.data);
        $scope.user = response.data;
        $log.debug("/user callback was : " + JSON.stringify(response.data));
        // check if a user is logged in and set displayLogin for css
        if($scope.user === ''){
            console.log('detected no user')
            $scope.displayLogin = true;
        } else {$scope.displayLogin = false;}
      }, function errorCallback(response) {
        $log.error("/user error was : " + response);
        $scope.user = "user error";
      });
    }
    
    //---------------------------------- navigation functions
    $scope.toProfile = function(){
        $location.path('/profile');
    }
    
    $scope.toLogin = function(){
        $location.path('/login');
    }
    
    $scope.toRegister = function(){
        $location.path('/register');
    }
    
    $scope.logout = function(){
        $http.get('/logout');
        $scope.displayLogin = true;
        $location.path('/');
        // $route.reload();
    }
    
    // auth check (debugging)
    $scope.secret = function(){
        $http({
          method: 'GET',
          url: '/secret'
        }).then(function successCallback(response) {
            $log.info(response.data);
          }, function errorCallback(response) {
            $log.error(response);
          });
    }
    

    $scope.getUser();
}]);