angular.module('referenciaCtrl', ['servicioService'])

.controller('referenciaController', ['AuthToken','Img','Servicio','$scope','$window','$rootScope','Auth','$route','$http','$location',function(AuthToken,Img,Servicio, $scope,$window,$rootScope,Auth,$route,$http,$location) {

  vm = this;


  function chunk(arr, size) {
    var newArr = [];
    if(arr){
      for (var i=0; i<arr.length; i+=size) {
        newArr.push(arr.slice(i, i+size));
      }
    }
    return newArr;
  }
  Auth.getUser()
  .then(function(data) {
    vm.user = data.data;
  });
  vm.servicio =  JSON.parse($window.localStorage.getItem('servicioTerminado'));
  vm.enviar = function()
  {
    vm.processing = true;
    if(vm.referencia){
      if(vm.referencia.estrella &&vm.referencia.texto)
      {
        $window.token= AuthToken.getToken();
        $window.ofertante = AuthToken.getOfertante();
        var routes = [];
        var ID = 0;
        if(vm.fotos){
          if (ID < vm.fotos.length){
            doCall(vm.fotos[ID]);
          }
          else{
            var ref = {
              estrellas: vm.referencia.estrella,
              fixerUsername: $route.current.locals.currentFixer.data.username,
              texto:vm.referencia.texto,
              cliente: {username:vm.servicio.cliente.username,perfil:vm.servicio.cliente.perfil}
            }
            var obj = {ref:ref,fixerId: $route.current.params.fixer_id,trabajos:routes}
            AuthToken.setToken($window.token,$window.ofertante);
            $http.post('/api/referencias/',obj).then(function(data){
              vm.processing = false;
              $location.path('/inicio');
            }
          );
        }
      }
      else{
        var ref = {
          estrellas: vm.referencia.estrella,
          fixerUsername: $route.current.locals.currentFixer.data.username,
          texto:vm.referencia.texto,
          cliente: {username:vm.servicio.cliente.username,perfil:vm.servicio.cliente.perfil}
        }
        var obj = {ref:ref,fixerId: $route.current.params.fixer_id,trabajos:routes}
        AuthToken.setToken($window.token,$window.ofertante);
        $http.post('/api/referencias/',obj).then(function(data){
          vm.processing = false;
          $location.path('/inicio');
        }
      );
    }
      function doCall(key) {
        AuthToken.setToken( );
        Img.subirFoto(key).then(function(resp){
          routes.push(resp.data.url);
          ID++;
          if ( ID < vm.fotos .length)
          doCall(vm.fotos[ID]);
          else{
            var ref = {
              estrellas: vm.referencia.estrella,
              fixerUsername: $route.current.locals.currentFixer.data.username,
              texto:vm.referencia.texto,
              cliente: {username:vm.servicio.cliente.username,perfil:vm.servicio.cliente.perfil}
            }
            AuthToken.setToken($window.token,$window.ofertante);
            var obj = {ref:ref,fixerId: $route.current.params.fixer_id,trabajos:routes}
            $http.post('/api/referencias/',obj).then(function(data){
              vm.processing = false;
              $location.path('/inicio');
            }
          );
        }
      });
    }

  } else {vm.error = "Ingrese todos los datos";            vm.processing = false; }
}else {vm.error = "Ingrese todos los datos";            vm.processing = false;}


}
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
$scope.rows = chunk(JSON.parse($window.localStorage.getItem('fixers')),2);



Servicio.solicitarServicio({})
.then(function(data) {
  var vac = [];
  if($window.localStorage.getItem('fixers'))
  $window.localStorage.removeItem('fixers') //borrar fixers
  if(data.data.success){
    $window.localStorage.setItem('fixers', JSON.stringify(data.data.fixers));
  }
  vm.servicioData = {};

});


}]);
