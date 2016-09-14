var Solicitud = require('../modelo/solicitud');
var MateriaPrima = require('../modelo/materiaPrima');
var Bodega = require('../modelo/bodega');
var Trader = require('../modelo/trader');
var Pais = require('../modelo/pais');
var TipoMuestreo = require('../modelo/tipoMuestreo');

exports.eliminarLoteSolicitud = function(req, resp) {

  var id_solicitud = req.body.id_solicitud;
  var id_lote = req.body.id_lote;
  var id_usuario = req.body.id_usuario;

  Solicitud.update({
    id_solicitud: id_solicitud
  }, {
    $pull: {
      lote: {
        id_lote: id_lote
      }
    }
  }, function(err, respuesta) {

    Solicitud.find({
      id_solicitud: id_solicitud
    }, function(err, solicitudes) {
      if (solicitudes === null) {
        resp.send(null);
      } else {
        resp.send(solicitudes);
      }
    });

  });


}

// Metodo que aprueba o rechaza un item del laboratorio
exports.laboratorioLoteSolicitud = function(req, resp) {

  var id_solicitud = req.body.id_solicitud;
  var id_lote = req.body.id_lote;
  var id_usuario = req.body.id_usuario;
  var id = req.body.id;

  if (id === 1) {

    Solicitud.update({
      $and: [{
        id_solicitud: id_solicitud
      }, {
        'lote.id_lote': id_lote
      }]
    }, {
      $set: {
        'lote.$.estadoLab': 'rechazado'
      }
    }, function(err, respuesta) {

      Solicitud.find({
        id_solicitud: id_solicitud
      }, function(err, solicitudes) {
        if (solicitudes === null) {
          resp.send(null);
        } else {
          resp.send(solicitudes);
        }
      });

    });

  }
  if (id === 2) {

    Solicitud.update({
      $and: [{
        id_solicitud: id_solicitud
      }, {
        'lote.id_lote': id_lote
      }]
    }, {
      $set: {
        'lote.$.estadoLab': 'aceptado'
      }
    }, function(err, respuesta) {

      Solicitud.find({
        id_solicitud: id_solicitud
      }, function(err, solicitudes) {
        if (solicitudes === null) {
          resp.send(null);
        } else {
          resp.send(solicitudes);
        }
      });

    });

  }

}


// Metodo que cambia el estado de envio de certificado un item del laboratorio
exports.laboratorioLoteDocumento = function(req, resp) {

  var id_solicitud = req.body.id_solicitud;
  var id_lote = req.body.id_lote;

  Solicitud.update({
    $and: [{
      id_solicitud: id_solicitud
    }, {
      'lote.id_lote': id_lote
    }]
  }, {
    $set: {
      'lote.$.estadoDoc': 'ok'
    }
  }, function(err, respuesta) {
    Solicitud.find({
      id_solicitud: id_solicitud
    }, function(err, solicitudes) {
      if (solicitudes === null) {
        resp.send(null);
      } else {
        resp.send(solicitudes);
      }
    });
  });
}

exports.laboratorioLoteCertificado = function(req, resp) {

  var id_solicitud = req.body.id_solicitud;
  var lote = req.body.lote;
  Solicitud.update({'id_solicitud': id_solicitud}, {$set: {'lote': lote}}, function(err, respuesta) {
    Solicitud.find({'id_solicitud': id_solicitud}, function(err, solicitudes) {
      resp.send(solicitudes);
    });
  });
}


exports.InspectorLote = function(req, resp) {
  var id_solicitud = req.body.id_solicitud;
  var id_lote = req.body.id_lote;
  var fecha = req.body.fecha_inspector_envia;
  Solicitud.update({$and: [{'id_solicitud': id_solicitud}, {'lote.id_lote': id_lote}]}, {
    $set: {'lote.$.inspectorEnvia': true, 'lote.$.fecha_inspector_envia': fecha}}, function(err, respuesta) {
    Solicitud.find({
      'id_solicitud': id_solicitud
    }, function(err, solicitudes) {
      if (solicitudes === null) {
        resp.send(null);
      } else {
        resp.send(solicitudes);
      }
    });
  });
}

exports.LoteSellos = function(req, resp) {

  var id_solicitud = req.body.id_solicitud;
  var id_lote = req.body.id_lote;
  var sellos = req.body.sellos;
  var asignados = req.body.asignados;
  var fecha = new Date();

  Solicitud.update({$and: [{id_solicitud: id_solicitud}, {'lote.id_lote': id_lote}]},
  {$set: {'lote.$.sellos': sellos, 'lote.$.asignados': asignados, 'lote.$.fecha_fin_muestreo': fecha}}, function(err, respuesta) {
    if (err) {
      resp.send(null);
    } else {
      Solicitud.find({
        id_solicitud: id_solicitud
      }, function(err, solicitud) {
        if (err) {
          resp.send(null);
        } else {
          resp.send(solicitud);
        }
      });
    }
  });
}


