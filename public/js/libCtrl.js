/*
 * Controller for 'My song library' view
 */
ukuleleApp.controller('LibCtrl',function($scope, $location, Uku){

  var selectedSong = null;
  $scope.shareDialog = false;
  $scope.deleteDialog = false;
  $scope.playlist = new Array();


  //get user songs
  Uku.getUserSongs().success(function(data) {
    $scope.songs = data;
  });
  //function for delete a song
  $scope.removeSong = function() {
    $scope.removed = true;
    Uku.deleteSong($scope.songs[selectedSong]._id).success(function() {
      $scope.songs.splice(selectedSong,1);
      setTimeout(function() {
        $scope.deleteDialog = false;
        $scope.removed = false;
        $scope.$apply()
      },1300);
    });
  }
  //share a song
  $scope.share = function() {
    $scope.shared = true;
    Uku.share($scope.songs[selectedSong]._id).success(function() {
      setTimeout(function() {
        $scope.songs[selectedSong].shared = true;
        $scope.shareDialog = false;
        $scope.shared = false;
        $scope.$apply()
      },1300);
    });
  }
  $scope.setShare = function(songIndex) {
    selectedSong = songIndex;
    $scope.shareDialog = true;
  }
  $scope.setDelete = function(songIndex) {
    selectedSong = songIndex;
    $scope.deleteDialog = true;
  }
  $scope.cancel = function() {
    selectedSong = null;
    $scope.deleteDialog = false;
    $scope.shareDialog = false;
  }
  $scope.isSongs = function(){
    return !jQuery.isEmptyObject($scope.songs);
  }

  $scope.createPlaylist = function() {
    var pl = [];
    angular.forEach($scope.songs,function(song,index){
        if($scope.playlist[index]) {
          pl.push(song);
        }
    });
    Uku.setPlaylist(pl);
    $location.path('/playlist');
  }

});
