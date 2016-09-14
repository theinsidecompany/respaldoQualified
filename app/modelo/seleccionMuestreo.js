var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var seleccionMuestreoSchema = new Schema({

  seleccion: Number,
  descripcion: String
  
});

module.exports = mongoose.model('SeleccionMuestreoSchema', seleccionMuestreoSchema, 'seleccionMuestreo');
