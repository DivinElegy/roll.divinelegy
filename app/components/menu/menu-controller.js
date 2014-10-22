'use strict';

angular.module("DivinElegy.components.menu", ["DivinElegy.components.hello", "DivinElegy.components.user"]).
    
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
}]);