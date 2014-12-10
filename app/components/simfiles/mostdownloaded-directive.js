'use strict'

//don't put ,[] because that declares a new module. This gets the existing one
angular.module('DivinElegy.components.simfiles').
        
directive('mostDownloaded', ['rockEndpoint', '$http', 'UserService', 'HelloService', '$rootScope', function(rockEndpoint, $http, UserService, HelloService, $rootScope) 
{
    return {
        templateUrl: 'components/simfiles/most-downloaded.html',
        scope: {}, //this is needed as we use some of the same names as latestpack directive. This makes a new scope for this directive, isolated from latestpack.
        link: function($scope) {
            $http({
                url: rockEndpoint + "simfiles/popular",
                method: "GET"
            }).
            success(function (data)
            {
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
                
                //TODO: This is duplicated in a few places. What do?
                $scope.downloadFromDe = function(simfile)
                {      
                    if(!UserService.getCurrentUser())
                    {
                        $rootScope.$broadcast('message.error', 'You need to be logged in to download from DivinElegy.'); 
                        return;
                    }

                    UserService.getCurrentUser().then(function(user)
                    {
                        var size = filesizeBytes(simfile.size);
                        var quotaRemaining = filesizeBytes(user.quotaRemaining);

                        if(quotaRemaining < size)
                        {
                            $rootScope.$broadcast('message.error', 'Sorry, you do not have enough quota to download that file. Quota resets at 00:00 UTC+0'); 
                        } else {
                            //TODO: Maybe access token should be in user obj?
                            var url;
                            if(data.contributors)
                            {
                                url = rockEndpoint + '' + simfile.mirrors[0].uri + '?token=' + HelloService.getAccessToken(); //0th mirror will always be de
                            } else {
                                url = rockEndpoint + '' + simfile.download + '?token=' + HelloService.getAccessToken(); //0th mirror will always be de
                            }
                            $rootScope.$broadcast('message.warning', 'You are about to download ' + simfile.title + ' which is ' + simfile.size + '. Your current quota is ' + user.quotaRemaining + ' click <a ng-click="updateUserCache()" href="' + url + '">here</a> to confirm.'); 
                        }
                    });

                };
                $scope.rockEndpoint = rockEndpoint;
                $scope.title = data.title;
                $scope.banner = data.banner;
                $scope.packOrSimfile = data;
                
                if(data.contributors)
                {
                    $scope.contributors = data.contributors.join(', ');
                    $scope.downloads = data.mirrors;
                } else {
                    var authors = [];
                    for(var i=0; i<data.steps.single.length; i++)
                    {
                        if(authors.indexOf(data.steps.single[i].artist) === -1)
                        {
                            authors.push(data.steps.single[i].artist);
                        }
                    }
                    
                    $scope.contributors = authors.join(', ');
                    $scope.downloads = [{source: 'DivinElegy', 'uri': data.download}];
                }

                //have to use rootScope here since we are no longer sharing scope with other directives.
                $rootScope.$$phase || $rootScope.$apply();
            });
        }
    };
}]);