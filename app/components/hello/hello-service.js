'use strict';

angular.module("DivinElegy.components.hello", []).
      
factory("HelloService", ['$http', function($http)
{
    var hello = window.hello;
    
    hello.services.facebook.scope.hometown = 'user_hometown';
    
    hello.isLoggedIn = function(network)
    {
        var session = window.hello(network).getAuthResponse();
        var current_time = (new Date()).getTime() / 1000;
        return session && session.access_token && session.expires > current_time;
    };
    
    hello.setAccessToken = function(token, expires)
    {
        var facebookObj = hello.utils.store('facebook');
        facebookObj.access_token = token;
        facebookObj.expires = expires;
        window.hello.utils.store('facebook', facebookObj);
    }
    
    hello.facebookLogin = function()
    {
        // get the short term token
        hello('facebook').login( {scope: "hometown"} ).then(function() {
            var facebookObj = hello.utils.store('facebook');
        
            console.log(JSON.stringify({token: facebookObj.access_token}));
        
            // send to 
            $http({
                url: "http://rock.divinelegy.meeples/user/auth",
                method: "GET",
                params: {token: facebookObj.access_token}
            }).
            success(function (data)
            {
                hello.setAccessToken(data.token, data.expires);
                console.log(data);
            });
        });
    };
    
    return hello; //assume hello has been loaded
}]);