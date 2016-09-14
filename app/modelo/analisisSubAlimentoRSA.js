var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var analisisSubAlimentoRSASchema = new Schema({

  id_analisis: Number,
  id_subAlimento: Number,
  descripcion: String

});

module.exports = mongoose.model('AnalisisSubAlimentoRSA', analisisSubAlimentoRSASchema, 'analisisSubAlimentoRSA');
