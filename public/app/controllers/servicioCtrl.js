angular.module('servicioCtrl', ['servicioService','ngFileUpload'])

.controller('servicioController',['$http','$route','Servicio', 'Upload','$location', '$window','Auth','$rootScope', '$scope',function($http,$route,Servicio,Upload, $location , $window,Auth,$rootScope,$scope) {

  var vm = this;
  vm.loggedIn = Auth.isLoggedIn();

  // set a processing variable to show loading things
  vm.processing = true;
  vm.seleccionarServicios= function() {
    $location.path('nuevo-servicio/detalle');
    $window.servicioData = vm.servicioData;
  };
  vm.solicitarServicio= function() {
    vm.processing = true;
    if (vm.upload_form.files.$valid && vm.files) {
      vm.upload(vm.files);
    }
  }
  vm.upload = function (files) {
    Upload.upload({
      url: '/api/subirFotos', //webAPI exposed to upload the file
      data:{files:files} //pass file as data, should be user ng-model
    }).then(function (resp) { //upload function returns a promise
      if(resp.data.error_code === 0){ //validate success
        $window.alert('Exito' );
        var result = {};
        for(var key in $window.servicioData) result[key] = $window.servicioData[key];
        for(var key in  vm.servicioData) result[key] =  vm.servicioData[key];
        result.routes = resp.data.routes;
        console.log(resp.data.routes);
        Servicio.solicitarServicio(result)
        .success(function(data) {
          vm.processing = false;
          vm.servicio = result;
          var vac = [];
          if($window.localStorage.getItem('fixers'))
          $window.localStorage.removeItem('fixers') //borrar fixers
          if(data.success){
            $window.localStorage.setItem('fixers', JSON.stringify(data.fixers));
          }
          vm.servicioData = {};
          if(Auth.isLoggedIn()){
            $location.path('nuevo-servicio/fixers');
          }
          else {
            $location.path('signUp/');
          }
        });
      } else {
        $window.alert('Ocurrio un error');
      }
    });
  };
  vm.hayFixers = function ()
  {
    return $window.localStorage.getItem('fixers');

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
  $scope.trabajos = chunk($route.current.locals.currentFixer.data.trabajos.slice(0,4),2);
}


vm.prueba2 = function()
{
  $http.get('/api/referencias/'+ $route.current.locals.currentFixer.data.username).then(function(response){
    console.log(response);
  });
}
if($route.current.locals.currentFixer)
$http.get('/api/referencias/'+ $route.current.locals.currentFixer.data.username).then(function(response){
  $scope.referencias = response.data.referencias.splice(response.data.referencias.length-4,4);
});
vm.prueba1 = function()
{
  var ref = {
    estrellas: 2,
    fixerUsername:'af.olivares10',
    texto:'regular',
    cliente: {username:'d'}
  }
  var obj = {ref:ref, fixerId: $route.current.params.fixer_id}
  $http.post('/api/referencias/',obj);
}


  vm.imprimir = function()
  {
    console.log( $route.current.locals);
  }


  $rootScope.$on('$routeChangeStart', function() {
    vm.loggedIn = Auth.isLoggedIn();
  });
}]);
