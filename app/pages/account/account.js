'use strict';

angular.module("DivinElegy.pages.account", ['DivinElegy.components.ui'])

.controller("AccountController", ['$scope', '$modalInstance', 'UiSettingsService', function($scope, $modalInstance, UiSettingsService)
{
    $scope.simfilesPerPage = UiSettingsService.getDirective('simfilesPerPage');
    
    $scope.ok = function()
    {
        UiSettingsService.setDirective('simfilesPerPage', $scope.simfilesPerPage);
    };
    
    $scope.cancel = function()
    {
        $modalInstance.dismiss('cancel');
    };
}]);