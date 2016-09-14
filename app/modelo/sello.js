var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var SelloSchema = new Schema({

  numero: Array,
  usuario: Number,
  estado: Boolean,
  usado: Boolean

});

module.exports = mongoose.model('Sello', SelloSchema, 'sellos');
