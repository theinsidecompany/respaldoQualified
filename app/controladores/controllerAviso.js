var Aviso = require('../modelo/avisos');

//Metodo que guarda en base de datos los avisos acorde a el usuario.
//----------------------------------------------------------------------------------//
exports.crearAvisos = function(req, resp){
  var usuario = req.body.usuario;
  var name = req.body.name;
  var id = req.body.id;
  var online = req.body.online;
  var status = req.body.status;
  var id_solicitud = req.body.id_solicitud;
  var nuevoaviso = {name: name, id: id, online: online, status: status, id_solicitud: id_solicitud};
  var nuevo = {id_usuario: usuario, chatUsers: [nuevoaviso]};
  var largoMaximoAvisos = 9;

  Aviso.find({'id_usuario': usuario},function(err, avisos){


    //Si no existen avisos para el ususario
    //---------------------------------------------------------------------------------//
    if (avisos.length === 0) {
      Aviso.create(nuevo, function(err, respuesta){
        if (respuesta !== null) {
          Aviso.find({'id_usuario': usuario},function(err, avisos1){
            if (avisos1 === null) {
              resp.send(null);
            }else{
              resp.send(avisos1);
            }
          })
        }
      });

    }
    //---------------------------------------------------------------------------------//
    //Si los avisos son 15
    //---------------------------------------------------------------------------------//
    else if(avisos[0].chatUsers.length >= largoMaximoAvisos) {
      Aviso.find({'id_usuario': usuario},function(err, avisos){
        if (avisos === null) {
          resp.send(null);
        }
        else{
          var lista = avisos[0].chatUsers;
          var nuevoaviso = {name: name, id: id, online: online, status: status, id_solicitud: id_solicitud};
          lista.splice(0,1);
          lista.push(nuevoaviso);

          Aviso.update( {id_usuario: usuario},
            {$set:{id_usuario: usuario , chatUsers : lista}},
            function(err, aviso) {
              if (aviso === null) {
              }else{
                Aviso.find({'id_usuario': usuario},function(err, avisos2){
                  if (avisos2 === null) {
                    resp.send(null);
                  }else{
                    resp.send(avisos2);
                  }
                })
              }
            });
          }
        })
      }
      //---------------------------------------------------------------------------------//
      //Si ya posee avisos
      //---------------------------------------------------------------------------------//
      else{
        Aviso.find({'id_usuario': usuario},function(err, avisos){
          if (avisos === null) {
            resp.send(null);
          }
          else{
            var lista = avisos[0].chatUsers;
            var nuevoaviso = {name: name, id: id, online: online, status: status, id_solicitud: id_solicitud};
            lista.push(nuevoaviso);

            Aviso.update( {id_usuario: usuario},
              {$set:{id_usuario: usuario , chatUsers : lista}},
              function(err, aviso) {
                if (aviso === null) {
                  resp.send(null);
                }else{
                  Aviso.find({'id_usuario': usuario},function(err, avisos2){
                    if (avisos2 === null) {
                      resp.send(null);
                    }else{
                      resp.send(avisos2);
                    }
                  })
                }
              });
            }
          })
        }
        //---------------------------------------------------------------------------------//

      })
    }
    //----------------------------------------------------------------------------------//


    //Metodo que trae de base de datos los avisos filtradas por id_usuario.
    //-----------------------------------------------------//
    exports.listarAvisosFiltro = function(req, resp){
      var usuario = req.params.id_usuario;
      Aviso.find({'id_usuario': usuario},function(err, avisos){
        if (avisos === null) {
          resp.send(null);
        }else{
          resp.send(avisos);
        }
      })
    }
    //-----------------------------------------------------//
