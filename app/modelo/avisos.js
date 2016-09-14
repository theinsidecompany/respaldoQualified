var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var AvisoSchema = new Schema({

    id_usuario: Number,
    chatUsers: [{
      name: String,
      id: Number,
      online: String,
      status: String,
      id_solicitud: Number
    }]

});

module.exports = mongoose.model('Aviso', AvisoSchema, 'avisos');
