/*
 * Insert Ukulele-chords.com api-key in
 * var apiKey
 *
 */

ukuleleApp.factory('Uku', function ($http, x2js, $cookieStore) {

	var user = null;
	var playlist;


	//A prototype object for song project
	var Project = function(){
		return {
			title : "",
			artist : "",
			user_lib_id : user.id,
			user_lib_name: user.name,
			song : [{
				bars : new Array(4)
			}],
			description : ""
		};
	}

	//returns a new song project
	var newProject = this.newProject = function() {
		return new Project();
	}

	//adding persistance for working project while not stored as saved project
	this.persistProject = function(project) {
		$http.post('/persist',{uid: user.id, project:project}).success(function(res) {
		});
	}

	//get project
	this.getProject = function(cb) {
		$http.post('/userp',{uid:user.id}).success(function(data){
			if(data){
				cb(data);
			} else {
				cb(newProject());
			}
		});
	}

	this.setPlaylist = function(pl) {
		playlist = pl;
	}

	this.getPlaylist = function() {
		return playlist;
	}

	//setter for user auth
	this.setUser = function(uId, uName) {
		user = {};
		user.name = uName;
		user.id = uId;
		console.log(user);
	}

	var setCookies = this.setCookies = function(project) {
			$cookieStore.put('userSession',user)
	}

	this.getUser = function() {
		if(user) return user;
	}

	//getter if the user is logged in
	this.isLoggedIn = function() {
  	if(user){
			return true;
		} else {
			if(user = $cookieStore.get('userSession')){
				return true;
			} else {
				return false;
			}
		}
  }

	//signing out the user
  this.logOut = function() {
  	user = null;
		$cookieStore.remove('userSession');
  	console.log(user);
  }

	this.getSong = function(query) {
		return $http.post('/song',query);
	}

	//get user songs
	this.getUserSongs = function() {
		return $http.post('/mylibrary', {user_lib_id: user.id });
	}

	//get latest 10 song or so
	this.getLatestSongs = function() {
		return $http.post('/shared');
	}

	//get songs matching a search phrase
	this.searchSongs = function(sw) {
		return $http.post('/search', {sw:sw});
	}

	//saving the song
	this.saveSong = function(song) {
		return $http.post('/save', song);
	}

	//update a song
	this.updateSong = function(song) {
		return $http.post('/update', song);
	}

	//delete song
	this.deleteSong = function(id) {
		return $http.post('/delete',{'id':id});
	}

	//share song
	this.share = function(id) {
		return $http.post('/share',{'id':id});
	}


	/*
	 * API issue:
	 * The the api request becomes cross-domain, and it seems that
	 * the api provider hasn't enabled CORS-requests. Therefore the api request
	 * is wrapped in a server side request (see http.js)
	 * (Also I sometimes noticed that the api-server is down, then you just have to wait..)
	 */
 	this.Chord = function(ch) {
		var url = '/apireq?';
 		return $http.get(url + 'ak=' + apiKey + '&r=' + ch.r + '&typ=' + ch.typ,
 			{
 				transformResponse : function(data){
						return x2js.xml_str2json(data);
					}
 			});
 	}


	return this;
});
