var AnalisisNCH409 = require('../modelo/analisisNCH409');

exports.listarNCH409 = function(req, resp){
  AnalisisNCH409.find(function(err, lista){
    if (lista === null) {
      resp.send(null);
    }else{
      resp.send(lista);
    }
  });
}
