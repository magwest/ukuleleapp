/*
 * Controller for view song (no editing)
 */

ukuleleApp.controller('SongCtrl', function($scope, $routeParams, $location, $sce, Uku) {
  var id = $routeParams.songId;
  $scope.songs = [];

  //get the song
  Uku.getSong({'_id':id}).success(function(data) {
      $scope.songs = data;
      console.log(data);
  }).error(function() {
    $location.path('/library');
  });

  $scope.desc = function(message) {
    return $sce.trustAsHtml(message.replace(/\n/g, '<br/>'));
  }
});
