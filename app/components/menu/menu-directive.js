'use strict';

//Module is defined in menu-controller.js so we only use angular.module(name) to retrieve and add to it.
angular.module('DivinElegy.components.menu').
        
directive('menu', ['HelloService', 'UserService', function(HelloService, UserService) 
{
    return {
        templateUrl: 'components/menu/menu.html',
        link: function(scope, element){
            HelloService.on('auth.login.userReady', function()
            {
                UserService.getCurrentUser().then(function(user)
                {
                    scope.welcomeMessage = 'Welcome, ' + user.displayName;
                    scope.loggedIn = true;
                    scope.$$phase || scope.$apply();
                });
            });
            
            HelloService.on('auth.logout', function()
            {
                scope.welcomeMessage = '';
                scope.loggedIn = false;
                scope.$$phase || scope.$apply();
            });
        }
    };
}]);

