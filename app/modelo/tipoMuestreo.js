var mongoose = require('mongoose') ,Schema = mongoose.Schema;

var TipoMuestreoSchema = new Schema({

  id_tipoMuestreo: Number,
  descripcion: String

});

module.exports = mongoose.model('TipoMuestreo', TipoMuestreoSchema, 'tipoMuestreos');
