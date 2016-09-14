var Region = require('../modelo/region');


//Metodo que trae de base de datostodos las regiones de chile.
//----------------------------------------------------------------------------------//
exports.listarRegiones = function(req, resp){
  Region.find(function(err, regiones){
    if (regiones === null) {
        resp.send(null);
    }else{
      resp.send(regiones);
    }
  })
}
//----------------------------------------------------------------------------------//
