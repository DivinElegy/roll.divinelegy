'use strict';

angular.module("DivinElegy.components.hello", []).
      
factory("HelloService", ['$http', function($http)
{
    var hello = window.hello;
    
    hello.services.facebook.scope.hometown = 'user_hometown';
    
    hello.isLoggedIn = function()
    {
        var session = window.hello('facebook').getAuthResponse();
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
                
            // send to 
            $http({
                url: "http://rock.divinelegy.meeples/user/auth",
                method: "GET",
                params: {token: facebookObj.access_token}
            }).
            success(function (data)
            {
                hello.setAccessToken(data.token, data.expires);
            });
        });
    };
    
    hello.getFacebookId = function()
    {
        return hello('facebook').api('/me').then(function(r)
        {
            return r.id;
        });
    };
    
    return hello; //assume hello has been loaded
}]);