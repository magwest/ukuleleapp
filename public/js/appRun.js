/*
 * When running the app
 */
ukuleleApp.run(function ($rootScope, $location, Uku) {
    $rootScope.$on('$routeChangeStart', function (event) {

        if (!Uku.isLoggedIn()) {
            console.log('DENY');
            $location.path('/login');
        }
        else {
        	console.log('User is logged in')
        }

    });
});
