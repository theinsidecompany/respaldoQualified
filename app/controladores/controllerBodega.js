var Bodega = require('../modelo/bodega');

//Metodo que guarda en base de datos los traders.
//----------------------------------------------------------------------------------//
exports.crearBodega = function(req, resp){
  var nombreBodega = req.body.nombreBodega;
  Bodega.find(function(err, bodega){
    if (bodega.length === 0) {
      var id_bodega = 1;
    }else {
      for (var i = 0; i < bodega.length; i++) {
        var id_bodega = bodega[i].id_bodega + 1;
      }
    }
    Bodega.find({'nombreBodega': nombreBodega},function(err, respuesta){
      if (respuesta[0] === undefined) {
        var nuevo = {id_bodega: id_bodega, nombreBodega: nombreBodega};
        Bodega.create(nuevo, function(err, respu){
          if (respu !== null) {
            Bodega.find(function(err, respu){
              resp.send(respu);
            })
          }
        });
      }
      else{
        resp.send('1');
      }
    })
  });
}
//----------------------------------------------------------------------------------//


//Metodo que trae de base de datostodos los traders.
//----------------------------------------------------------------------------------//
exports.listarBodegas = function(req, resp){
  Bodega.find(function(err, bodegas){
    if (bodegas === null) {
      resp.send(null);
    }else{
      resp.send(bodegas);
    }
  })
}
//----------------------------------------------------------------------------------//


//Metodo para eliminar un trader.
//----------------------------------------------------------------------------------//
exports.eliminaBodega = function(req, resp){
  var id_bodega = req.body.id_bodega;
  Bodega.remove({'id_bodega': id_bodega},function(err, respuesta){
    if (respuesta === null) {
      resp.send(null);
    }else{
      Bodega.find(function(err, bodegas){
        if (bodegas === null) {
          resp.send(null);
        }else{
          resp.send(bodegas);
        }
      })
    }
  });
}
//----------------------------------------------------------------------------------//


// Modificamos un objeto trader
//----------------------------------------------------------------------------------//
exports.modificaBodega = function(req, resp){
  Bodega.find({'nombreBodega': req.body.nombreBodega}, function(err, respuesta){
    if (respuesta[0] === undefined) {
      Bodega.update( {'id_bodega': req.params.id_bodega}, {$set:{'nombreBodega': req.body.nombreBodega}}, function(err, bodega) {
          if (bodega === null) {
            resp.send(null);
          }else{
            Bodega.find(function(err, bodegas){
              if (bodegas === null) {
                resp.send(null);
              }else{
                resp.send(bodegas);
              }
            })
        }
        });
      }else {
        resp.send('1');
      }
    })
  }
  //----------------------------------------------------------------------------------//
