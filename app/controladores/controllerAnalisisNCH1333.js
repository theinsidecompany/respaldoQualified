var AnalisisNCH1333 = require('../modelo/analisisNCH1333');

exports.listarNCH1333 = function(req, resp){
  AnalisisNCH1333.find(function(err, lista){
    if (lista === null) {
      resp.send(null);
    }else{
      resp.send(lista);
    }
  });
}
