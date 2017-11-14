angular.module('mainCtrl', [])

.controller('mainController', function($rootScope, $location, Auth, User) {

  var vm = this;

  // get info if a person is logged in
  vm.loggedIn = Auth.isLoggedIn();
  vm.ofertante = Auth.esOfertante();

  // check to see if a user is logged in on every request
  $rootScope.$on('$routeChangeStart', function() {
    vm.loggedIn = Auth.isLoggedIn();
    vm.ofertante = Auth.esOfertante();


    // get user information on route change
    Auth.getUser()
    .then(function(data) {
      vm.user = data.data;
    });
  });

  // function to handle login form
  vm.doLogin = function() {
    vm.processing = true;
    // call the Auth.login() function


    Auth.login(vm.loginData.username, vm.loginData.password)

    .then(function(data) {
      vm.processing = false;

      // if a user successfully logs in, redirect to users page
      if (data.data.success){
        $location.path('/inicio');
        $location.path('/inicio');

      }
      else
      {
        vm.error = data.data.message;
      }
    });
  };
  // doSignUp to handle signUp form
  vm.doSignUp= function() {
    vm.processing = true;
    // call the Auth.login() function

    if(vm.signUpData){
      Auth.signUp(vm.signUpData.name,vm.signUpData.username, vm.signUpData.password,vm.signUpData.ofertante)

      .then(function(data) {
        vm.processing = false;
        // if a user successfully logs in, redirect to users page
        if (data.data.success){
          $location.path('/inicio');
        }
        else
        {
          vm.error = data.data.message;
        }
      });

    }
    else    vm.error = "Llene los campos";

  };
  // function to handle logging out
  vm.doLogout = function() {
    Auth.logout();
    // reset all user info
    vm.user = {};
    $location.path('/login');
  };

});
