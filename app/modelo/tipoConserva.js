var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var tipoConservaSchema = new Schema({

  id_analisis: Number,
  id_tipoAlimento: Number,
  descripcion: String

});

module.exports = mongoose.model('TipoConserva', tipoConservaSchema, 'tipoConserva');
