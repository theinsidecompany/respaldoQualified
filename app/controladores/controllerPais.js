var Pais = require('../modelo/pais');

//Metodo que guarda en base de datos los traders.
//----------------------------------------------------------------------------------//
exports.crearPais = function(req, resp){
  var nombrePais = req.body.nombrePais;
  Pais.find(function(err, pais){
    if (pais === null) {
      var id_pais = 1;
    }else {
      var id_pais = pais.length + 1;
    }


    Pais.find({'nombrePais': nombrePais},function(err, respuesta){
      if (respuesta[0] === undefined) {
        Pais.create({id_pais: id_pais, nombrePais: nombrePais}, function(err, respu){
          Pais.find(function(err,lista){
            resp.send(lista);
          })
        });
      }else{
        resp.send('1');
      }
    })
  });
}
//----------------------------------------------------------------------------------//


//Metodo que trae de base de datostodos los traders.
//----------------------------------------------------------------------------------//
exports.listarPaises = function(req, resp){
  Pais.find(function(err, paises){
    if (paises[0] === undefined) {
      resp.send(null);
    }else{
      resp.send(paises);
    }
  })
}
//----------------------------------------------------------------------------------//


//Metodo para eliminar un trader.
//----------------------------------------------------------------------------------//
exports.eliminaPais = function(req, resp){
  Pais.remove({id_pais: req.params.id_pais},function(err, respuesta){
    Pais.find(function(err, lista){
      resp.send(lista);
    })
  });
}
//----------------------------------------------------------------------------------//


// Modificamos un objeto trader
//----------------------------------------------------------------------------------//
exports.modificaPais = function(req, resp){
  Pais.find({nombrePais: req.body.nombrePais},function(err, respuesta){
    if (respuesta[0] === undefined) {
      Pais.update( {id_pais: req.params.id_pais},
        {$set:{nombrePais : req.body.nombrePais}},
        function(err, pais) {
          Pais.find(function(err, lista){
            resp.send(lista);
          })
        });
      }else {
        resp.send('1');
      }
    })
  }
  //----------------------------------------------------------------------------------//
