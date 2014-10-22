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
        hello('facebook').login( {scope: "hometown"} );
    };
    
    hello.on('auth.login', function()
    {
        var facebookObj = hello.utils.store('facebook');

        // send to 
        $http({
            url: "http://rock.divinelegy.dev/user/auth",
            method: "GET",
            params: {token: facebookObj.access_token}
        }).
        success(function (data)
        {
            /*
             * It is no good to use auth.login because that comes back almost
             * instantly due to facebook. We rely on rock.de for things like
             * the user name, so we need to wait for it to be ready, which happens
             * here.
             */
            hello.emit('auth.login.userReady');
            hello.setAccessToken(data.token, data.expires);
        });
    });
        
    hello.getFacebookId = function()
    {
        return hello('facebook').api('/me').then(function(r)
        {
            return r.id;
        });
    };
    
    return hello; //assume hello has been loaded
}]);