angular.module('servicioCtrl', ['ngFileUpload'])

.controller('servicioController',['User','AuthToken','Img','$http','$route','Servicio', 'Upload','$location', '$window','Auth','$rootScope', '$scope',function(User,AuthToken,Img,$http,$route,Servicio,Upload, $location , $window,Auth,$rootScope,$scope) {

  var vm = this;
  vm.loggedIn = Auth.isLoggedIn();
  vm.ofertante = Auth.esOfertante();
  vm.processing = false;
  vm.hayFixers = $window.localStorage.getItem('fixers');

  // set a processing variable to show loading things
  vm.seleccionarServicios= function() {
    vm.processing = true;

    if(vm.servicioData){
      if(vm.servicioData.alba||vm.servicioData.elec||vm.servicioData.carp||vm.servicioData.jard||vm.servicioData.pint||vm.servicioData.plom){

        vm.processing = false;
        $location.path('nuevo-servicio/detalle');
        $window.localStorage.setItem('servicioData', JSON.stringify(vm.servicioData));
      }
      else  {
        vm.error = 'Seleccione al menos un servicio';
        vm.processing = false;

      }
    }
    else{
      vm.processing = false;
      vm.error = 'Seleccione al menos un servicio';
    }
  };
  vm.solicitarServicio= function() {
    if (vm.upload_form.files.$valid && vm.files) {
      vm.upload(vm.files);
    }else vm.error = 'Imagen inválida'
  }
  vm.upload = function (fotos) {
    vm.processing = true;
    if(vm.servicioData){
      if(Object.keys(vm.servicioData).length === 3){
          var result = {};
          var servicioData = JSON.parse($window.localStorage.getItem('servicioData'));
          for(var key in servicioData) result[key] = servicioData[key];
          for(var key in  vm.servicioData) result[key] =  vm.servicioData[key];

          $window.token= AuthToken.getToken();
          $window.ofertante = AuthToken.getOfertante();
          var routes = [];
          var ID = 0;
          if (ID < fotos.length)
          doCall(fotos[ID]);

          function doCall(key) {
            AuthToken.setToken( );
            Img.subirFoto(key).then(function(resp){
              routes.push(resp.data.url);
              ID++;
              if ( ID < fotos .length)
              doCall(fotos[ID]);
              else{
                result.trabajos = routes;
                Servicio.solicitarServicio(result)
                .then(function(data) {
                  AuthToken.setToken($window.token,$window.ofertante);
                  vm.processing = false;
                  vm.servicio = result;
                  var vac = [];
                  if($window.localStorage.getItem('fixers'))
                  $window.localStorage.removeItem('fixers') //borrar fixers
                  if(data.data.success){
                    $window.localStorage.setItem('fixers', JSON.stringify(data.data.fixers));
                    $window.localStorage.setItem('servicioId', data.data.servicioId);

                  }
                  vm.servicioData = {};
                  if(Auth.isLoggedIn()){
                    vm.processing = false;
                    $location.path('nuevo-servicio/fixers');
                  }
                  else {
                    vm.processing = false;
                    $location.path('signUp/');
                  }
                });
              }
            });
          }

      } else{
        vm.processing = false
        vm.error = 'Ingrese todos los datos.';
      }
    }else{
      vm.processing = false
      vm.error = 'Ingrese los datos.';
    }


  };

  function chunk(arr, size) {
    var newArr = [];
    if(arr){
      for (var i=0; i<arr.length; i+=size) {
        newArr.push(arr.slice(i, i+size));
      }
    }
    return newArr;
  }

  $scope.rows = chunk(JSON.parse($window.localStorage.getItem('fixers')),2);



  //fixer single
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




  if($route.current.locals.currentFixer)
  {
    $scope.fixer = $route.current.locals.currentFixer.data;
    $scope.trabajos = chunk($route.current.locals.currentFixer.data.trabajos.slice($route.current.locals.currentFixer.data.trabajos.length-4,$route.current.locals.currentFixer.data.trabajos.length),2);
  }


  if($route.current.locals.currentFixer)
  $http.get('/api/referencias/'+ $route.current.locals.currentFixer.data.username).then(function(response){
    if(response.data.referencias)
    if(response.data.referencias>4)
    $scope.referencias = response.data.referencias.splice(response.data.referencias.length-4,response.data.referencias.length);
    else
    $scope.referencias = response.data.referencias;
  });

  vm.enviarCotizacion = function()
  {
    vm.processing = true;
    if($window.confirm("¿Desea solicitar cotización a "+$route.current.locals.currentFixer.data.name+"?"))
    Auth.getUser().then(function(data){
      Servicio.confirmarServicio({id:$window.localStorage.getItem('servicioId'), cliente:data.data, ofertante:$route.current.locals.currentFixer.data})
      .then(function(data){
        if(data.data.success)
        {
          vm.processing = false;
          $window.alert('¡Solicitud enviada!');
          $location.path('/inicio');
        }
        else
        {
          vm.processing = false;
          $window.alert('Ocurrió un error');
        }
      });
    });
    vm.processing = false;

  }
  vm.enviarCotizacionYa = function(id)
  {
    vm.processing = true;
    User.get(id).then(function(response){
      if($window.confirm("¿Desea solicitar cotización a "+response.data.name+"?"))
      Auth.getUser().then(function(data){
        Servicio.confirmarServicio({id:$window.localStorage.getItem('servicioId'), cliente:data.data, ofertante:response.data})
        .then(function(data2){
          if(data2.data.success)
          {
            vm.processing = false;
            $window.alert('¡Solicitud enviada!');
            $location.path('/inicio');
          }
          else
          {
            vm.processing = false;
            $window.alert('Ocurrió un error');
          }
        });
      });
      vm.processing = false;

    });

  }

  $rootScope.$on('$routeChangeStart', function() {
    vm.loggedIn = Auth.isLoggedIn();
  });
}]);
