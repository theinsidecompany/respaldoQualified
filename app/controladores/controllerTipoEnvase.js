var TipoEnvase = require('../modelo/tipoEnvase');


//Metodo que lista los tipos de envase desde la mongodb
//-------------------------------------------------------------------------//
exports.listarTipoEnvase = function(req, resp){
  TipoEnvase.find(function(err, tipoEnvase){
    if (tipoEnvase === null) {
        resp.send(null);
    }else{
      resp.send(tipoEnvase);
    }
  })
}
//-------------------------------------------------------------------------//


//Metodo que crea un tipo de envase desde el html a la mongodb
//-------------------------------------------------------------------------//
exports.crearTipoEnvase = function(req, resp){
  var nombre = req.body.tipoEnvase;
  TipoEnvase.find(function(err, lista){
    if (lista.length === 0) {
        var id_tipoEnvase = 1;
    }else {
      for (var i = 0; i < lista.length; i++) {
          var id_tipoEnvase = lista[i].id_tipoEnvase + 1;
      }
    }
  var nuevo = {id_tipoEnvase: id_tipoEnvase, tipoEnvase: nombre};
  TipoEnvase.create(nuevo, function(err, respuesta){
    if (respuesta !== null) {
      TipoEnvase.find(function(err, listarTipoEnvase){
        if (listarTipoEnvase === null) {
            resp.send(null);
        }else{
          resp.send(listarTipoEnvase);
        }
      })
    }
  })
})
}
//-------------------------------------------------------------------------//


//Metodo que elimina un documento de tipo de envase de la mongodb acorde al id ingresado
//-------------------------------------------------------------------------//
exports.eliminaTipoEnvase = function(req, resp){
  var id = req.params.id_tipoEnvase;
  TipoEnvase.remove({id_tipoEnvase: id},function(err, respuesta){
      if (respuesta !== null) {
        TipoEnvase.find(function(err, listarTipoEnvase){
          if (listarTipoEnvase === null) {
              resp.send(null);
          }else{
            resp.send(listarTipoEnvase);
          }
        })
      }
  })
}
//-------------------------------------------------------------------------//


//Metodo que modifica un documento de tipo de envase de la mongodb acorde al id ingresado
//-------------------------------------------------------------------------//
exports.modificaTipoEnvase = function(req, resp){
  var id = req.body.id_tipoEnvase;
	TipoEnvase.update( {id_tipoEnvase: id},
					{$set:{tipoEnvase : req.body.tipoEnvase}},
					function(err, respuesta) {
						if (respuesta !== null){
              TipoEnvase.find(function(err, listarTipoEnvase){
                if (listarTipoEnvase === null) {
                    resp.send(null);
                }else{
                  resp.send(listarTipoEnvase);
                }
              })
            }
			})
	}
  //-------------------------------------------------------------------------//
