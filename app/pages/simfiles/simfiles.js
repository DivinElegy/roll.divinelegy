'use strict';

angular.module("DivinElegy.pages.simfiles", ["DivinElegy.components.simfiles","DivinElegy.components.config"])

.controller("SimfileController", ['$scope', 'rockEndpoint', 'SimfileService', function($scope, rockEndpoint, SimfileService)
{
    $scope.rockEndpoint = rockEndpoint;
    $scope.activeListings = [];
    $scope.artistFilterKeyword = null;
    $scope.titleFilterKeyword = null;
    $scope.difficultyFilterKeyword = 'Any';
    $scope.ratingFilterKeyword = null;
    $scope.stepArtistFilterKeyword = null;
    $scope.fgChangesFilterKeyword = null;
    $scope.bgChangesFilterKeyword = null;
    $scope.bpmChangesFilterKeyword = null;
    $scope.simfileList = [];
    
    $scope.openListing = function(listing)
    {
        if($scope.isListingActive(listing))
        {
            $scope.activeListings.splice($scope.activeListings.indexOf(listing), 1);
        } else {
            $scope.activeListings.push(listing);
        }
    };
    
    $scope.isListingActive = function(listing)
    {
        if($scope.activeListings.indexOf(listing) > -1)
        {
            return true;
        } else {
            return false;
        }
    };
    
    $scope.artistFilter = function (simfile)
    {
        var re = new RegExp($scope.artistFilterKeyword, 'i');
        return !$scope.artistFilterKeyword || re.test(simfile.artist);
    };
    
    $scope.titleFilter = function (simfile)
    {
        var re = new RegExp($scope.titleFilterKeyword, 'i');
        return !$scope.titleFilterKeyword || re.test(simfile.title);
    };
    
    $scope.stepsFilter = function(simfile)
    {
        // Step 0: Both rating and difficulty keyword are null
        if(!$scope.ratingFilterKeyword && $scope.difficultyFilterKeyword === 'Any' && !$scope.stepArtistFilterKeyword)
        {
            return true;
        }
        
        var re = new RegExp($scope.stepArtistFilterKeyword, 'i');
  
        for(var i in simfile.steps.single)
        {
            var chartInfo = simfile.steps.single[i];
            
            if($scope.ratingFilterKeyword && chartInfo.rating !== $scope.ratingFilterKeyword)
            {
                return false;
            }
            
            if($scope.difficultyFilterKeyword !== 'Any' && chartInfo.difficulty !== $scope.difficultyFilterKeyword)
            {
                return false;
            }
            
            if($scope.stepArtistFilterKeyword && !re.test(chartInfo.artist))
            {
                console.log('woo');
                return false;
            }
            
            return true;
        }
        
        for(var i in simfile.steps.double)
        {
            var chartInfo = simfile.steps.double[i];
            
            if($scope.ratingFilterKeyword && chartInfo.rating !== $scope.ratingFilterKeyword)
            {
                return false;
            }
            
            if($scope.difficultyFilterKeyword !== 'Any' && chartInfo.difficulty !== $scope.difficultyFilterKeyword)
            {
                return false;
            }
            
            if($scope.stepArtistFilterKeyword && !re.test(chartInfo.artist))
            {
                console.log('woo');
                return false;
            }
            
            return true;
        }
       
        return false;
    };

    $scope.fgChangesFilter = function(simfile)
    {
            return !$scope.fgChangesFilterKeyword || simfile.fbChanges === 'Yes';
    };
    
    $scope.bgChangesFilter = function(simfile)
    {
            return !$scope.bgChangesFilterKeyword || simfile.bgChanges === 'Yes';
    };

    $scope.bpmChangesFilter = function(simfile)
    {
            return !$scope.bpmChangesFilterKeyword || simfile.bpmChanges === 'Yes';
    };
    
    SimfileService.getSimfiles().then(function(simfiles)
    {
        $scope.simfileList = simfiles;
    });
}]);