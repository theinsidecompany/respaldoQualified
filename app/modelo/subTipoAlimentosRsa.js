var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var subTipoAlimentosRsaSchema = new Schema({

  id_subAlimento: Number,
  id_tipoAlimento: Number,
  descripcion: String

});

module.exports = mongoose.model('SubTipoAlimentosRsa', subTipoAlimentosRsaSchema, 'subTipoAlimentosRsa');
