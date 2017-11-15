angular.module('fixerCtrl', ['ngFileUpload'])

.controller('fixerController',[ 'User','Upload','$location', '$window', function(User,Upload, $location , $window) {

  var vm = this;
  // set a processing variable to show loading things
  vm.seleccionarServiciosFixer = function() {
    $location.path('nuevo-fixer/detalle');
    $window.fixerData = vm.fixerData;
  };
  vm.nuevoFixer= function() {
    if (vm.upload_form.fotos.$valid && vm.fotos && vm.upload_form.perfil.$valid && vm.perfil) {
      vm.upload(vm.perfil, vm.fotos);
    }
  }

  vm.upload = function (perfil, fotos) {
    Upload.upload({
      url: '/api/fixer/subirFotoPerfil', //webAPI exposed to upload the file
      data:{foto:perfil} //pass file as data, should be user ng-model
    }).then(function (resp) { //upload function returns a promise
      if(resp.data.error_code === 0){ //validate success

        Upload.upload({
          url: '/api/subirFotos', //webAPI exposed to upload the file
          data:{fotos:fotos} //pass file as data, should be user ng-model
        }).then(function (resp2) {

          var result = {};
          for(var key in $window.fixerData) result[key] = $window.fixerData[key];
          for(var key in  vm.fixerData) result[key] =  vm.fixerData[key];
          result.perfil = resp.data.route;
          result.trabajos = resp2.data.routes;
          result.ofertante = true;
          result.votos = 0;
          result.estrellas = 0;
          vm.fixer = result;
          User.create(result)
          .success(function(data) {
            vm.userData = {};
            vm.message = data.message;
            vm.fixerData = {};
            $window.fixerData = {};
          });
        });
      }
    });
  }

}]);
