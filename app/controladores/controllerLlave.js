var Llave = require('../modelo/llave');

exports.traerLlaves = function(req, resp){

	Llave.find(function(err, Llave){
		if (Llave !== null) {
			resp.send(Llave);
		}

	});

};

exports.traerLlave = function(req, resp){

  var id_llave = req.params.id_llave;
  Llave.findOne({id_llave: id_llave}, function(err, llave){
      if (llave !== null) {
          resp.send(llave);
      }
  })

}
