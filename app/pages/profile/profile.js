'use strict';

angular.module("DivinElegy.pages.profile", ['DivinElegy.components.user'])

.controller("ProfileController", ['$scope', '$modalInstance', 'UserService', function($scope, $modalInstance, UserService)
{
    $scope.hidden = true;
    
    UserService.getCurrentUser().then(function(user)
    {
        $scope.country = user.country ? user.country : "NULL";
        $scope.displayName = user.displayName;
    });

    $scope.ok = function()
    {
        var update = {displayName:$scope.displayName};
        
        if($scope.country !== "NULL")
        {
            update.country = $scope.country;
        } else {
            update.country = null;
        }
        
        UserService.updateCurrentUser(update).
        then(function(result)
        {
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
            //
        });
    };
    
    $scope.cancel = function()
    {
        $modalInstance.dismiss('cancel');
    };
}]);