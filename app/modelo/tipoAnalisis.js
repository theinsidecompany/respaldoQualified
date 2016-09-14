var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var TipoAnalisisSchema = new Schema({

  id_tipoAnalisis: Number,
  id_tipoMuestreo: Number,
  descripcion: String

});

module.exports = mongoose.model('TipoAnalisis', TipoAnalisisSchema, 'tipoAnalisis');
