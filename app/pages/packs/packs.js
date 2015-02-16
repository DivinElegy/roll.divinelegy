'use strict';

angular.module("DivinElegy.pages.packs", ["DivinElegy.components.simfiles","DivinElegy.components.user","DivinElegy.components.config","DivinElegy.components.ui", "ui.bootstrap"])

.controller("PackController", ['$scope', 'SimfileService', 'UiSettingsService', 'filterFilter', '$routeParams', '$location', '$window', function($scope, SimfileService, UiSettingsService, filterFilter, $routeParams, $location, $window)
{
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
    $scope.packList = [];
    $scope.filteredPackList = [];
    
    var watchMen = ['packTitleFilterKeyword', 'artistFilterKeyword', 'songTitleFilterKeyword', 'difficultyFilterKeyword', 'ratingFilterKeyword', 'stepArtistFilterKeyword', 'fgChangesFilterKeyword', 'bgChangesFilterKeyword', 'bpmChangesFilterKeyword', 'modeFilterKeyword'];
    $scope.$watchGroup(watchMen, function(newValues, oldValues) {
        $scope.applyFilters();
    });

      //XXX: Why is this here?
//    $scope.getSimfileListingIndex = function(packName, index)
//    {
//        return packName + "" + index;
//    };
    
    $scope.packTitleFilter = function(pack)
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
        ) {
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
                        (!$scope.ratingFilterKeyword || ratingFilter(chart)) &&
                        ($scope.difficultyFilterKeyword === 'Any' || chart.difficulty === $scope.difficultyFilterKeyword) &&
                        ($scope.modeFilterKeyword === 'Any' || modeKeywordMap[i] === $scope.modeFilterKeyword);
                
                if(match) break loop1;
            }
        }
        
        return match;
    };
    
    var ratingFilter = function(chart)
    {
        var rating = $scope.ratingFilterKeyword.replace(/\s/g,'');        
        var ratings = rating.split(",");
        var ratingRange = rating.split("-");

        if(ratingRange.length === 2 && !isNaN(ratingRange[0] && !isNaN(ratingRange[1])))
        {
           return chart.rating <= Number(ratingRange[1]) && chart.rating >= Number(ratingRange[0]);
        }

        for(var i=0; i<ratings.length; i++)
        {
            if(!isNaN(ratings[i]) && chart.rating === Number(ratings[i])) return true;
        }

        return false;
    };
    
    $scope.applyFilters = function()
    {
        $scope.filteredPackList = filterFilter(filterFilter($scope.packList, $scope.packTitleFilter), $scope.simfileFilter);
    };

    SimfileService.getPacks().then(function(packs)
    {
        if($routeParams.hash)
        {
            if($routeParams.hash.length < 8) $location.path('/');
            
            for(var i=0; i<packs.length; i++)
            {
                if(packs[i].hash.substring(0, $routeParams.hash.length) == $routeParams.hash)
                {
                    $scope.pack = packs[i];
                    break;
                }
            }

//            //TODO: 404 page?
//            if(!$scope.pack) $location.path('/');
        } else {
            $scope.pageSize = UiSettingsService.getDirective('simfilesPerPageAuto') ? Math.floor(($window.innerHeight - 280)/40) : UiSettingsService.getDirective('simfilesPerPage');
            $scope.currentPage = 1;
            $scope.packList = packs;
            $scope.filteredPackList = packs;
        }
    });
}]);