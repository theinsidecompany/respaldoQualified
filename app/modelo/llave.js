
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var LlaveSchema = new Schema({
		id_llave: Number,
		nombre_llave: String
});

module.exports = mongoose.model('Llave', LlaveSchema, 'llaves');
