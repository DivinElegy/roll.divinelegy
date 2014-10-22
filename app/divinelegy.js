'use strict';

// Declare app level module which depends on views, and components
angular.module('DivinElegy', [
  'ngRoute',
  'DivinElegy.components.hello',
  'DivinElegy.components.user',
  'DivinElegy.components.menu',
  'DivinElegy.components.userMenu',
  'DivinElegy.pages.index',
  'DivinElegy.pages.upload'
]).

config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/',
    {
        templateUrl: 'pages/index/index.html',
        controller: 'IndexController'
    }).
    when('/upload',
    {
        templateUrl: 'pages/upload/upload.html',
        controller: 'UploadController' 
    }).
    otherwise({redirectTo: '/'});
}]).
        
run(['HelloService', function(HelloService)
{
    HelloService.init({
        facebook : '383895074998288'
    });
}]);
    