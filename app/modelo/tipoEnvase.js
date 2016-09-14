var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var TipoEnvaseSchema = new Schema({

  id_tipoEnvase: Number,
  tipoEnvase: String
});

module.exports = mongoose.model('TipoEnvase', TipoEnvaseSchema, 'tipoEnvases');
