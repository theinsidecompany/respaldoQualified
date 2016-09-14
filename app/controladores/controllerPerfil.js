var Perfil = require('../modelo/perfil');

exports.crearPerfil = function(req, resp){
  var id_perfil = req.body.id_perfil;
  var nombre_perfil = req.body.nombre_perfil;
  var llave = req.body.llave;

    var nuevoPerfil = {id_perfil: id_perfil, nombre_perfil: nombre_perfil, llave: llave};
    Perfil.create(nuevoPerfil, function(err, respuesta){
      if (respuesta !== null) {
        Perfil.find(function(err, perfiles){
          if (perfiles !== null) {
              resp.send(perfiles);
          }
        })
      }
    });
}

exports.traerPerfiles = function(req, resp){

  Perfil.find(function(err, perfiles){
    if (perfiles !== null) {
        resp.send(perfiles);
    }
  })

}

exports.traerPerfil = function(req, resp){

  var id_perfil = req.params.id_perfil;
  Perfil.findOne({id_perfil: id_perfil}, function(err, perfil){
      if (perfil !== null) {
          resp.send(perfil);
      }
  })

}

exports.eliminarPerfil = function(req, resp){

  Perfil.remove({id_perfil: req.params.id_perfil}, function(err, respuesta){
    if (respuesta !== null) {
      Perfil.find(function(err, perfiles){
        if (perfiles !== null) {
            resp.send(perfiles);
        }
      })
    }
  });

}

//Metodo que actualiza un perfil en la base de datos.
exports.actualizarPerfil = function(req, resp){

  var id_perfil = req.params.id;
  var nombre_perfil = req.body.nombre_perfil;
  var llave = req.body.llave;
  Perfil.update({id_perfil: id_perfil},
                  {$set: {nombre_perfil: nombre_perfil, llave: llave}}, function(err, respuesta){
                    if (respuesta !== null) {
                      Perfil.find(function(err, perfiles){
                        if (perfiles !== null) {
                            resp.send(perfiles);
                        }
                      });
                    }
                  });

}
