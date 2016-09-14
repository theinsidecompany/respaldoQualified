var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var microbiologicoAguaShema = new Schema({

  id_analisis: Number,
  id_tipoAnalisis: Number,
  descripcion: String

});

module.exports = mongoose.model('microbiologicoAgua', microbiologicoAguaShema, 'microbiologicoAgua');
