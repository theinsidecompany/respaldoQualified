var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var ComunaSchema = new Schema({

  id_comuna: Number,
  id_region: Number,
  comuna: String

});

module.exports = mongoose.model('Comuna', ComunaSchema, 'comunas');
