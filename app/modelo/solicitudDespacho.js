var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var SolicitudDespachoSchema = new Schema({

  id_solicitud_despacho: Number,
id_solicitud_despacho_cliente: Number,
cliente: String,
id_cliente: Number,
inspector: String,
id_inspector: Number,
fecha_creacion: Date,
fecha_asignacion: Date,
fecha_termino: Date,
proceso: Array,
nro_sellos: Number,
asigna: Number,
asignados: Array,
carga: Array,
lotes: Array,
terminada: Boolean


});

module.exports = mongoose.model('SolicitudDespacho', SolicitudDespachoSchema, 'solicitudDespacho');
