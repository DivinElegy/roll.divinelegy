'use strict';

angular.module("DivinElegy.components.simfiles", ['DivinElegy.components.config']).
      
factory("SimfileService", ['rockEndpoint', '$http', '$q', function(rockEndpoint, $http, $q)
{
    var simfileAPI = {};
    
    simfileAPI.getSimfiles = function()
    {
        var deferred = $q.defer();
        
        if(this.cache)
        {
            deferred.resolve(this.cache.simfiles);
        } else {
            $http({
                url: rockEndpoint + "simfiles/",
                method: "GET"
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
                method: "GET"
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