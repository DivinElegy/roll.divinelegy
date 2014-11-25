'use strict';

angular.module("DivinElegy.pages.upload", ['angularFileUpload', 'DivinElegy.components.config', 'DivinElegy.components.hello'])

.controller("UploadController", ['rockEndpoint', 'HelloService', '$scope', 'FileUploader', function(rockEndpoint, HelloService, $scope, FileUploader)
{
    
    $scope.token = HelloService.getAccessToken();
    
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