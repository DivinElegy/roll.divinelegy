'use strict';

angular.module("DivinElegy.components.user", ['DivinElegy.components.hello']).
      
factory("UserService", ['$http', '$q', 'HelloService', function($http, $q, HelloService)
{
    var UserService = {};
    UserService.userCache = {};
    
    UserService.getUser = function(facebookId)
    {
        var deferred = $q.defer();
        
        if(this.userCache[facebookId])
        {
            this.userCache[facebookId]['fromCache'] = true;
            deferred.resolve(this.userCache[facebookId]);
            return deferred.promise;
        }

        $http({
            url: "http://rock.divinelegy.dev/user/" + facebookId,
            method: "GET"
        }).
        success(function (data)
        {
            UserService.userCache[facebookId] = data;
            deferred.resolve(data);
        });
        
        
        return deferred.promise;
    };

    UserService.getCurrentUser = function()
    {           
        if (!this.facebookId)
        {
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
         
    return UserService;
}]);