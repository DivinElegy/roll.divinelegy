'use strict';

// Declare app level module which depends on views, and components
angular.module('DivinElegy', [
  'ngRoute',
  'DivinElegy.Controllers.Index',
  'DivinElegy.Controllers.Upload'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]);
