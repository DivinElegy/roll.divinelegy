'use strict'

//don't put ,[] because that declares a new module. This gets the existing one
angular.module('DivinElegy.components.simfiles').
        
directive('pack', ['$rootScope', 'UserService', 'HelloService', 'rockEndpoint', 'UiSettingsService', function($rootScope, UserService, HelloService, rockEndpoint, UiSettingsService) 
{
    return {
        restrict: 'E',
        scope: {
            pack: '='
        },
        templateUrl: 'components/simfiles/pack.html',
        link: function($scope) {
            var getContributors = function(contribs)
            {
                if(contribs.length) return contribs.join(', ');
            };
            
            var slugify = function(text)
            {
              return text.toString().toLowerCase()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                .replace(/^-+/, '')             // Trim - from start of text
                .replace(/-+$/, '');            // Trim - from end of text
            }

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
            
            $scope.contributors = getContributors($scope.pack.contributors);
            
            if($scope.pack.mirrors[$scope.pack.mirrors.length - 1].source !== 'Standalone Link')
            {
                $scope.pack.mirrors.push({
                    source: 'Standalone Link',
                    uri: "#/pack/" + $scope.pack.hash.substr(0,8) + "/" + slugify($scope.pack.title)
               });
            }
            
            $scope.rockEndpoint = rockEndpoint;
        }
    };
}]);