var Usuario = require('../modelo/usuario');
var Perfil = require('../modelo/perfil');

//Metodo que busca en BD el usuario ingresado y actualiza su perfil si este fue modificado anteriormente.
//Retorna valor null si el usuario no es encontrado.
exports.validarCredenciales = function(req, resp){

  var username = req.body.username;
  var password = req.body.password;

  Usuario.findOne({username: username, password: password}, function(err, usuario){

    if(usuario !== null){

      for (var i = 0; i < usuario.perfil.length; i++) {

        Perfil.findOne({id_perfil: usuario.perfil[i].id_perfil}, function(err, perfil){

          if (perfil !== null) {

            Usuario.update({id_usuario: usuario.id_usuario}, {$set:{perfil: perfil}}, function(err, respuesta){

              if (respuesta !== null) {

                Usuario.findOne({username: username, password: password}, function(err, usuarioExistente){

                  resp.send(usuarioExistente);

                })

              }

            });

          }

        });

      }

    }else{
      resp.send(usuario);
    }

  });

}
