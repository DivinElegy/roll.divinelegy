'use strict';

angular.module("DivinElegy.components.ui", ['ngStorage']).
      
factory("UiSettingsService", ['$localStorage', function($localStorage)
{
    var UiSettingsService = {};
        
    $localStorage.$default({
        ui: {
            'simfilesPerPage': 10,
            'showDownloadWarning' : 'Yes'
        }
    });
    
    UiSettingsService.setDirective = function(directive, value)
    {
        if($localStorage.ui[directive]) $localStorage.ui[directive] = value;
    };
    
    UiSettingsService.getDirective = function(directive)
    {
        return $localStorage.ui[directive];
    };
    
    return UiSettingsService;
}]);