var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var BodegaSchema = new Schema({

  id_bodega: Number,
  nombreBodega: String

});

module.exports = mongoose.model('Bodega', BodegaSchema, 'bodegas');
