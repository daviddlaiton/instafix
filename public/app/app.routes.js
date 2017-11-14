angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

	// home page route
	.when('/', {
		templateUrl : 'app/views/pages/home.html'
	})
	// login page
	.when('/login', {
		templateUrl : 'app/views/pages/login.html',
		controller : 'mainController',
		controllerAs: 'login'
	})// show all users
	.when('/signUp', {
		templateUrl : 'app/views/pages/signUp.html',
		controller : 'mainController',
		controllerAs: 'main'
	})// show all users
	.when('/inicio', {
		templateUrl: 'app/views/pages/inicio.html',
		controller: 'mainController',
		controllerAs: 'main'
	})
	.when('/nuevoServicio', {
		templateUrl: 'app/views/pages/nuevoServicio.html',
		controller: 'mainController',
		controllerAs: 'main'
	})
	.when('/nuevoServicio/albanileria', {
		templateUrl: 'app/views/pages/servicios/albanileria.html',
		controller: 'mainController',
		controllerAs: 'main'
	})	.when('/nuevoServicio/albanileria/confirmacion', {
			templateUrl: 'app/views/pages/ofertante/perfilOfertante.html',
			controller: 'mainController',
			controllerAs: 'main'
		})
		.when('/construccion', {
			templateUrl: 'app/views/pages/ofertante/construccion.html',
			controller: 'mainController',
			controllerAs: 'main'
		})
		.when('/serviciosDemandante', {
			templateUrl: 'app/views/pages/servicios/serviciosDemandante.html',
			controller: 'mainController',
			controllerAs: 'main'
		})
		.when('/serviciosOfertante', {
			templateUrl: 'app/views/pages/servicios/serviciosOfertante.html',
			controller: 'mainController',
			controllerAs: 'main'
		});
	// get rid of the hash in the URL
	$locationProvider.html5Mode(true);

});
