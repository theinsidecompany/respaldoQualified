var SeleccionMuestreo = require('../modelo/seleccionMuestreo');


//Metodo que trae de base de datostodos las regiones de chile.
//----------------------------------------------------------------------------------//
exports.listarSeleccion = function(req, resp){
  SeleccionMuestreo.find(function(err, resultado){
    if (resultado === null) {
        resp.send(null);
    }else{
      resp.send(resultado);
    }
  })
}
//----------------------------------------------------------------------------------//
