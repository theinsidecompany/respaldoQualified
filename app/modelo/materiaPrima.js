var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var MateriaPrimaSchema = new Schema({

  id_materiaPrima: Number,
  id_materia:  Number,
  nombreMateriaPrima: String

});

module.exports = mongoose.model('MateriaPrima', MateriaPrimaSchema, 'materiasPrimas');
