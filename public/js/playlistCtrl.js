/*
 * Controller for viewing playlist
 */
ukuleleApp.controller('PlaylistCtrl', function($scope, $sce, Uku) {
  //get playlist
  $scope.songs = Uku.getPlaylist();

  $scope.desc = function(message) {
    return $sce.trustAsHtml(message.replace(/\n/g, '<br/>'));
  }
});
