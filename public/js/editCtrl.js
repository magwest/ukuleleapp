/*
 * A controller for putting together a song project or editing a song project
 *
 */

ukuleleApp.controller('EditCtrl', function ($scope, $document, $routeParams, $location, Uku) {

	$scope.user = Uku.getUser();
	var songId = $routeParams.id;
	$scope.scrollPosition = 0;
	$scope.loading = true;
	$scope.chords = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
	$scope.types = ['major','minor','5', '7', 'm7', 'maj7', 'dim7', 'sus2', 'sus4', '7sus4', '6', 'm6',
		'9','m9','add9','aug','dim','m7/b5','11','13'];

	$scope.chordChosen = false; //a boolean if a root chord is chosen or not
	$scope.rootChord; //The actual chosen root chord

	//get project from routeparams id
	if(songId){
		Uku.getSong({'_id':songId,'user_lib_id':$scope.user.id}).success(function(data) {
			$scope.project = data[0];
			$scope.loading = false;
			if(jQuery.isEmptyObject($scope.project)){
				$location.path('/edit')
			}
		}).error(function() {
			$location.path('/edit')
		});
	} else {
		//if not getting a project from routeparams, get last edited project or start a new if empty
		Uku.getProject(function(project) {
			$scope.project = project;
			$scope.loading = false;
		})
	}

	//switch between showing basechords or types
	$scope.showTypes = function(chord) {
		$scope.chordChosen = true;
		$scope.rootChord = chord;
	}

	//Adding more bars to the song
	$scope.addBars = function(i) {
		$scope.project.song.splice(i+1,0,{
			bars : new Array(4)
		});
		persist();
	}

	//removing bars
	$scope.removeBars = function(i) {
		$scope.project.song.splice(i,1)
		persist();
	}

	//Callback function when a chord is dropped on a bar
    $scope.onDropComplete=function(data,evt,arr,j) {
    	//creating an object for the chord, initiating chordIndex
			//( for voicing/fingersetting), loading-pic
    	arr.bars[j] = {
    			chordIndex : 0,
    			loading : true
    		}

	    //Getting a chord from the api
			Uku.Chord(data).success(function(res) {
				//The response can be one object for the chord OR an array with several
				//versions of the chord (a.k.a "voicings"),
				//check for to manage the data in the sam structure.
				var chord;
				if(jQuery.isArray(res.uc.chord)){
					chord = res.uc.chord;
				} else {
					chord = [res.uc.chord];
				}
				arr.bars[j].loading = false;
				arr.bars[j].chord = chord;
				persist();
			});
    }

    //Removing a chord from a bar
    $scope.remove = function(arr,i) {
    	arr.bars[i] = null;
			persist();
    }
    //Change voicing of a chord (to the right in UI)
    $scope.changePlus = function(voiceIndex,length) {
    	if((voiceIndex+1) < length) voiceIndex += 1;
    	else voiceIndex = 0;
    	return voiceIndex;
    }
		//Change voicing of a chord (to the left to the left in UI)
    $scope.changeMinus = function(voiceIndex, length) {
    	if((voiceIndex-1) < 0) voiceIndex = length-1;
    	else voiceIndex -= 1;
    	return voiceIndex;
    }
		$scope.changed = function() {
			persist();
		}
		//Save song
    $scope.save = function() {
			$scope.saved = true;
			Uku.saveSong($scope.project).success(function(data) {
				$scope.project = data;
				setTimeout(function() {
	    		$scope.saveDialog = false; //hiding dialog box
					$scope.saved = false;
					$scope.$apply();
				}, 1200);
			});
    }
		//removing id and eventual sharing before saving as new song
		$scope.saveAs = function() {
			delete $scope.project._id;
			delete $scope.project.shared;
			delete $scope.project.saved_from_other;
			delete $scope.project.date;
			$scope.save();
		}
		//Update a song
		$scope.saveUpdates = function() {
			$scope.updateDialog = true;
			Uku.updateSong($scope.project).success(function() {
				setTimeout(function() {
					$scope.updateDialog = false; //hiding dialog box
					$scope.$apply();
				}, 1200);
			});
		}

		//Create new song
    $scope.createNew = function() {
    	$scope.project = Uku.newProject();
    	$scope.clearDialog = false; //hiding dialog box
			persist()
    }

		//persist the project
		var persist = function() {
			Uku.persistProject($scope.project)
		}

		//Set scroll position
    $document.on('scroll', function() {
      $scope.scrollPosition = $document.scrollTop();
      $scope.$apply()
    });


})
