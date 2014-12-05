'use strict'

angular.module('DivinElegy.components.userMenu', ['DivinElegy.components.user', 'DivinElegy.components.hello']).
        
directive('userMenu', ['HelloService', 'UserService', function(HelloService, UserService) 
{
    return {
        templateUrl: 'components/userMenu/userMenu.html',
        link: function(scope, element){
            scope.doLogin = function()
            {
                HelloService.facebookLogin();
            };

            scope.doLogout = function()
            {
                HelloService.logout('facebook');
            };
            
            HelloService.on('auth.login.userReady', function()
            {
                UserService.getCurrentUser().then(function(user)
                {
                    console.log(user);
                    scope.welcomeMessage = 'Welcome, ' + user.displayName;
                    scope.quota = user.quota;
                    scope.quotaRemaining = user.quotaRemaining;
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

