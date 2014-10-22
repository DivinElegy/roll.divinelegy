'use strict'

angular.module('DivinElegy.components.userMenu', ['DivinElegy.components.hello']).
        
directive('userMenu', ['HelloService', function(HelloService) 
{
    return {
        templateUrl: 'components/userMenu/userMenu.html',
        link: function(scope, element){
            HelloService.on('auth.login', function()
            {
                scope.showMenu = true;
            });
            
            HelloService.on('auth.logout', function()
            {
                scope.showMenu = false;
                scope.$apply();
            });
        }
    };
}]);

