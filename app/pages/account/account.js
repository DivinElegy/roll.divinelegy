'use strict';

angular.module("DivinElegy.pages.account", ['DivinElegy.components.ui'])

.controller("AccountController", ['$scope', '$modalInstance', 'UiSettingsService', function($scope, $modalInstance, UiSettingsService)
{
    $scope.hidden = true;
    $scope.simfilesPerPage = UiSettingsService.getDirective('simfilesPerPage');
    $scope.simfilesPerPageAuto = UiSettingsService.getDirective('simfilesPerPageAuto');
    $scope.downloadWarnings = UiSettingsService.getDirective('showDownloadWarning');
    
    $scope.ok = function()
    {
        UiSettingsService.setDirective('simfilesPerPage', $scope.simfilesPerPage);
        UiSettingsService.setDirective('simfilesPerPageAuto', $scope.simfilesPerPageAuto);
        UiSettingsService.setDirective('showDownloadWarning', $scope.downloadWarnings);
        $scope.hidden = false;
        $scope.messageType = 'success';
        $scope.status = 'Saved!';
    };
    
    $scope.cancel = function()
    {
        $modalInstance.dismiss('cancel');
    };
}]);