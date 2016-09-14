var Micro = require('../modelo/microbiologicoAgua');

exports.listarMicrobiologicoAgua = function(req, resp){
  Micro.find(function(err, lista){
    if (lista === null) {
      resp.send(null);
    }else{
      resp.send(lista);
    }
  });
}
