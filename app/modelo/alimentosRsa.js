var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var alimentosRsaSchema = new Schema({

  id_tipoAlimento: Number,
  id_tipoAnalisis: Number,
  descripcion: String

});

module.exports = mongoose.model('AlimentosRsa', alimentosRsaSchema, 'alimentosRsa');
