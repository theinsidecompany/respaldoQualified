var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var LoteUsuarioSchema = new Schema({

  id_usuario: Number,
  id_solicitud: Number,
  lotes: Array

});

module.exports = mongoose.model('LoteUsuario', LoteUsuarioSchema, 'loteUsuarios');
