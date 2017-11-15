var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose'); // for working w/ our database
var Schema = mongoose.Schema;
var User    = require('./user');

// user schema
var ServicioSchema = new Schema({
tipo: { type: String, required: true, select: true },  //Limpieza, mantenimiento...
estado: { type: String, required: true, select: true }, //Activo, terminado, en espera de confirmacion
lugar: { type: String, required: true, select: true },   // Dirección
cliente: User,
ofertante: User
});


 // return the model
module.exports = mongoose.model('Servicio', ServicioSchema);
