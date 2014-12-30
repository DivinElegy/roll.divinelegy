'use strict';

angular.module("DivinElegy.components.user", ['DivinElegy.components.config', 'DivinElegy.components.hello']).
      
factory("UserService", ['$rootScope', 'rockEndpoint', '$http', '$q', 'HelloService', function($rootScope, rockEndpoint, $http, $q, HelloService)
{
    var UserService = {};
    UserService.userCache = {};
    
    UserService.getUser = function(facebookId, skipCache)
    {
        var deferred = $q.defer();
        var token = HelloService.getAccessToken();
        if(this.userCache[facebookId] && !skipCache)
        {
            this.userCache[facebookId]['fromCache'] = true;
            deferred.resolve(this.userCache[facebookId]);
            return deferred.promise;
        }

        $http({
            url: rockEndpoint + "user/" + facebookId,
            method: "GET",
            params: {token: token}
        }).
        success(function (data)
        {
            UserService.userCache[facebookId] = data;
            deferred.resolve(data);
            //XXX: kinda hacky, but this way everything that has stuff pulled out of this service can update
            //we assume if the cache was skipped we're updating
            if(skipCache)
            {
                window.hello.emit('auth.login.userReady');
            }
        }).
        error(function(data, status)
        {
            $rootScope.$broadcast('message.error', 'Uh oh, something went really wrong. Try refreshing the page.'); 
        });

        return deferred.promise;
    };

    UserService.getCurrentUser = function()
    {           
        if (!this.facebookId)
        {
            if(!HelloService.getFacebookId())
            {
                return null;
            }
            
            return HelloService.getFacebookId().then(function(fbId)
            {
                //cant use this here bc scope or something
                UserService.facebookId = fbId;
                return UserService.getUser(fbId);
            });
        } else {
            return this.getUser(this.facebookId);
        }
    };
    
    UserService.updateUser = function(facebookId, userObj)
    {
        var deferred = $q.defer();
        var token = HelloService.getAccessToken();

        $http({
            url: rockEndpoint + "user/" + facebookId,
            method: "POST",
            data: userObj,
            params: {token: token}
        }).
        success(function (data)
        {
            deferred.resolve(data);
        }).
        error(function(data, status)
        {
            deferred.reject();
            //$rootScope.$broadcast('message.error', 'Uh oh, something went really wrong. Try refreshing the page.'); 
        });

        return deferred.promise;
    };
    
    UserService.updateCurrentUser = function(userObj)
    {
        if (!this.facebookId)
        {
            if(!HelloService.getFacebookId())
            {
                return null;
            }
            
            return HelloService.getFacebookId().then(function(fbId)
            {
                //cant use this here bc scope or something
                UserService.facebookId = fbId;
                return UserService.updateUser(fbId, userObj);
            });
        } else {
            return this.updateUser(this.facebookId, userObj);
        }
    };
         
    UserService.updateCache = function()
    {
        if (!this.facebookId)
        {
            HelloService.getFacebookId().then(function(fbId)
            {
                UserService.facebookId = fbId;
                UserService.getUser(fbId, true);
            });
        } else {
            this.getUser(this.facebookId, true);
        }
    };
    
    UserService.flushCache = function()
    {
        this.userCache = {};
        this.facebookId = null;
    };
         
    return UserService;
}]);