'use strict';

angular.module("DivinElegy.pages.upload", ['angularFileUpload', 'DivinElegy.components.config'])

.controller("UploadController", ['rockEndpoint', '$scope', 'FileUploader', function(rockEndpoint, $scope, FileUploader)
{
    var uploader = $scope.uploader = new FileUploader(
    {
        url: rockEndpoint + 'simfiles/upload'
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