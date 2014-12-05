'use strict';

angular.module("DivinElegy.components.simfiles", ['DivinElegy.components.config', 'DivinElegy.components.user', 'DivinElegy.components.config', 'DivinElegy.components.hello']).
      
factory("SimfileService", ['rockEndpoint', '$http', '$q', 'HelloService', function(rockEndpoint, $http, $q, HelloService)
{
    var simfileAPI = {};
    var token = HelloService.getAccessToken();
    simfileAPI.getSimfiles = function()
    {
        var deferred = $q.defer();
        
        if(this.cache)
        {
            deferred.resolve(this.cache.simfiles);
        } else {
            $http({
                url: rockEndpoint + "simfiles/",
                method: "GET",
                params: {token: token}
            }).
            success(function (data)
            {
                simfileAPI.cache = data;
                deferred.resolve(data.simfiles);
            });
        }
        
        return deferred.promise;
    };
    
    simfileAPI.getPacks = function()
    {
        var deferred = $q.defer();
        
        if(this.cache)
        {
            deferred.resolve(this.cache.packs);
        } else {
            $http({
                url: rockEndpoint + "simfiles/",
                method: "GET",
                params: {token: token}
            }).
            success(function (data)
            {
                simfileAPI.cache = data;
                deferred.resolve(data.packs);
            });
        }
        
        return deferred.promise;
    };
    
    return simfileAPI;
}]);