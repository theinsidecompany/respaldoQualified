var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var TraderSchema = new Schema({

  id_trader: Number,
  nombreTrader: String

});

module.exports = mongoose.model('Trader', TraderSchema, 'traders');
