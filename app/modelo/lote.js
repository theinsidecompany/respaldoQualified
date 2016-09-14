var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var LoteSchema = new Schema({

  id_lote: Number,
  materiaPrima: {},
  trader: {},
  lote: String,
  bulto: String,
  cantidad: Number,
  contenedor: String,
  bodega: {},
  tipoMuestreo: {}
});

module.exports = mongoose.model('Lote', LoteSchema, 'lotes');
