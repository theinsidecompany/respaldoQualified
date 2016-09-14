var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var analisisNCH1333Schema = new Schema({

  id_analisis: Number,
  id_tipoAnalisis: Number,
  descripcion: String

});

module.exports = mongoose.model('AnalisisNCH1333', analisisNCH1333Schema, 'analisisNCH1333');
