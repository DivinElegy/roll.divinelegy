'use strict';

// Declare app level module which depends on views, and components
angular.module('DivinElegy', [
  'ngRoute',
  'ngAnimate',
  //'DivinElegy.components.hello',
  'DivinElegy.components.menu',
  'DivinElegy.components.userMenu',
  'DivinElegy.components.simfiles',
  'DivinElegy.components.messages',
  'DivinElegy.pages.index',
  'DivinElegy.pages.upload',
  'DivinElegy.pages.account',
  'DivinElegy.pages.simfiles',
  'DivinElegy.pages.packs'
]).

config(['$routeProvider', '$locationProvider', function($routeProvider) {
    $routeProvider.
    when('/',
    {
        templateUrl: 'pages/index/index.html',
        controller: 'IndexController'
    }).
    when('/upload',
    {
        templateUrl: 'pages/upload/upload.html',
        controller: 'UploadController',
        resolve: {
            loginRequired : function(HelloService) {
                HelloService.redirectIfNotLoggedIn();
            }
        }
    }).
    when('/simfiles',
    {
        templateUrl: 'pages/simfiles/simfiles.html',
        controller: 'SimfileController'
    }).
    when('/packs',
    {
        templateUrl: 'pages/packs/packs.html',
        controller: 'PackController'
    }).
    when('/packs/test',
    {
        resolve: {
            load: function () {
                console.log("hello");
            }
        }
    }).
    otherwise({redirectTo: '/'});
}]).

//This feels to small to be in its own component thingy so
filter('startFrom', function()
{
   return function(input, start)
   {
       start = +start;
       return input.slice(start);
   }
}).

run(['HelloService', function(HelloService)
{
    HelloService.init({
        facebook : '383895074998288'
    });
}]);
    