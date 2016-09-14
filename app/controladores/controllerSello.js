var Sello = require('../modelo/sello');

// Metodo que crea sellos
// --------------------------------------------------------------------------------------//
exports.crearSellos = function(req, resp){
  var numero  = req.body.numero;
  var usuario = undefined;
  var estado  = false;
  var usado   = false;

  Sello.find({$and: [{estado: false}, {usuario: undefined}]}, function(err, resul){
    if (resul[0] === undefined) {
      var nuevo = {numero: numero, usuario: usuario, estado: estado, usado: usado};
      Sello.create(nuevo, function(err, respuesta){
        resp.send('1');
      })
    }else {
      var viejo = resul[0].numero;
      var nuevo = viejo.concat(numero);
      Sello.update({$and: [{estado: false}, {usuario: undefined}]}, {$set:{numero: nuevo}}, function(err, respuesta){
        resp.send('1');
      })
    }
  })
}
// --------------------------------------------------------------------------------------//


//Metodo que trae todos los sellos de la base de datos
// --------------------------------------------------------------------------------------//
exports.listarSellos = function(req, resp){
  Sello.find({$and: [{estado: false}, {usuario: undefined}]}, function(err, resultado){
    if (resultado[0] === undefined) {
      resp.send(null);
    }else{
      resp.send(resultado);
    }
  })
}

exports.listarSellosBaja = function(req, resp){
  Sello.find({estado: true}, function(err, resultado){
    if (resultado[0] === undefined) {
      resp.send(null);
    }else{
      resp.send(resultado);
    }
  })
}
// // --------------------------------------------------------------------------------------//


//Metodo que trae los sellos correspondientes al usuario seleccionado
// --------------------------------------------------------------------------------------//
exports.listarSellosFiltro = function(req, resp){
  var usuario = req.params.id_usuario;
  Sello.find({$and: [{usuario: usuario}, {usado: false}]},function(err, respuesta){
    if (respuesta[0] === undefined) {
      resp.send(null);
    }else{
      resp.send(respuesta);
    }
  })
}

exports.listarSellosUsados = function(req, resp){
  var usuario = req.params.id_usuario;
  Sello.find({$and: [{usuario: usuario}, {usado: true}]},function(err, respuesta){
    if (respuesta[0] === undefined) {
      resp.send(null);
    }else{
      resp.send(respuesta);
    }
  })
}
// --------------------------------------------------------------------------------------//


//Metodo que modifica los campos de los sellos acorde a la accion solicitada
// --------------------------------------------------------------------------------------//
exports.modificaSelloBaja = function(req, resp){

  var numero = req.body.numero;

  Sello.find({$and: [{estado: false}, {usuario: undefined}]}, function(err, resul){
    var lista = resul[0].numero;
    var listaBaja = [];
    var listaAdmin  = [];
    for (var i = 0; i < lista.length; i++) {
      for (var j = 0; j < numero.length; j++) {
        if (lista[i] === numero[j]) {
          lista.splice(i, 1);
        }
      }
    }

    listaAdmin = lista;
    listaBaja = numero;

    Sello.update({$and: [{estado: false}, {usuario: undefined}]}, {$set:{numero: listaAdmin}}, function(err, respuesta){
    })

    Sello.find({$and: [{estado: true}]}, function(err, resultado){
      if (resultado[0] === undefined) {
        var nuevo = {numero: listaBaja, usuario: undefined, estado: true, usado: false};
        Sello.create(nuevo, function(err, respuesta){
        })
      }else {
        var viejo = resultado[0].numero;
        var nuevo = viejo.concat(listaBaja);
        Sello.update({$and: [{estado: true}, {usuario: undefined}]}, {$set:{numero: nuevo}}, function(err, respu){
        });
      }
    })
    resp.send('1');
  });

}

exports.modificaSelloBajaUsuario = function(req, resp){
  var numero = req.body.numero;
  var usuario = req.body.usuario;

  Sello.find({$and: [{estado: false}, {usuario: usuario}]}, function(err, resul){
    var lista = resul[0].numero;
    var listaBaja = [];
    var listaUsuario  = [];
    for (var i = 0; i < lista.length; i++) {
      for (var j = 0; j < numero.length; j++) {
        if (lista[i] === numero[j]) {
          lista.splice(i, 1);
        }
      }
    }

    listaUsuario = lista;
    listaBaja = numero;

    Sello.update({$and: [{estado: false}, {usuario: usuario}]}, {$set:{numero: listaUsuario}}, function(err, respuesta){
    })

    Sello.find({$and: [{estado: true}]}, function(err, resultado){
      if (resultado[0] === undefined) {
        var nuevo = {numero: listaBaja, usuario: undefined, estado: true, usado: false};
        Sello.create(nuevo, function(err, respuesta){
        })
      }else {
        var viejo = resultado[0].numero;
        var nuevo = viejo.concat(listaBaja);
        Sello.update({$and: [{estado: true}, {usado: false}]}, {$set:{numero: nuevo, estado: true, usado: false}}, function(err, respu){
        });
      }
    })
    resp.send('1');
  });
}

