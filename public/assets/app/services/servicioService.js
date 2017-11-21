angular.module('servicioService', [])

.factory('Servicio', function($http) {

// create a new object
var servicioFactory = {};


servicioFactory.solicitarServicio = function(servicioData) {
 return $http.post('/api/solicitarServicio/', servicioData);
};

servicioFactory.subirFoto = function(foto) {
 return $http.post('/api/solicitarServicio/subirFoto/', foto);
};
servicioFactory.confirmarServicio = function(servicio) {
 return $http.post('/api/confirmarServicio', servicio);
};

servicioFactory.serviciosEsperaOfertante = function(ofertante) {
 return $http.get('/api/serviciosEsperaPorOfertante/'+ofertante);
};
servicioFactory.serviciosEsperaCliente = function(cliente) {
 return $http.get('/api/serviciosEsperaPorCliente/'+cliente);
};
servicioFactory.serviciosActivoOfertante = function(ofertante) {
 return $http.get('/api/serviciosActivoPorOfertante/'+ofertante);
};
servicioFactory.serviciosActivoCliente = function(cliente) {
 return $http.get('/api/serviciosActivoPorCliente/'+cliente);
};
servicioFactory.serviciosTerminadoOfertante = function(ofertante) {
 return $http.get('/api/serviciosTerminadoPorOfertante/'+ofertante);
};
servicioFactory.serviciosTerminadoCliente = function(cliente) {
 return $http.get('/api/serviciosTerminadoPorCliente/'+cliente);
};
servicioFactory.servicio = function(id) {
 return $http.get('/api/servicio/'+id);
};
servicioFactory.enviarCotizacion = function(servicio) {
 return $http.post('/api/enviarCotizacion/', servicio);
};
servicioFactory.iniciarServicio = function(servicio) {
 return $http.post('/api/iniciarServicio/', servicio);
};
servicioFactory.terminarServicio = function(servicio) {
 return $http.post('/api/terminarServicio/', servicio);
};
servicioFactory.rechazarServicio = function(servicio) {
 return $http.post('/api/rechazarServicio/', servicio);
};
// get a single servicio

// return our entire servicioFactory object
return servicioFactory;

});
