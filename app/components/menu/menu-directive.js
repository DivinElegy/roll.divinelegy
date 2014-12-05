'use strict';

//Module is defined in menu-controller.js so we only use angular.module(name) to retrieve and add to it.
angular.module('DivinElegy.components.menu', []).
        
directive('menu', [function() 
{
    return {
        templateUrl: 'components/menu/menu.html'
    };
}]);

