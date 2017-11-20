var mongoose = require('mongoose'); // for working w/ our database
var Schema = mongoose.Schema;

var IdServicioSchema = new Schema({
id: Number,
 });

module.exports = IdServicioSchema;//mongoose.model('User', UserSchema);
