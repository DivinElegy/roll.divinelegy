'use strict';

angular.module("DivinElegy.components.simfiles", ['DivinElegy.components.config']).
      
factory("SimfileService", ['rockEndpoint', '$http', function(rockEndpoint, $http)
{
    var simfileAPI = {};
    
    simfileAPI.getSimfiles = function()
    {
        return $http({
            url: rockEndpoint + "simfiles/",
            method: "GET"
        });
    };
    
    return simfileAPI;
}]);