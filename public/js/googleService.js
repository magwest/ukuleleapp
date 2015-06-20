/*
 * A service for using gapi and goole plus sign in
 *
 * define variable clientId with google-clientid in key.js
 */

ukuleleApp.factory('Google', function($window) {

  this.signin = function (callback) {

      var handlingUserReq = function(res){
        console.log(res);
        if(res && !res['error']){
          callback(res);
        }
      };

      var getUser = function(result) {
        console.log('get user');
        console.log(result);
        gapi.client.request({
          path:'https://www.googleapis.com/plus/v1/people/me',
          method:'GET',
        }).execute(handlingUserReq);
      };


      var signingIn = function() {
        gapi.auth.signIn({
          clientid: clientId,
          cookiepolicy: "single_host_origin",
          scope: "https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.me",
          callback: getUser
        });
      };

      signingIn();

    };

    this.signout = function() {
        gapi.auth.signOut();
        $window.location.reload();
    };

    return this;
});
