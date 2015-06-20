/*
 * Controller for the song browser
 */
 ukuleleApp.controller('BrowseCtrl',function($scope, $location, Uku) {

   var user = Uku.getUser();
   var inUserLib = [];
   $scope.dialog = false;

   //get songs from user lib
   Uku.getUserSongs().success(function(data) {
     for(i= 0; i<data.length ; i++){
       inUserLib.push(data[i]._id)
       if(data[i].saved_from_other === true){
         inUserLib.push(data[i].old_id);
       }
     };
   });

   //the latest shared songs
   var getLatestSongs = function() {
     $scope.loading = true;
     Uku.getLatestSongs().success(function(data) {
       $scope.songs = data;
       $scope.loading = false;
     });
   }
   //searching for a song
   var search = function(searchWord) {
      $scope.loading = true;
      Uku.searchSongs(searchWord).success(function(data) {
        $scope.songs = data;
        $scope.loading = false;
      });
   }

   $scope.$watch('word', function() {
     if($scope.word===undefined||$scope.word===null) {
       getLatestSongs();
     } else {
       search($scope.word);
     }
   });

   //View song
   $scope.goTo = function(id){
     $location.path('/song/' + id)
   }

   //saves a copy of the song to the library
   $scope.copyToLib = function(i) {
     var song = {};
     angular.copy($scope.songs[i],song);
     var saveThisId = song._id;
     delete song._id;
     delete song.shared;
     delete song.date;
     song.user_lib_name = user.name;
     song.user_lib_id = user.id;
     song.saved_from_other = true;
     song.old_id = saveThisId;
     Uku.saveSong(song).success(function(data){
       setDialog();
       inUserLib.push(data.old_id);
     });
   }


   //checking if a song is in user lib or already saved to the lib
   $scope.alreadySaved = function(id) {
     if(inUserLib.indexOf(id) == -1){
       return false;
     } else {
       return true;
     }
   }

   var setDialog = function() {
     $scope.dialog = true;
     setTimeout(function() {
       $scope.dialog = false;
       $scope.$apply()
     },1300);
   }

 });
