'use strict';

angular.module("DivinElegy.pages.account", ['DivinElegy.components.ui'])

.controller("AccountController", ['$scope', '$modalInstance', 'UiSettingsService', function($scope, $modalInstance, UiSettingsService)
{
    $scope.simfilesPerPage = UiSettingsService.getDirective('simfilesPerPage');
    $scope.downloadWarnings = UiSettingsService.getDirective('showDownloadWarning');
    
    $scope.ok = function()
    {
        UiSettingsService.setDirective('simfilesPerPage', $scope.simfilesPerPage);
        UiSettingsService.setDirective('showDownloadWarning', $scope.downloadWarnings);
        $scope.status = "Saved!";
    };
    
    $scope.cancel = function()
    {
        $modalInstance.dismiss('cancel');
    };
}]);