var Solicitud = require('../modelo/solicitud');

var id_muestreoHarina = 1;
exports.trarSolicitudesDashboard = function(req, resp){

  Solicitud.find({'tipoMuestreo.id_muestreo': id_muestreoHarina}, function(err, solicitudes){
    resp.send(solicitudes);
  })
}

exports.trarSolicitudesDashboardCliente = function(req, resp){
  var id_usuario = req.body.id_usuario;
  Solicitud.find({$and: [{'tipoMuestreo.id_muestreo': id_muestreoHarina}, {'cliente.id_usuario': id_usuario}]}, function(err, solicitudes){
    resp.send(solicitudes);
  })
}