// //Metodo para añadir mensajes a la solicitud.
// //-------------------------------------------------------------------------------------------------------------------------------------//
// exports.actualizarLoteSolicitud = function(req, resp) {
//
//     var id_lote = req.body.id_lote;
//     var id_materiaPrima = req.body.materiaPrima;
//     var id_bodega = req.body.bodega;
//     var id_trader = req.body.trader;
//     var contenedor = req.body.contenedor;
//     var lote = req.body.lote;
//     var cantidad = req.body.cantidad;
//     var bultos = req.body.bultos;
//     var cliente = req.body.cliente;
//     var id_usuario = req.body.id_usuario;
//     var pais = req.body.paisTrader;
//     var tipoMuestreo = req.body.tipoMuestreo;
//     var estadoLab = req.body.estadoLab;
//
//     MateriaPrima.findOne({
//         id_materiaPrima: id_materiaPrima
//     }, function(err, materia) {
//
//         Bodega.findOne({
//             id_bodega: id_bodega
//         }, function(err, bodega) {
//
//             Trader.findOne({
//                 id_trader: id_trader
//             }, function(err, trader) {
//
//                 Pais.findOne({
//                     nombrePais: pais
//                 }, function(err, pais) {
//
//                     TipoMuestreo.findOne({
//                         id_tipoMuestreo: tipoMuestreo
//                     }, function(err, muestreo) {
//
//                         var nuevoLote = {
//                             bodega: bodega,
//                             contenedor: contenedor,
//                             cantidad: cantidad,
//                             bultos: bultos,
//                             lote: lote,
//                             trader: trader,
//                             materiaPrima: materia,
//                             id_lote: id_lote,
//                             paisTrader: pais,
//                             tipoMuestreo: muestreo,
//                             estadoLab: 'vacio'
//                         };
//
//                         Solicitud.findOne({
//                             id_solicitud: req.params.id_solicitud
//                         }, function(err, solicitud) {
//
//                             var nuevosLotes = solicitud.lote;
//
//                             for (var i = 0; i < nuevosLotes.length; i++) {
//
//                                 if (nuevosLotes[i].id_lote === id_lote) {
//
//                                     nuevosLotes.splice(i, 1);
//
//                                 }
//
//                             }
//
//                             nuevosLotes.push(nuevoLote);
//
//                             var nuevaSolicitud = {
//                                 id_solicitud: solicitud.id_solicitud,
//                                 id_solicitud_cliente: solicitud.id_solicitud_cliente,
//                                 id_orden_trabajo: solicitud.id_orden_trabajo,
//                                 cliente: cliente,
//                                 fecha_creacion: solicitud.fecha_creacion,
//                                 fecha_muestreo: solicitud.fecha_muestreo,
//                                 fecha_planificacion: solicitud.fecha_planificacion,
//                                 estado: solicitud.estado,
//                                 proceso: solicitud.proceso,
//                                 lote: nuevosLotes,
//                                 inspector: solicitud.inspector,
//                                 mensaje: solicitud.mensaje
//                             };
//                             Solicitud.remove({
//                                 id_solicitud: req.params.id_solicitud
//                             }, function(err, respuesta) {
//
//                             });
//
//                             Solicitud.create(nuevaSolicitud, function(err, respuesta) {
//
//                                 Solicitud.find({
//                                     'cliente.id_usuario': id_usuario
//                                 }, function(err, solicitudes) {
//                                     if (solicitudes === null) {
//                                         resp.send(null);
//                                     } else {
//                                         resp.send(solicitudes);
//
//                                     }
//                                 }).sort({
//                                     id_solicitud: 1
//                                 });
//
//                             });
//
//
//                         });
//
//                     })
//
//                 });
//
//             });
//
//         });
//
//     });
//
// }

exports.modificarLotes = function(req, resp) {

  var lotes = req.body.lotes;
  var id_solicitud = req.body.id_solicitud;

  Solicitud.update({
    id_solicitud: id_solicitud
  }, {
    $set: {
      lote: lotes
    }
  }, function(err, lotes) {
    if (err) {
      console.log(err);
      resp.send(null)
    } else {
      Solicitud.find({
        id_solicitud: id_solicitud
      }, function(err, solicitud) {
        if (err) {
          console.log(err);
          resp.send(null);
        } else {
          resp.send(solicitud[0].lote);
        }
      });
    }
  });


}
//------------------------------------------------------------------------------------------------------------------------------------//
