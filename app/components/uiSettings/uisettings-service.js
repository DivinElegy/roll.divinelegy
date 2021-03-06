'use strict';

angular.module("DivinElegy.components.ui", ['ngStorage']).
      
factory("UiSettingsService", ['$localStorage', function($localStorage)
{
    var UiSettingsService = {};
        
    $localStorage.$default({
        ui: {
            'simfilesPerPage': 10,
            'simfilesPerPageAuto': true,
            'showDownloadWarning' : 'Yes'
        }
    });
    
    UiSettingsService.setDirective = function(directive, value)
    {
        if($localStorage.ui.hasOwnProperty(directive)) $localStorage.ui[directive] = value;
    };
    
    UiSettingsService.getDirective = function(directive)
    {
        return $localStorage.ui[directive];
    };
    
    return UiSettingsService;
}]);