angular.module('servicioActivoCtrl', [])

.controller('servicioActivoController',function($route,$scope,Servicio,Upload,$rootScope, $location, Auth, User, CLURL, CLPRE,$window, Img) {
vm = this;
  vm.loggedIn = Auth.isLoggedIn();
  vm.ofertante = Auth.esOfertante();
  Auth.getUser()
  .then(function(data) {
    vm.user = data.data;
    if(vm.ofertante){
      Servicio.serviciosActivoOfertante(vm.user._id)
      .then(function(response){
        if(response.data.servicios.length> 0){
          vm.cantFixes = response.data.servicios.length
          $scope.serviciosActivos =response.data.servicios;
        }
      });
    }
    else{
      Servicio.serviciosActivoCliente(vm.user._id)
      .then(function(response){
        if(response.data.servicios.length> 0){
          $scope.serviciosActivos =response.data.servicios;
        }
      });
    }
  });

});
