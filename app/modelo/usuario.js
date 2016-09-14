var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var UsuarioSchema = new Schema({
	id_usuario: Number,
	nombre: String,
	username: String,
	correo: Array,
	password: String,
  trader: Boolean,
  alimento: Boolean,
  animal: Boolean,
  agua: Boolean,
  perfil: [{
    id_perfil: Number,
    nombre_perfil: String,
    llave: [{
      id_llave: Number,
      nombre_llave: String
    }]
  }],
  rut: String,
  giro: String,
  direccion: String
});

module.exports = mongoose.model('Usuario', UsuarioSchema, 'usuarios');
