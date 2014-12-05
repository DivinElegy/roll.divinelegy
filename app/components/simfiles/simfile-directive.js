'use strict'

//don't put ,[] because that declares a new module. This gets the existing one
angular.module('DivinElegy.components.simfiles').
        
directive('simfile', function() 
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
            download: '='
        },
        templateUrl: 'components/simfiles/simfile.html'
    };
});