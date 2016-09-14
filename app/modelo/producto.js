var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var ProductoSchema = new Schema({

  id_producto: Number,
  nombreProducto: String

});

module.exports = mongoose.model('Producto', ProductoSchema, 'productos');
