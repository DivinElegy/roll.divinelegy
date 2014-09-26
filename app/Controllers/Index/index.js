'use strict';

angular.module("DivinElegy.Controllers.Index", ['ngRoute'])

.config(['$routeProvider', function($routeProvider)
{
  $routeProvider.when('/',
  {
    templateUrl: 'Controllers/Index/index.html',
    controller: 'IndexController'
  });
}])

.controller("IndexController", ['$scope', function($scope)
{
    $scope.simpleVariable = 'hello';
}]);