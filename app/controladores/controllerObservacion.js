var Observacion = require('../modelo/observaciones');

//Metodo que guarda en base de datos los traders.
//----------------------------------------------------------------------------------//
exports.crearObservacion = function(req, resp){
  var id_solicitud = req.body.id_solicitud;
  var id_solicitud_cliente = req.body.id_solicitud_cliente;
  var id_orden_trabajo = req.body.id_orden_trabajo;
  var id_lote = req.body.id_lote;
  var observacion = req.body.observacion;

  Observacion.find({$and: [{'id_solicitud': id_solicitud}, {'id_lote': id_lote}]},function(err, respuesta){
    var nuevo = {'id_solicitud': id_solicitud, 'id_solicitud_cliente': id_solicitud_cliente, 'id_orden_trabajo': id_orden_trabajo, 'id_lote': id_lote, 'observacion': observacion};
    if (respuesta[0] === undefined) {
      Observacion.create(nuevo, function(err, respu){
        resp.send(null);
      });
    }else{
      var nuevo = respuesta[0].observacion;
      var nuevaObservacion = nuevo.concat(observacion);
      Observacion.update({$and:[{'id_solicitud': id_solicitud}, {'id_lote': id_lote}]}, {$set:{'observacion': nuevaObservacion}},
      function(err, response) {
        resp.send('1');
      })
    }
  })
}
//----------------------------------------------------------------------------------//


//Metodo que trae de base de datostodos los traders.
//----------------------------------------------------------------------------------//
exports.listarObservacionFiltro = function(req, resp){
  var id_solicitud = req.body.id_solicitud;
  var id_lote = req.body.id_lote;
  Observacion.find({$and: [{'id_solicitud': id_solicitud}, {'id_lote': id_lote}]},function(err, respuesta){
    if (respuesta === null) {
      resp.send(null);
    }else{
      resp.send(respuesta);
    }
  })
}
//----------------------------------------------------------------------------------//

exports.agregarObservacion = function(req, resp){

    observacion = req.body.observacion;
    id_solicitud = req.body.observacion.id_solicitud;
    id_lote = req.body.observacion.id_lote;

    Observacion.create(observacion, function(err, obs){
      if (err) {
        console.log(err);
        resp.send(null);
      }else{
        Observacion.find({$and:[{id_solicitud: id_solicitud},{id_lote: id_lote}]}, function(err, observaciones){
          if (err) {
            resp.send(null);
          }else{
            resp.send(observaciones);
          }
        })
      }
    });
}


exports.traerObservacion = function(req, resp){

    var id_solicitud = req.body.id_solicitud;
    var id_lote = req.body.id_lote;

    Observacion.findOne({$and:[{id_solicitud: id_solicitud}, {id_lote: id_lote}]}, function(err, observaciones){
      console.log(observaciones);
      if (err) {
        resp.send(null);
        console.log('if');
      }else{
        if (observaciones !== null) {
          resp.send(observaciones);
        }else{
          resp.send('0');
        }
      }
    });

}


exports.actualizarObservacion = function(req, resp){

  var id_solicitud = req.body.id_solicitud;
  var id_lote = req.body.id_lote;
  var lista = req.body.observacion;

  Observacion.update({$and:[{id_solicitud: id_solicitud}, {id_lote: id_lote}]}, {$set:{observacion: lista}}, function(err, actualizar){
    if (err) {
      resp.send(null);
    }else{
      Observacion.find({$and:[{id_solicitud: id_solicitud},{id_lote: id_lote}]}, function(err, observaciones){
        if (err) {
          resp.send(null);
        }else{
          resp.send(observaciones);
        }
      });
    }
  });

}
