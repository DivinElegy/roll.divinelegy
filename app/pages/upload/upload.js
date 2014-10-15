'use strict';

angular.module("DivinElegy.pages.upload", ['angularFileUpload'])

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
    });
}]);