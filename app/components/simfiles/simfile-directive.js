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
            fgChanges: '='
        },
        templateUrl: 'components/simfiles/simfile.html',
        link: function(scope, element, attrs){
            
            console.log(scope.simfile);
            console.log(scope.bpmChanges);
        }
    };
});