/**
 * Handling the google sign in
 */

ukuleleApp.controller('LoginCtrl' ,function ($scope, $location, $document, Uku, Google) {

	//sign in function
	$scope.signIn = function() {
		console.log('trying to sign in');
		Google.signin(function(data) {
			Uku.setUser(data.id, data.displayName);
			Uku.setCookies();
			$location.path('/library');
			$scope.$apply();
		});
	}
	var no1 = angular.element(document.getElementById("no1"));
	var no2 = angular.element(document.getElementById("no2"));
	var no3 = angular.element(document.getElementById("no3"));
	var no4 = angular.element(document.getElementById("no4"));
	var padding = 57;
	var sections = [no1,no2,no3,no4];

	//scroll function
	$scope.goTo = function(section) {
		console.log(section);
		console.log(sections[section]);
		$document.scrollTop(sections[section][0].offsetTop - padding,400);
	}

});