exports.modificaSelloUsuario = function(req, resp){

  var numero = req.body.numero;
  var usuario = req.body.usuario;
  Sello.find({$and: [{estado: false}, {usuario: undefined}]}, function(err, resul){
    var lista = resul[0].numero;
    var listaUsuario = [];
    var listaAdmin  = [];
    for (var i = 0; i < lista.length; i++) {
      for (var j = 0; j < numero.length; j++) {
        if (lista[i] === numero[j]) {
          lista.splice(i, 1);
        }
      }
    }

    listaAdmin = lista;
    listaUsuario = numero;

    Sello.update({$and: [{estado: false}, {usuario: undefined}]}, {$set:{numero: listaAdmin}}, function(err, respuesta){
    })

    Sello.find({$and: [{estado: false}, {usuario: usuario}]}, function(err, resultado){
      if (resultado[0] === undefined) {
        var nuevo = {numero: numero, usuario: usuario, estado: false, usado: false};
        Sello.create(nuevo, function(err, respuesta){
        })
      }else {

        var viejo = resultado[0].numero;
        var nuevo = viejo.concat(listaUsuario);
        Sello.update({usuario: usuario}, {$set:{numero: nuevo, usuario: usuario, estado: false, usado: false}}, function(err, respu){
        });
      }
    })
    resp.send('1');
  });
}


exports.modificaSelloUsado = function(req, resp){

  var numero = req.body.numero;
  var usuario = req.body.usuario;
  Sello.find({$and: [{usado: false}, {usuario: usuario}]}, function(err, resul){
    var lista = resul[0].numero;
    var listaUsado = [];
    var listaUsuario  = [];
    for (var i = 0; i < lista.length; i++) {
      for (var j = 0; j < numero.length; j++) {
        if (lista[i] === numero[j]) {
          lista.splice(i, 1);
        }
      }
    }

    listaUsuario = lista;
    listaUsado = numero;

    Sello.update({$and: [{usado: false}, {usuario: usuario}]}, {$set:{numero: listaUsuario}}, function(err, respuesta){
      if (err) {
          console.log(err);
          resp.send(null);
      }else{
        Sello.find({$and: [{usado: true}, {usuario: usuario}]}, function(err, resultado){
          if (err) {
            console.log(err);
            resp.send(null);
          }else{
            if (resultado[0] === undefined) {
              var nuevo = {numero: listaUsado, usuario: usuario, estado: false, usado: true};
              Sello.create(nuevo, function(err, respuesta){
              })
            }else {
              var viejo = resultado[0].numero;
              var nuevo = listaUsado;
              Sello.update({$and: [{usado: true}, {usuario: usuario}]}, {$set:{numero: nuevo, usuario: usuario, estado: false, usado: true}}, function(err, respu){
                if (err) {
                  console.log(err);
                  resp.send(null);
                }else{
                  resp.send('1');
                }
              });
            }
          }
        })
      }
    })
  });
}

exports.modificarSellosInspector = function(req, resp){

  var numero = req.body.numero;
  var usuario = req.body.usuario;
  var usados = req.body.usados;

    Sello.find({$and: [{usado: false}, {usuario: usuario}]}, function(err, resul){
      if (err) {
        console.log(err);
        resp.send(null);
      }else {

        Sello.update({$and:[{usado: false}, {usuario: usuario}]}, {$set:{numero: numero}},function(err, resultado){

          if (err) {
            console.log(err);
            resp.send(null);
          }else{

            Sello.find({$and: [{usado: true}, {usuario: usuario}]}, function(err, sello){

              if (err) {
               console.log(err);
               resp.send(null);
             }else{

               if (sello[0] === undefined) {
                   var nuevo = {numero: usados, usuario: usuario, estado: false, usado: true};
                   Sello.create(nuevo, function(err, nuevoSello){
                     if (err) {
                       console.log(err);
                       resp.send(null);
                     }else{
                       resp.send(nuevoSello);
                     }
                   });
               }else{

                 var vieja = sello[0].numero.concat(usados);
                 Sello.update({$and: [{usado: true}, {usuario: usuario}]}, {$set:{numero: vieja}}, function(err, nuevo){
                   if (err) {
                     console.log(err);
                     resp.send(null);
                   }else{
                     resp.send('1');
                   }
                 });

               }

             }

            });

          }

        });
      }
    });
}


// --------------------------------------------------------------------------------------//
