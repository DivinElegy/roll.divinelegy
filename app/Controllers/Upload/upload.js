'use strict';

angular.module("DivinElegy.Controllers.Upload", ['ngRoute', 'angularFileUpload'])

.config(['$routeProvider', function($routeProvider)
{
  $routeProvider.when('/upload',
  {
    templateUrl: 'Controllers/Upload/upload.html',
    controller: 'UploadController'
  });
}])

.controller("UploadController", ['$scope', 'FileUploader', function($scope, FileUploader)
{
    var uploader = $scope.uploader = new FileUploader(
    {
        url: 'http://rock.divinelegy.meeples/simfiles/upload'
    });
    
    uploader.filters.push(
    {
        name: 'customFilter',
        fn: function(item, options)
        {
            return this.queue.length < 10;
        }
    })
}]);