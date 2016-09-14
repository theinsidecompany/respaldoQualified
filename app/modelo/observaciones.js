var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var ObservacionSchema = new Schema({
		id_solicitud: Number,
    id_solicitud_cliente: Number,
    id_orden_trabajo: Number,
    id_lote: Number,
		observacion: [{
      cargo: String,
      emisor: String,
      fecha: Date,
      contenido: String,
      evidencias: [{
        nombreArchivo: String
      }]
    }]
});

module.exports = mongoose.model('Obsevacion', ObservacionSchema, 'observaciones');
