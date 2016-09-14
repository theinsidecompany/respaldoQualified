var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var PaisSchema = new Schema({

  id_pais: Number,
  nombrePais: String

});

module.exports = mongoose.model('Pais', PaisSchema, 'paises');
