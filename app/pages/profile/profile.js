'use strict';

angular.module("DivinElegy.pages.profile", ['DivinElegy.components.user'])

.controller("ProfileController", ['$scope', '$modalInstance', 'UserService', function($scope, $modalInstance, UserService)
{
    $scope.hidden = true;
    
    UserService.getCurrentUser().then(function(user)
    {
        console.log(user);
        $scope.country = user.country;
        $scope.displayName = user.displayName;
    });

    $scope.ok = function()
    {
        var update = {displayName:$scope.displayName, country:$scope.country};
        UserService.updateCurrentUser(update).
        then(function(result)
        {
            console.log(result);
            if(result.status === 'success')
            {
                $scope.hidden = false;
                $scope.messageType = 'success';
                $scope.status = 'Saved!';
            }
            
            if(result.status === 'error')
            {
                $scope.hidden = false;
                $scope.messageType = 'error';
                $scope.status = result.messages[0];
            }
        },
        function()
        {
            console.log('uh oh the spagghetti');
        });
    };
    
    $scope.cancel = function()
    {
        $modalInstance.dismiss('cancel');
    };
}]);