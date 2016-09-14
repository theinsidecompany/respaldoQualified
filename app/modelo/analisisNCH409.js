var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var analisisNCH409Schema = new Schema({

  id_analisis: Number,
  id_tipoAnalisis: Number,
  descripcion: String

});

module.exports = mongoose.model('AnalisisNCH409', analisisNCH409Schema, 'analisisNCH409');
