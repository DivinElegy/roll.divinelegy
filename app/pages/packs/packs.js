'use strict';

angular.module("DivinElegy.pages.packs", ["DivinElegy.components.simfiles","DivinElegy.components.user","DivinElegy.components.config","DivinElegy.components.ui", "ui.bootstrap"])

.controller("PackController", ['$scope', '$rootScope', 'rockEndpoint', 'SimfileService', 'UserService', 'UiSettingsService', 'HelloService', function($scope, $rootScope, rockEndpoint, SimfileService, UserService, UiSettingsService, HelloService)
{
    $scope.rockEndpoint = rockEndpoint;
    $scope.packTitleFilterKeyword = null;
    $scope.artistFilterKeyWord = null;
    $scope.songTitleFilterKeyword = null;
    $scope.difficultyFilterKeyword = 'Any';
    $scope.ratingFilterKeyword = null;
    $scope.stepArtistFilterKeyword = null;
    $scope.fgChangesFilterKeyword = 'Any';
    $scope.bgChangesFilterKeyword = 'Any';
    $scope.bpmChangesFilterKeyword = 'Any';
    $scope.modeFilterKeyword = 'Any';
    
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
                if(UiSettingsService.getDirective('showDownloadWarning') === 'Yes')
                {
                    $rootScope.$broadcast('message.warning', 'You are about to download ' + pack.title + ' which is ' + pack.size + '. Your current quota is ' + user.quotaRemaining + ' click <a ng-click="updateUserCache()" href="' + url + '">here</a> to confirm.'); 
                } else {
                    window.location = url;
                    $rootScope.updateUserCache();
                }
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

    $scope.getContributors = function(contribs)
    {
        if(contribs.length) return contribs.join(', ');
    };
    
    $scope.getSimfileListingIndex = function(packName, index)
    {
        return packName + "" + index;
    };
    
    $scope.packTitleFilter = function (pack)
    {
        var re = new RegExp($scope.packTitleFilterKeyword, 'i');
        return !$scope.packTitleFilterKeyword || re.test(pack.title);
    };

    $scope.simfileFilter = function(pack)
    {
        // Step 0: All chart keywords are null
        if(!$scope.songTitleFilterKeyword &&
           !$scope.artistFilterKeyword &&
           !$scope.ratingFilterKeyword &&
           !$scope.stepArtistFilterKeyword &&
           $scope.difficultyFilterKeyowrd === 'Any' &&
           $scope.difficultyFilterKeyword === 'Any' &&
           $scope.fgChangesFilterKeyword === 'Any' &&
           $scope.bgChangesFilterKeyword === 'Any' &&
           $scope.modeFilterKeyword === 'Any' &&
           $scope.bpmFilterKeyword === 'Any'
           )
        {
            return true;
        }
        
        var simfiles = pack.simfiles;
        var match = false;
        for(var i=0; i<simfiles.length; i++)
        {
            var simfile = pack.simfiles[i];
            var songTitleRe = new RegExp($scope.songTitleFilterKeyword, 'i');
            var artistRe = new RegExp($scope.artistFilterKeyword, 'i');
            

            match = (!$scope.songTitleFilterKeyword || songTitleRe.test(simfile.title)) &&
                    (!$scope.artistFilterKeyword || artistRe.test(simfile.artist)) &&
                    ($scope.fgChangesFilterKeyword === 'Any' || simfile.fgChanges === $scope.fgChangesFilterKeyword) &&
                    ($scope.bgChangesFilterKeyword === 'Any' || simfile.bgChanges === $scope.bgChangesFilterKeyword) &&
                    ($scope.bpmChangesFilterKeyword === 'Any' || simfile.bpmChanges === $scope.bpmChangesFilterKeyword) &&
                    chartsFilter(simfile);

            if(match) break;
        }
        
        return match;
    };

    var chartsFilter = function(simfile)
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
                match = (!$scope.stepArtistFilterKeyword || stepArtistRe.test(chart.artist)) &&
                        (!$scope.ratingFilterKeyword || (!isNaN($scope.ratingFilterKeyword) && chart.rating === Number($scope.ratingFilterKeyword))) &&
                        ($scope.difficultyFilterKeyword === 'Any' || chart.difficulty === $scope.difficultyFilterKeyword) &&
                        ($scope.modeFilterKeyword === 'Any' || modeKeywordMap[i] === $scope.modeFilterKeyword);
                
                if(match) break loop1;
            }
        }
        
        return match;
    };
           
    $scope.packList = [];
           
    SimfileService.getPacks().then(function(packs)
    {
        $scope.pageSize = UiSettingsService.getDirective('simfilesPerPage');
        $scope.currentPage = 1;
        $scope.packList = packs;
    });
}]);