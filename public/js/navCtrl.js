/*
 * The controller for the navbar
 */

ukuleleApp.controller('NavCtrl', function ($scope, $location, Uku, Google) {

	$scope.userName = function(){
		return Uku.getUser() ? Uku.getUser().name : null;
	}

	//Signing out (not working when running on localhost..)
	$scope.logout = function() {
		Google.signout();
		$location.path('/login');
		Uku.logOut();
	}

})
