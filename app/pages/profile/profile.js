'use strict';

angular.module("DivinElegy.pages.profile", ['DivinElegy.components.user'])

.controller("ProfileController", ['$scope', '$modalInstance', 'UserService', function($scope, $modalInstance, UserService)
{
    UserService.getCurrentUser().then(function(user)
    {
        console.log(user);
        $scope.country = user.country;
        $scope.email = user.email;
        $scope.displayName = user.displayName;
    });

    $scope.ok = function()
    {
        var test = {displayName:"tits mcgee"};
        UserService.updateCurrentUser(test).
        then(function(result)
        {
            console.log(result);
        }).
        fail(function()
        {
            console.log('uh oh the spagghetti');
        });
    };
    
    $scope.cancel = function()
    {
        $modalInstance.dismiss('cancel');
    };
}]);