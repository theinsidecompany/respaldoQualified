var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var RegionSchema = new Schema({

  id_region: Number,
  region: String

});

module.exports = mongoose.model('Region', RegionSchema, 'regiones');
