var mongoose = require('mongoose'); // for working w/ our database
var Schema = mongoose.Schema;
var UserSchema    = require('./user');

// schema
var ServicioSchema = new Schema({
  alba: Boolean,
  carp: Boolean,
  plom: Boolean,
  jard: Boolean,
  elect: Boolean,
  pint: Boolean,
  estado: String, // activo, enEspera, terminado, esperandoCliente
  ciudad: String,
  direccion: String,
  descripcion: String,
  trabajos:[String],
  cliente: UserSchema,
  ofertante: UserSchema,
  id: Number,
  precio:Number,
  detalleCot: String
});


// return the model
module.exports =  ServicioSchema;
