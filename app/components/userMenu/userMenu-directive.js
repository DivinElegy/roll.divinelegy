'use strict'

angular.module('DivinElegy.components.userMenu', ['DivinElegy.components.user', 'DivinElegy.components.hello', 'ui.bootstrap']).
        
directive('userMenu', ['HelloService', 'UserService', '$modal', function(HelloService, UserService, $modal) 
{
    return {
        templateUrl: 'components/userMenu/userMenu.html',
        link: function(scope, element){
            scope.menuReady = !HelloService.isLoggedIn()
            
            scope.doLogin = function()
            {
                scope.menuReady = false;
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
                    scope.welcomeMessage = 'Logged in as ' + user.displayName;
                    scope.quota = user.quota;
                    scope.quotaRemaining = user.quotaRemaining;
                    scope.loggedIn = true;
                    scope.menuReady = true;
                    scope.$$phase || scope.$apply();
                });
            });
            
            HelloService.on('auth.logout', function()
            {
                UserService.flushCache();
                scope.welcomeMessage = '';
                scope.loggedIn = false;
                scope.$$phase || scope.$apply();
            });
            
            scope.openAccountSettings = function()
            {
                $modal.open({
                    templateUrl: 'pages/account/account.html',
                    controller: 'AccountController',
                });
            };
        }
    };
}]);

