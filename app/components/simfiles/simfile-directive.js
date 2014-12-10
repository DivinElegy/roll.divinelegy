'use strict'

//don't put ,[] because that declares a new module. This gets the existing one
angular.module('DivinElegy.components.simfiles').
        
directive('simfile', ['$rootScope', 'UserService', 'HelloService', 'rockEndpoint', function($rootScope, UserService, HelloService, rockEndpoint) 
{
    return {
        restrict: 'E',
        scope: {
            simfile: '=',
            rockEndpoint: '=',
            banner: '=',
            title: '=',
            artist: '=',
            steps: '=',
            bpmChanges: '=',
            bgChanges: '=',
            fgChanges: '=',
            size: '=',
            download: '=',
            uploaded: '='
        },
        templateUrl: 'components/simfiles/simfile.html',
        link: function($scope) {
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
                        var url = rockEndpoint + '' + simfile.download + '?token=' + HelloService.getAccessToken(); //0th mirror will always be de
                        $rootScope.$broadcast('message.warning', 'You are about to download ' + simfile.title + ' which is ' + simfile.size + '. Your current quota is ' + user.quotaRemaining + ' click <a ng-click="updateUserCache()" href="' + url + '">here</a> to confirm.'); 
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
        }
    };
}]);