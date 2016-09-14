var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var subAnalisisSchema = new Schema({

  id_subAnalisis: Number,
  id_tipoAnalisis: Number,
  descripcion: String

});

module.exports = mongoose.model('SubAnalisisSchema', subAnalisisSchema, 'subAnalisis');
