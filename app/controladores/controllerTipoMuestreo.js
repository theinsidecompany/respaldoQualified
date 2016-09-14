var TipoMuestreo = require('../modelo/tipoMuestreo');


//Metodo que lista los tipos de muestreo desde la mongodb
//-------------------------------------------------------------------------//
exports.listarTipoMuestreo = function(req, resp){
  TipoMuestreo.find(function(err, tipoMuestreo){
    if (tipoMuestreo === null) {
      resp.send(null);
    }else{
      resp.send(tipoMuestreo);
    }
  })
}
//-------------------------------------------------------------------------//


//Metodo que crea un tipo de muestreo desde el html a la mongodb
//-------------------------------------------------------------------------//
exports.crearTipoMuestreo = function(req, resp){
  var nombre = req.body.tipoMuestreo;
  TipoMuestreo.find(function(err, lista){
    if (lista.length === 0) {
      var id_tipoMuestreo = 1;
    }else {
      for (var i = 0; i < lista.length; i++) {
        var id_tipoMuestreo = lista[i].id_tipoMuestreo + 1;
      }
    }

    TipoMuestreo.find({tipoMuestreo: nombre},function(err, respu){
      if (respu[0] === undefined) {
        var nuevo = {id_tipoMuestreo: id_tipoMuestreo, tipoMuestreo: nombre};
        TipoMuestreo.create(nuevo, function(err, respuesta){
          if (respuesta !== null) {
            TipoMuestreo.find(function(err, listarTipoMuestreo){
              if (listarTipoMuestreo === null) {
                resp.send(null);
              }else{
                resp.send(listarTipoMuestreo);
              }
            })
          }
        })
      }else {
        resp.send('1');
      }
    })
  })
}
//-------------------------------------------------------------------------//


//Metodo que elimina un documento de tipo de muestreo de la mongodb acorde al id ingresado
//-------------------------------------------------------------------------//
exports.eliminaTipoMuestreo = function(req, resp){
  var id = req.params.id_tipoMuestreo;
  TipoMuestreo.remove({id_tipoMuestreo: id},function(err, respuesta){
    if (respuesta !== null) {
      TipoMuestreo.find(function(err, listarTipoMuestreo){
        if (listarTipoMuestreo === null) {
          resp.send(null);
        }else{
          resp.send(listarTipoMuestreo);
        }
      })
    }
  })
}
//-------------------------------------------------------------------------//


//Metodo que modifica un documento de tipo de muestreo de la mongodb acorde al id ingresado
//-------------------------------------------------------------------------//
exports.modificaTipoMuestreo = function(req, resp){

  TipoMuestreo.find({tipoMuestreo: req.body.tipoMuestreo},function(err, respuesta){
    if (respuesta[0] === undefined) {
      var id = req.body.id_tipoMuestreo;
      TipoMuestreo.update( {id_tipoMuestreo: id},
        {$set:{tipoMuestreo : req.body.tipoMuestreo}},
        function(err, respuesta) {
          if (respuesta !== null){
            TipoMuestreo.find(function(err, listarTipoMuestreo){
              if (listarTipoMuestreo === null) {
                resp.send(null);
              }else{
                resp.send(listarTipoMuestreo);
              }
            })
          }
        })
      }else {
        resp.send('1')
      }
    })
  }
  //-------------------------------------------------------------------------//
