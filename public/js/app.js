/**
 * Creating the angular app and adding all the directives used within this project
 */

var  ukuleleApp = angular.module('ukuleleApp',
  [
    'ngRoute',
    'ngDraggable',
    'xml',
    'duScroll',
    'ngCookies'

]);


//Config the routes
ukuleleApp.config(['$routeProvider',
  function($routeProvider) {

    $routeProvider
      .when('/edit/:id?', {
        templateUrl: '../partials/edit.html',
        controller: 'EditCtrl'
      })
      .when('/login',{
        templateUrl: '../partials/login.html',
        controller: 'LoginCtrl'
      })
      .when('/library',{
        templateUrl: '../partials/library.html',
        controller: 'LibCtrl'
      })
      .when('/browse',{
        templateUrl: '../partials/browse.html',
        controller :'BrowseCtrl'
      })
      .when('/song/:songId', {
        templateUrl : '../partials/song.html',
        controller : 'SongCtrl'
      })
      .when('/playlist', {
        templateUrl : '../partials/song.html',
        controller : 'PlaylistCtrl'
      })
      .otherwise({
        redirectTo: '/library'
      });

  }]);

//a directive for using history back in a link
ukuleleApp.directive('siteBack', function($window){
  return {
    link: function(scope, element) {
     element.on('click', function() {
         $window.history.back();
     });
    }
  }
})
