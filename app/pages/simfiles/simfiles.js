'use strict';

angular.module("DivinElegy.pages.simfiles", ["DivinElegy.components.simfiles","DivinElegy.components.config", "ui.bootstrap"])

.controller("SimfileController", ['$scope', 'rockEndpoint', 'SimfileService', function($scope, rockEndpoint, SimfileService)
{
    $scope.rockEndpoint = rockEndpoint;
    $scope.artistFilterKeyWord = null;
    $scope.songTitleFilterKeyword = null;
    $scope.difficultyFilterKeyword = 'Any';
    $scope.ratingFilterKeyword = null;
    $scope.stepArtistFilterKeyword = null;
    $scope.fgChangesFilterKeyword = 'Any';
    $scope.bgChangesFilterKeyword = 'Any';
    $scope.bpmChangesFilterKeyword = 'Any';
    $scope.modeFilterKeyword = 'Any';

    $scope.titleFilter = function (simfile)
    {
        var re = new RegExp($scope.titleFilterKeyword, 'i');
        return !$scope.songTitleFilterKeyword || re.test(simfile.title);
    };
        
    $scope.artistFilter = function (simfile)
    {
        var re = new RegExp($scope.artistFilterKeyword, 'i');
        return !$scope.artistFilterKeyword || re.test(simfile.artist);
    };
    
    $scope.fgChangesFilter = function(simfile)
    {
        return $scope.fgChangesFilterKeyword === 'Any' || simfile.fgChanges === $scope.fgChangesFilterKeyword;
    };

    $scope.bgChangesFilter = function(simfile)
    {
        return $scope.bgChangesFilterKeyword === 'Any' || simfile.bgChanges === $scope.bgChangesFilterKeyword;
    };
    
    $scope.bpmChangesFilter = function(simfile)
    {
        return $scope.bpmChangesFilterKeyword === 'Any' || simfile.bpmChanges === $scope.bpmChangesFilterKeyword;
    };

    $scope.chartsFilter = function(simfile)
    {
        if(
           !$scope.ratingFilterKeyword &&
           !$scope.stepArtistFilterKeyword &&
           $scope.modeFilterKeyword === 'Any' &&
           $scope.difficultyFilterKeyword === 'Any'
           )
        {
            return true;
        }
        
        var stepArtistRe = new RegExp($scope.stepArtistFilterKeyword, 'i');
        var steps = [simfile.steps.single, simfile.steps.double];
        var modeKeywordMap = ['single', 'double'];
        var match = false;
        
        loop1:
        for(var i=0; i<steps.length; i++)
        {
        loop2:
            for(var j=0; j<steps[i].length; j++)
            {
                var chart = steps[i][j];
                console.log($scope.modeFilterKeyword);
                console.log(simfile.steps[$scope.modeFilterKeyword]);
                console.log($scope.modeFilterKeyword === 'Any' || simfile.steps[$scope.modeFilterKeyword].length);
                match = (!$scope.stepArtistFilterKeyword || stepArtistRe.test(chart.artist)) &&
                        (!$scope.ratingFilterKeyword || (!isNaN($scope.ratingFilterKeyword) && chart.rating === Number($scope.ratingFilterKeyword))) &&
                        ($scope.difficultyFilterKeyword === 'Any' || chart.difficulty === $scope.difficultyFilterKeyword) &&
                        ($scope.modeFilterKeyword === 'Any' || modeKeywordMap[i] === $scope.modeFilterKeyword);
                
                if(match) break loop1;
            }
        }
        
        return match;
    }
    
    SimfileService.getSimfiles().then(function(simfiles)
    {
        $scope.simfileList = simfiles;
    });
}]);