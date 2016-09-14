var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var PerfilSchema = new Schema({
		id_perfil: Number,
		nombre_perfil: String,
    llave: Array
});

module.exports = mongoose.model('Perfil', PerfilSchema, 'perfiles');
