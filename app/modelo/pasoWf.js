var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var PasoSchema = new Schema({

  id: Number,
  paso: String

});

module.exports = mongoose.model('Paso', PasoSchema, 'pasos');
