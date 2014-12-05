'use strict';

angular.module("DivinElegy.pages.packs", ["DivinElegy.components.simfiles","DivinElegy.components.user","DivinElegy.components.config"])

.controller("PackController", ['$scope', '$rootScope', 'rockEndpoint', 'SimfileService', 'UserService', 'HelloService', function($scope, $rootScope, rockEndpoint, SimfileService, UserService, HelloService)
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
    
    var filesizeBytes = function(size)  
    {  
        //units are already bytes
        if(!isNaN(size.substring(size.length-2, size.length-1)))
        {
            return size.substring(0, size.length-1);
        }

        var units = size.substring(size.length-2, size.length);
        var size = size.substring(0, size.length-2);
        var fileUnits = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];  

        for(var i=0; i<fileUnits.length; i++)
        {
            if(fileUnits[i] == units) { break; }
            size = size*1000;
        }

        return Number(size);  
    };

    $scope.downloadFromDe = function(pack)
    {    
        if(!UserService.getCurrentUser())
        {
            $rootScope.$broadcast('message.error', 'You need to be logged in to download from DivinElegy.'); 
            return;
        }
        
        UserService.getCurrentUser().then(function(user)
        {            
            var size = filesizeBytes(pack.size);
            var quotaRemaining = filesizeBytes(user.quotaRemaining);
            
            if(quotaRemaining < size)
            {
                $rootScope.$broadcast('message.error', 'Sorry, you do not have enough quota to download that file. Quota resets at 00:00 UTC+0'); 
            } else {
                //TODO: Maybe access token should be in user obj?
                var url = rockEndpoint + '' + pack.mirrors[0].uri + '?token=' + HelloService.getAccessToken(); //0th mirror will always be de
                $rootScope.$broadcast('message.warning', 'You are about to download ' + pack.title + ' which is ' + pack.size + '. Your current quota is ' + user.quotaRemaining + ' click <a ng-click="updateUserCache()" href="' + url + '">here</a> to confirm.'); 
            }
        });
    };
    
    $rootScope.updateUserCache = function()
    {
        //TODO: This may not be the best way to do this, but basically when this function
        //is called by ng-click, rock.de hasn't had time to log the download yet so if
        //we update the cache straight away, we still get the old user quota. Waiting
        //a second gives it time to sort itself out.
        setTimeout(function() {
            UserService.updateCache();
        },1000);
    };
        
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