var Envase = require('../modelo/envase');


//Metodo que lista los envase desde la mongodb acorde a un id
//-------------------------------------------------------------------------//
exports.listarEnvaseFiltro = function(req, resp){
  var id = req.params.id_tipoEnvase;
  Envase.find({id_tipoEnvase: id}, function(err, envase){
    if (envase === null) {
        resp.send(null);
    }else{
      resp.send(envase);
    }
  })
}
//-------------------------------------------------------------------------//

//Metodo que lista los envase desde la mongodb
//-------------------------------------------------------------------------//
exports.listarEnvase = function(req, resp){
  Envase.find(function(err, envase){
    if (envase === null) {
        resp.send(null);
    }else{
      resp.send(envase);
    }
  })
}
//-------------------------------------------------------------------------//


//Metodo que crea un envase desde el html a la mongodb
//-------------------------------------------------------------------------//
exports.crearEnvase = function(req, resp){
  var nombre = req.body.envase;
  var id = req.body.id_tipoEnvase;
  Envase.find(function(err, lista){
    if (lista.length === 0) {
        var id_envase = 1;
    }else {
      for (var i = 0; i < lista.length; i++) {
          var id_envase = lista[i].id_envase + 1;
      }
    }
    console.log(nombre);
  var nuevo = {id_envase: id_envase, id_tipoEnvase: id, envase: nombre};
  Envase.create(nuevo, function(err, respuesta){
    if (respuesta !== null) {
      Envase.find(function(err, listarEnvase){
        if (listarEnvase === null) {
            resp.send(null);
        }else{
          resp.send(listarEnvase);
        }
      })
    }
  })
})
}
//-------------------------------------------------------------------------//


//Metodo que elimina un documento de envase de la mongodb acorde al id ingresado
//-------------------------------------------------------------------------//
exports.eliminaEnvase = function(req, resp){
  var id = req.params.id_envase;
  Envase.remove({id_envase: id},function(err, respuesta){
      if (respuesta !== null) {
        Envase.find(function(err, listarEnvase){
          if (listarEnvase === null) {
              resp.send(null);
          }else{
            resp.send(listarEnvase);
          }
        })
      }
  })
}
//-------------------------------------------------------------------------//


//Metodo que modifica un documento de envase de la mongodb acorde al id ingresado
//-------------------------------------------------------------------------//
exports.modificaEnvase = function(req, resp){
  var id = req.body.id_envase;
	Envase.update( {id_envase: id},
					{$set:{envase : req.body.envase}},
					function(err, respuesta) {
						if (respuesta !== null){
              Envase.find(function(err, listarEnvase){
                if (listarEnvase === null) {
                    resp.send(null);
                }else{
                  resp.send(listarEnvase);
                }
              })
            }
			})
	}
  //-------------------------------------------------------------------------//
