var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var SolicitudSchema = new Schema({

  id_solicitud: Number,
  id_solicitud_cliente: Number,
  id_orden_trabajo: Number,
  cliente: {
     id_usuario: Number,
       nombre: String,
       username: String,
       correo: String,
       password: String,
       rut: String,
       giro: String,
       direccion: String,
     perfil: [{
       id_perfil: Number,
       nombre_perfil: String,
       llave: [{
         id_llave: Number,
         nombre_llave: String
       }]
     }]
   },
  casino: Boolean,
  fecha_creacion: Date,
  fecha_muestreo: Date,
  fecha_planificacion: Date,
  estado: String,
  proceso: [{
    id_proceso: Number,
    descripcion: String,
    color: String,
    icono: String,
    visible: Boolean
  }],
  lote: Array,
  inspector: Number,
  laboratorio: Number,
  mensaje: [{
    id_mensaje: Number,
    fecha: Date,
    contenido: String,
    emisor: String,
    cargo: String
  }],
  evidencia: [{
      nombre: String,
      fecha: Date
  }],
  encargado: String,
  tipoMuestreo: {
    id_muestreo: Number,
    descripcion: String
  }

});

module.exports = mongoose.model('Solicitud', SolicitudSchema, 'solicitudes');
