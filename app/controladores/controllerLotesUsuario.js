var LoteUsuario = require('../modelo/loteUsuario');

// Metodo que crea sellos
// --------------------------------------------------------------------------------------//
exports.crearLoteUsuario = function(req, resp){

  var id_usuario = req.body.id_usuario;
  var lotes = req.body.lotes;


  LoteUsuario.find({id_usuario: id_usuario}, function(err, resul){
    if (resul[0] === undefined) {
      var nuevo = {id_usuario: id_usuario, lotes: lotes};
      LoteUsuario.create(nuevo, function(err, respuesta){
        resp.send('1');
      })
    }else {
      var viejo = resul[0].lotes;
      var nuevo = viejo.concat(lotes);
      LoteUsuario.update({id_usuario: id_usuario}, {$set:{lotes: nuevo}}, function(err, respuesta){
        resp.send('1');
      })
    }
  })
}
// --------------------------------------------------------------------------------------//


exports.listarLoteUsuario = function(req, resp){
  var id_usuario = req.params.id_usuario;
  LoteUsuario.find({id_usuario: id_usuario}, function(err, resultado){
    if (resultado[0] === undefined) {
      resp.send(null);
    }else{
      resp.send(resultado);
    }
  })
}


exports.modificaLoteUsuario = function(req, resp){

  var id_usuario = req.body.id_usuario;
  var lotes = req.body.lotes;
  LoteUsuario.update({id_usuario: id_usuario}, {$set:{lotes: lotes}}, function(err, respuesta){
    LoteUsuario.find({id_usuario: id_usuario}, function(err, resultado){
      if (resultado[0] === undefined) {
        resp.send(null);
      }else{
        resp.send(resultado);
      }
    })
  })
}
