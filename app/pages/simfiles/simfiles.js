'use strict';

angular.module("DivinElegy.pages.simfiles", ["DivinElegy.components.simfiles"])

.controller("SimfileController", ['$scope', 'SimfileService', function($scope, SimfileService)
{
    $scope.artistFilterKeyword = null;
    $scope.titleFilterKeyword = null;
    $scope.simfileList = [];
    
    $scope.artistFilter = function (simfile) {
        var re = new RegExp($scope.artistFilterKeyword, 'i');
        return !$scope.artistFilterKeyword || re.test(simfile.artist);
    };
    
    $scope.titleFilter = function (simfile) {
        var re = new RegExp($scope.titleFilterKeyword, 'i');
        return !$scope.titleFilterKeyword || re.test(simfile.title);
    };

    SimfileService.getSimfiles().success(function(response)
    {
        console.log(response);
        $scope.simfileList = response;
    });
}]);