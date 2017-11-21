angular.module('mainCtrl', ['ngFileUpload'])

.controller('mainController', function($route,$scope,Servicio,Upload,$rootScope, $location, Auth, User, CLURL, CLPRE,$window, Img) {

  var vm = this;
  // get info if a person is logged in
  vm.loggedIn = Auth.isLoggedIn();
  vm.ofertante = Auth.esOfertante();

  // check to see if a user is logged in on every request
  $rootScope.$on('$routeChangeStart', function() {

    vm.loggedIn = Auth.isLoggedIn();
    vm.ofertante = Auth.esOfertante();
    Auth.getUser()
    .then(function(data) {
      vm.user = data.data;
      if(vm.ofertante){

        Servicio.serviciosEsperaOfertante(vm.user._id)
        .then(function(response){

          if(response.data.servicios.length> 0){
            vm.cantFixes = response.data.servicios.length
            $scope.serviciosEspera =response.data.servicios;
          }
          Servicio.serviciosActivoOfertante(vm.user._id)
          .then(function(response2){
            if(response2.data.servicios.length> 0){
              vm.cantActivos = response2.data.servicios.length
            }
          });
        });
      }
      else{
        Servicio.serviciosEsperaCliente(vm.user._id)
        .then(function(response){
          if(response.data.servicios.length> 0){
            $scope.serviciosEsperaCliente =response.data.servicios;
            vm.cantMensajes = response.data.servicios.length

          }
          Servicio.serviciosActivoCliente(vm.user._id)
          .then(function(response2){
            if(response2.data.servicios.length> 0){
              vm.cantActivos = response2.data.servicios.length
            }
          });
        });
      }
    });

  });
  // get user information on route change

  if($route.current){
    if($route.current.params)
    if($route.current.params.servicio_id)
    {
      Servicio.servicio($route.current.params.servicio_id)
      .then(function(response){
        vm.servicio =response.data;
        vm.fotosTrabajo = chunk(vm.servicio.trabajos.slice(0,4),2);
        vm.servicioEnEspera = (vm.servicio.estado ==='Esperando respuesta del fixer');
      });
    }
  }
  vm.bajar = function(){
    window.scrollBy(0, 1000);
  }
  // function to handle login form
  vm.doLogin = function() {
    vm.processing = true;
    // call the Auth.login() function


    Auth.login(vm.loginData.username, vm.loginData.password)

    .then(function(data) {
      vm.processing = false;

      // if a user successfully logs in, redirect to users page
      if (data.data.success){
        if(!$window.localStorage.getItem('fixers'))
        $location.path('/inicio');
        else $location.path('/nuevo-servicio/fixers');
      }
      else
      {
        vm.error = data.data.message;
      }
    });
  };
  // doSignUp to handle signUp form
  vm.doSignUp= function() {
    // call the Auth.login() function
    if(!vm.processing){
      vm.processing = true;

      if(vm.signUpData){

        if(vm.signUpData.perfil){
          Img.subirFoto(vm.signUpData.perfil).then(function (resp) { //upload function returns a promise
            if(resp.statusText === "OK"){ //validate success
              vm.signUpData.perfil = resp.data.url;
              vm.signUpData.estrellas = 0;
              Auth.signUp(vm.signUpData)
              .then(function(data) {

                vm.processing = false;              // if a user successfully logs in, redirect to users page
                if (data.data.success){
                  if(!$window.localStorage.getItem('fixers'))
                  $location.path('/inicio');
                  else $location.path('/nuevo-servicio/fixers');              }
                  else
                  {
                    vm.processing = false;
                    vm.error = data.data.message;
                  }
                });
              } else {
                vm.processing = false;
                $window.alert('Imagen inválida' );
              }

            })
          }
          else{
            $window.alert('Ingrese una imagen' );
            vm.processing = false;
          }
        }
        else
        {
          vm.processing = false;
          vm.error = "Llene los campos";
        }
      }
    };
    // function to handle logging out
    vm.doLogout = function() {
      Auth.logout();
      // reset all user info
      vm.user = {};
      $location.path('/login');
    };


    $scope.getEstrellas = function(num) {
      if(num===0)
      return new Array(3);
      return new Array(num);
    }
    $scope.getNoEstrellas = function(num) {
      if(num===0)
      return new Array(2)
      return new Array(5-num);

    }

    function chunk(arr, size) {
      var newArr = [];
      if(arr){
        for (var i=0; i<arr.length; i+=size) {
          newArr.push(arr.slice(i, i+size));
        }
      }
      return newArr;
    }
    vm.hacerCotizacion = function()
    {
      vm.formulario = true;
    }
    vm.enviarCotizacion = function(){
      if(vm.servicio){
        if(vm.servicio.precio && vm.servicio.detalleCot){
          if($window.confirm("¿Desea enviar la cotización?")){
            vm.processing = true;
            Servicio.enviarCotizacion(vm.servicio)
            .then(function(data){
              if(data.data.success)
              {
                vm.processing = false;
                $window.alert('¡Cotización enviada!');
                $window.location.reload();
                vm.servicio = {};
                $location.path('/inicio/');
              }
              else {
                $window.alert('Ocurrió un error');
                $window.location.reload();
                vm.processing = false;
                vm.servicio = {};
                $location.path('/inicio/');
              }
            });
          }
        }
        else {
          vm.error = 'Ingrese todos los datos';
        }
      }
      else {
        vm.error = 'Ingrese todos los datos';
      }
    }
    vm.iniciarServicio = function(){

      if($window.confirm("¿Desea aceptar la cotización?")){
        vm.processing = true;
        Servicio.iniciarServicio(vm.servicio)
        .then(function(data){
          if(data.data.success)
          {
            $window.alert('¡Servicio aceptado!');
            $window.location.reload();
            vm.servicio = {};
            $location.path('/inicio/');
          }
          else {
            $window.alert('Ocurrió un error');
            $window.location.reload();
            vm.servicio = {};
            $location.path('/inicio/');
          }
        });
      }

    }
    vm.rechazarServicio = function(){

      if($window.confirm("¿Desea rechazar la propuesta?")){
        vm.processing = true;
        Servicio.rechazarServicio(vm.servicio)
        .then(function(data){
          if(data.data.success)
          {
            $window.alert('Servicio rechazado!');
            $window.location.reload();
            vm.servicio = {};
            $location.path('/inicio/');
            vm.processing = false;

          }
          else {
            $window.alert('Ocurrió un error');
            $window.location.reload();
            vm.servicio = {};
            $location.path('/inicio/');
            vm.processing = false;

          }
        });
      }
    }
    vm.terminarServicio = function(){

      if($window.confirm("¿Desea dar por terminado el servicio?")){
        vm.processing = true;
        Servicio.terminarServicio(vm.servicio)
        .then(function(data){
          if(data.data.success)
          {
            $window.localStorage.setItem('servicioTerminado', JSON.stringify(vm.servicio));
            $window.alert('Servicio finalizado!');
            $window.location.reload();
            vm.servicio = {};
          }
          else {
            $window.alert('Ocurrió un error');
            $window.location.reload();
            vm.servicio = {};
            $location.path('/inicio/');
          }
        });
      }
    }

  });
