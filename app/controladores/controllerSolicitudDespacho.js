var Despacho = require('../modelo/solicitudDespacho');
var Sol = require('../modelo/solicitud');


//Metodo que guarda en base de datos las solicitudes de despacho y sus lotes asociados.
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
exports.crearSolicitudDespacho = function(req, resp){
  var id_solicitud_despacho = req.body.id_solicitud_despacho;
  var id_solicitud_despacho_cliente = req.body.id_solicitud_despacho_cliente;
  var cliente = req.body.cliente;
  var id_cliente = req.body.id_cliente
  var fecha_creacion = req.body.fecha_creacion;
  var fecha_asignacion = req.body.fecha_asignacion;
  var fecha_termino = req.body.fecha_termino;
  var chofer = req.body.chofer;
  var patente = req.body.patente;
  var destino = req.body.destino;
  var factura = req.body.factura;
  var nro_sellos = req.body.nro_sellos;
  var checklist = req.body.checklist;
  var lotes = req.body.lotes;
  var proceso = req.body.proceso;
  var inspector = req.body.inspector;
  var id_inspector = req.body.id_inspector;


  var nuevaSolicitudDespacho = {'id_solicitud_despacho': id_solicitud_despacho, 'id_solicitud_despacho_cliente': id_solicitud_despacho_cliente, 'cliente': cliente, 'id_cliente': id_cliente , 'inspector': inspector, 'id_inspector': id_inspector, 'proceso': proceso , 'fecha_creacion': fecha_creacion,
  'fecha_asignacion': fecha_asignacion, 'fecha_termino': fecha_termino, 'chofer': chofer, 'patente': patente, 'destino': destino, 'factura': factura, 'nro_sellos': nro_sellos, 'checklist': checklist, 'lotes': lotes};
  Despacho.create(nuevaSolicitudDespacho, function(err, respuesta){
    if (respuesta !== null) {
      resp.send(respuesta);
    }
  });
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//


//Metodo que trae de base de datos todas las solicitudes.
//-----------------------------------------------------//
exports.traerSolicitudesDespacho = function(req, resp){
  Despacho.find(function(err, solicitudes){
    if (solicitudes === null) {
      resp.send(null);
    }else{
      resp.send(solicitudes);
    }
  })
}


exports.traerSolicitudesDespachoFiltro = function(req, resp){
  var id_cliente = req.params.id_cliente;
  Despacho.find({'id_cliente': id_cliente}, function(err, solicitudes){
    if (solicitudes === null) {
      resp.send(null);
    }else{
      resp.send(solicitudes);
    }
  })
}


exports.traerSolicitudesDespachoFiltroInspector = function(req, resp){
  var id_inspector = req.params.id_inspector;
  Despacho.find({'id_inspector': id_inspector}, function(err, solicitudes){
    if (solicitudes === null) {
      resp.send(null);
    }else{
      resp.send(solicitudes);
    }
  })
}


exports.traerSDUnica = function(req, resp){
  var id_solicitud_despacho = req.params.id_solicitud_despacho;
  Despacho.find({'id_solicitud_despacho': id_solicitud_despacho}, function(err, solicitudes){
    if (solicitudes === null) {
      resp.send(null);
    }else{
      resp.send(solicitudes);
    }
  })
}
//-----------------------------------------------------//


exports.asignaInpector = function(req, resp){

  var id_solicitud_despacho = req.body.id_solicitud_despacho;
  var inspector = req.body.inspector;
  var id_inspector = req.body.id_inspector;
  var proceso = req.body.proceso;

  Despacho.update({'id_solicitud_despacho': id_solicitud_despacho}, {$set:{'inspector': inspector, 'id_inspector': id_inspector, 'proceso': proceso}}, function(err, solicitudes){
    Despacho.find(function(err, lista){
      if (lista === null) {
        resp.send(null);
      }else{
        resp.send(lista);
      }
    })
  })
}


exports.asignaTransporte = function(req, resp){

  var id_solicitud_despacho = req.body.id_solicitud_despacho;
  var lotes = req.body.lotes;
  var asigna = req.body.asigna;
  var asignados = req.body.asignados;
  var id_inspector = req.body.id_inspector;

  Despacho.update({'id_solicitud_despacho': id_solicitud_despacho}, {$set:{'carga': lotes, 'asigna': asigna, 'asignados': asignados}}, function(err, respuesta){
    Despacho.find({'id_solicitud_despacho': id_solicitud_despacho}, function(err, solicitudes){
      if (solicitudes === null) {
        resp.send(null);
      }else{
        resp.send(solicitudes);
      }
    })
  })
}


exports.asignaTermino = function(req, resp){

  var id_solicitud_despacho = req.body.id_solicitud_despacho;
  var id_inspector = req.body.id_inspector;

  Despacho.update({'id_solicitud_despacho': id_solicitud_despacho}, {$set:{'terminada': true}}, function(err, respuesta){
    Despacho.find({'id_inspector': id_inspector}, function(err, solicitudes){
      if (solicitudes === null) {
        resp.send(null);
      }else{
        resp.send(solicitudes);
      }
    })
  })
}

exports.asignaTerminoFalse = function(req, resp){

  var id_solicitud_despacho = req.body.id_solicitud_despacho;
  var id_inspector = req.body.id_inspector;

  Despacho.update({'id_solicitud_despacho': id_solicitud_despacho}, {$set:{'terminada': false}}, function(err, respuesta){
    Despacho.find({'id_inspector': id_inspector}, function(err, solicitudes){
      if (solicitudes === null) {
        resp.send(null);
      }else{
        resp.send(solicitudes);
      }
    })
  })
}


exports.entregar = function(req, resp){

  var id_solicitud_despacho = req.body.id_solicitud_despacho;
  var id_inspector = req.body.id_inspector;
  var proceso = req.body.proceso;
  Despacho.update({'id_solicitud_despacho': id_solicitud_despacho}, {$set:{'proceso': proceso}}, function(err, solicitudes){
    Despacho.find({'id_inspector': id_inspector}, function(err, solicitudes){
      if (solicitudes === null) {
        resp.send(null);
      }else{
        resp.send(solicitudes);
      }
    })
  })
}


exports.finalizarProceso = function(req, resp){

  var solicitud = req.body.solicitud;
  var lotes = solicitud.lotes;
  var id_lote;
  for (var i = 0; i < lotes.length; i++) {
    // id_lote = lotes[i].id_lote;
    Sol.find({id_solicitud: lotes[i].id_solicitud}, function(err, solicitudes){

      if (solicitudes[0] === undefined) {
        resp.send(null);
      }else {
        var listaLotes = solicitudes[0].lote;
        var id_solicitud = solicitudes[0].id_solicitud;
        for (var i = 0; i < lotes.length; i++) {
          id_lote = lotes[i].id_lote;

        for (var j = 0;j < listaLotes.length; j++) {
          if (listaLotes[j].id_lote ===  id_lote) {
            listaLotes[j].finalizado = true;
            listaLotes[j].estadoLab = 'no';
          }
        }
      }

        var cont = 0;
        for (var h = 0; h < listaLotes.length; h++) {
          if (listaLotes[h].finalizado === true) {
            cont++;
          }
        }

        if (cont === listaLotes.length) {
          var proceso = [{"id_proceso" : 15, "descripcion" : "Finalizado", "color" : "A901DB", "icono" : "flag", "visible" : true}];
          Sol.update({'id_solicitud': id_solicitud}, {$set:{'proceso': proceso, 'estado': "Finalizado"}}, function(err, respuesta){
          })
          Sol.update({'id_solicitud': id_solicitud}, {$set:{'lote': listaLotes}}, function(err, resp){
          })
        }else {
          Sol.update({'id_solicitud': id_solicitud}, {$set:{'lote': listaLotes}}, function(err, respuesta){
          })
        }
      }
    })
  }
  resp.send('1');
}

exports.actualizarSD = function(req, resp){

  var lotes = req.body.lotes;
  var id_despacho = req.body.id_despacho;

  Despacho.update({id_solicitud_despacho: id_despacho}, {$set:{lotes: lotes}}, function(err, lotes){
    if (err) {
      resp.send(null)
    }else{
      Despacho.find({id_solicitud_despacho: id_despacho}, function(err, sd){
        if (err) {
          resp.send(null);
        }else{
          resp.send(sd[0].lotes);
        }
      });
    }
  });

}
