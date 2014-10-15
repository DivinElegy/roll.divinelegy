'use strict';

angular.module("DivinElegy.components.menu", ["DivinElegy.components.hello"]).
    
//TODO: This really should be done with directives if I want to reuse the login link stuff    
controller("MenuController", ['$scope', 'HelloService', function($scope, HelloService)
{    
    $scope.doLogin = function()
    {
        HelloService.facebookLogin();
    };
    
    $scope.doLogout = function()
    {
        HelloService.logout('facebook');
    };

    $scope.loggedIn = false;
    $scope.loggedOut = true;
    $scope.loginLink = 'Login';
    
    HelloService.on('auth.login', function(auth)
    {
        HelloService(auth.network).api('/me').then(function(r)
        {
            $scope.loggedIn = true;
            $scope.loggedOut = false;
            $scope.greeting = 'Hi ' + r.name;
            $scope.logoutLink = 'Logout';
            $scope.$apply();
        });
    });
    
    HelloService.on('auth.logout', function(auth)
    {
        $scope.loggedIn = false;
        $scope.loggedOut = true;
        $scope.greeting = null;
        $scope.loginLink = 'Login';
        $scope.$apply();
    });
}]);