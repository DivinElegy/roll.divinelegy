'use strict';

angular.module("DivinElegy.components.simfiles", []).
      
factory("SimfileService", ['$http', function($http)
{
    var simfileAPI = {};
    
    simfileAPI.getSimfiles = function()
    {
        return $http({
            url: "http://rock.divinelegy.dev/simfiles/",
            method: "GET"
        });
    };
    
    return simfileAPI;
}]);