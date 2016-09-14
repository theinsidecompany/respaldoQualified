var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var ContadorSchema = new Schema({

  id: String,
  id_cliente: Number,
  seq: 0

});

module.exports = mongoose.model('Contador', ContadorSchema, 'contadores');
