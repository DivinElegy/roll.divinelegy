'use strict';

angular.module("DivinElegy.pages.packs", ["DivinElegy.components.simfiles","DivinElegy.components.config"])

.controller("PackController", ['$scope', 'rockEndpoint', 'SimfileService', function($scope, rockEndpoint, SimfileService)
{
    $scope.rockEndpoint = rockEndpoint;
    $scope.activeListings = [];
    $scope.packTitleFilterKeyword = null;
    $scope.artistFilterKeyword = null;
    $scope.songTitleFilterKeyword = null;
    $scope.difficultyFilterKeyword = 'Any';
    $scope.ratingFilterKeyword = null;
    $scope.contributorFilterKeyword = null;
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
    
    $scope.getContributors = function(contribs)
    {
        return contribs.join(', ');
    }
    
    $scope.getSimfileListingIndex = function(packName, index)
    {
        return packName + "" + index;
    }
    
    $scope.packTitleFilter = function (pack)
    {
        var re = new RegExp($scope.packTitleFilterKeyword, 'i');
        return !$scope.packTitleFilterKeyword || re.test(pack.title);
    };
    
    $scope.artistFilter = function (pack)
    {
        var re = new RegExp($scope.artistFilterKeyword, 'i');
        var simfiles = pack.simfiles;
        var match = false;
        for(var i=0; i<simfiles.length; i++)
        {
            match = re.test(simfiles[i].artist);
            if(match) break;
        }
        
        return !$scope.artistFilterKeyword || match;
    };
    
    $scope.songTitleFilter = function (pack)
    {
        var re = new RegExp($scope.songTitleFilterKeyword, 'i');
        var simfiles = pack.simfiles;
        var match = false;
        for(var i=0; i<simfiles.length; i++)
        {
            match = re.test(simfiles[i].title);
            if(match) break;
        }
        
        return !$scope.songTitleFilterKeyword || match;
    };
    
    $scope.stepsFilter = function(pack)
    {
        // Step 0: Both rating and difficulty keyword are null
        if(!$scope.ratingFilterKeyword && $scope.difficultyFilterKeyword === 'Any' && !$scope.stepArtistFilterKeyword)
        {
            return true;
        }
        
        var re = new RegExp($scope.stepArtistFilterKeyword, 'i');
        var simfiles = pack.simfiles;
        
        for(var i=0; i<simfiles.length; i++)
        {
            for(var j=0; j<simfiles[i].steps.single.length; j++)
            {
                var chartInfo = simfiles[i].steps.single[j];
                var match = true;
                if($scope.ratingFilterKeyword && chartInfo.rating !== $scope.ratingFilterKeyword)
                {
                    match = false;
                }

                if($scope.difficultyFilterKeyword !== 'Any' && chartInfo.difficulty !== $scope.difficultyFilterKeyword)
                {
                    match = false;
                }

                if($scope.stepArtistFilterKeyword && !re.test(chartInfo.artist))
                {
                    match = false;
                }

                if(match) return true;
            }
            
            for(var j=0; j<simfiles[i].steps.double.length; j++)
            {
                var chartInfo = simfiles[i].steps.double[j];
                var match = true;
                if($scope.ratingFilterKeyword && chartInfo.rating !== $scope.ratingFilterKeyword)
                {
                    match = false;
                }

                if($scope.difficultyFilterKeyword !== 'Any' && chartInfo.difficulty !== $scope.difficultyFilterKeyword)
                {
                    match = false;
                }

                if($scope.stepArtistFilterKeyword && !re.test(chartInfo.artist))
                {
                    match = false;
                }

                if(match) return true;;
            }
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
    
    SimfileService.getPacks().then(function(packs)
    {
        $scope.packList = packs;
    });
}]);