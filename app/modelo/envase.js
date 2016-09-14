var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var EnvaseSchema = new Schema({

  id_envase: Number,
  id_tipoEnvase: Number,
  envase: String

});

module.exports = mongoose.model('Envase', EnvaseSchema, 'envases');
