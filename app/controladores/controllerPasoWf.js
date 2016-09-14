var PasoWf = require('../modelo/pasoWf');

//Metodo que guarda en base de datos los traders.
//----------------------------------------------------------------------------------//
exports.crearPasoWf = function(req, resp){
  // var id = req.body.id;
  var nombrepaso = req.body.nombrepaso;
  PasoWf.find(function(err, paso){
    if (paso === null) {
        var id = 1;
    }else {
          var id = paso.length + 1;
    }
  PasoWf.create({id: id, paso: nombrepaso}, function(err, respuesta){
    if (respuesta !== null) {
      PasoWf.find(function(err, pasos){
        if (pasos === null) {
          resp.send(null);
        }else{
          resp.send(pasos);
        }
      })
    }
  })
})
}
//----------------------------------------------------------------------------------//


//Metodo que trae de base de datostodos los traders.
//----------------------------------------------------------------------------------//
exports.listarPasoWf = function(req, resp){
  PasoWf.find(function(err, flows){
    if (flows === null) {
      resp.send(null);
    }else{
      resp.send(flows);
    }
  })
}
//----------------------------------------------------------------------------------//


//Metodo para eliminar un trader.
//----------------------------------------------------------------------------------//
exports.eliminaPasoWf = function(req, resp){
  PasoWf.remove({id: req.params.id},function(err, respuesta){
    if (respuesta !== null) {
      PasoWf.find(function(err, flows){
        if (flows === null) {
          resp.send(null);
        }else{
          resp.send(flows);
        }
      })
    }
  });
}
//----------------------------------------------------------------------------------//

// Modificamos un objeto trader
//----------------------------------------------------------------------------------//
exports.modificaPasoWf = function(req, resp){
  PasoWf.update( {id: req.params.id},
          {$set:{paso : req.body.paso}},
          function(err, pasos) {
            if (err)
              res.send(err);
      });
  }
  //----------------------------------------------------------------------------------//
