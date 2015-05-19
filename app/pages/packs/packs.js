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
    $scope.allContributors = [];
    $scope.allSongTitles = [];
    $scope.allSongArtists = [];
    $scope.sortOrder = "alpha";
    $scope.reverseSort = false;
    
    var watchMen = ['packTitleFilterKeyword', 'artistFilterKeyword', 'songTitleFilterKeyword', 'difficultyFilterKeyword', 'ratingFilterKeyword', 'stepArtistFilterKeyword', 'fgChangesFilterKeyword', 'bgChangesFilterKeyword', 'bpmChangesFilterKeyword', 'modeFilterKeyword', 'sortOrder', 'reverseSort'];
    $scope.$watchGroup(watchMen, function(newValues, oldValues) {
        applyFilters();
    });
    
    var packTitleFilter = function(pack)
    {
        var re = new RegExp(escapeRegExp($scope.packTitleFilterKeyword), 'i');
        return !$scope.packTitleFilterKeyword || re.test(pack.title);
    };

    var simfileFilter = function(pack)
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
            var songTitleRe = new RegExp(escapeRegExp($scope.songTitleFilterKeyword), 'i');
            var artistRe = new RegExp(escapeRegExp($scope.artistFilterKeyword), 'i');

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
        
        var stepArtistRe = new RegExp(escapeRegExp($scope.stepArtistFilterKeyword), 'i');
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
    
    var applyFilters = function()
    {
        $scope.filteredPackList = filterFilter(filterFilter($scope.packList, packTitleFilter), simfileFilter).sort(getSortFunction($scope.sortOrder, $scope.reverseSort));
    };
    
    var getSortFunction = function(order, reverse)
    {
        reverse = reverse ? -1 : 1;
        switch (order)
        {
            // Simple alpha numeric sort. 
            case "alpha":
                return function (packA, packB) 
                {
                    var a = packA.title.toLowerCase();
                    var b = packB.title.toLowerCase();
                    if (a === b)
                        return 0; 
                    
                    if (typeof a === typeof b)
                        return a < b ? -1*reverse : 1*reverse; 
                    
                    return typeof a < typeof b ? -1*reverse : 1*reverse;
                }
                
            case "chrono":
                return function(packA, packB)
                {
                    //XXX: lol i'm sorry
                    var dateA = Date.parse(packA.uploaded.replace(/th|st|nd|rd/g, ''));
                    var dateB = Date.parse(packB.uploaded.replace(/th|st|nd|rd/g, ''));
                    
                    if(dateA === dateB)
                        return 0
                    
                    return dateA > dateB ? -1*reverse : 1*reverse;
                };
        }
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
            $scope.pageSize = UiSettingsService.getDirective('simfilesPerPageAuto') ? Math.floor(($window.innerHeight - 280)/40 - 1) : UiSettingsService.getDirective('simfilesPerPage');
            $scope.currentPage = 1;
            $scope.packList = packs;
            $scope.filteredPackList = packs.sort(getSortFunction($scope.sortOrder, $scope.reverseSort));
            
            for(var i =0; i<packs.length; i++)
            {
                var pack = packs[i];
                for(var j=0; j<pack.contributors.length; j++)
                {
                    if($scope.allContributors.indexOf(pack.contributors[j]) === -1)
                        $scope.allContributors.push(pack.contributors[j]);
                }
                
                for(var j=0; j<pack.simfiles.length; j++)
                {
                    if($scope.allSongTitles.indexOf(pack.simfiles[j].title) === -1)
                        $scope.allSongTitles.push(pack.simfiles[j].title);
                    
                    if($scope.allSongArtists.indexOf(pack.simfiles[j].artist) === -1)
                        $scope.allSongArtists.push(pack.simfiles[j].artist);
                }
            }
        }
    });
    
    var escapeRegExp = function(str)
    {
        str = str ? str : "";
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };
}]);