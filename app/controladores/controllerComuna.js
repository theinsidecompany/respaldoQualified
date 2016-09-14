var Comuna = require('../modelo/comuna');


exports.listarComunasFiltro = function(req, resp){
  var id = req.params.id_region;
  console.log(id);
  Comuna.find({'id_region': id},function(err, comunas){
    if (comunas === null) {
        resp.send(null);
    }else{
      resp.send(comunas);
    }
  })
}
