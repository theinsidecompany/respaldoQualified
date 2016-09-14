var MateriaPrima = require('../modelo/materiaPrima');

//Metodo que guarda en base de datos los traders.
//----------------------------------------------------------------------------------//
exports.crearMateriaPrima = function(req, resp){

    var nombreMateriaPrima = req.body.nombreMateriaPrima;
    var materia = req.body.materia;

    MateriaPrima.find(function(err, materiaPrima){
      if (materiaPrima.length === 0) {
          var id_materiaPrima = 1;
      }else {
        for (var i = 0; i < materiaPrima.length; i++) {
          var id_materiaPrima = materiaPrima[i].id_materiaPrima + 1;
        }
      }
      MateriaPrima.find({'nombreMateriaPrima': nombreMateriaPrima},function(err, lista){
        if (lista[0] === undefined) {
          var nuevo = {'id_materiaPrima': id_materiaPrima, 'id_materia': materia, 'nombreMateriaPrima': nombreMateriaPrima};
          MateriaPrima.create(nuevo, function(err, res){
            if (res !== null) {
              MateriaPrima.find(function(err, materias){
                if (materias === null) {
                    resp.send(null);
                }else{
                  resp.send(materias);
                }
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
exports.listarMateriaPrima = function(req, resp){
  var id_materia = req.params.id_materia;
  MateriaPrima.find({'id_materia': id_materia}, function(err, materiasPrimas){
    if (materiasPrimas === null) {
        resp.send(null);
    }else{
      resp.send(materiasPrimas);
    }
  })
}
//----------------------------------------------------------------------------------//


//Metodo para eliminar un trader.
//----------------------------------------------------------------------------------//
exports.eliminaMateriaPrima = function(req, resp){
  var id_materiaPrima = req.body.id_materiaPrima;
  MateriaPrima.remove({'id_materiaPrima': id_materiaPrima},function(err, respuesta){
    if (respuesta === null) {
        resp.send(null);
    }else{
      MateriaPrima.find(function(err, materias){
        if (materias === null) {
            resp.send(null);
        }else{
          resp.send(materias);
        }
      })
    }
  });
}
//----------------------------------------------------------------------------------//

// Modificamos un objeto trader
//----------------------------------------------------------------------------------//
exports.modificaMateriaPrima = function(req, resp){
  var nombreMateriaPrima = req.body.nombreMateriaPrima;
  var id_materiaPrima = req.body.id_materiaPrima;
  MateriaPrima.find({'nombreMateriaPrima': nombreMateriaPrima },function(err, respuesta){
      if (respuesta[0] === undefined) {
        MateriaPrima.update( {'id_materiaPrima': id_materiaPrima}, {$set:{'nombreMateriaPrima' : nombreMateriaPrima}},
                function(err, materiaPrima) {
                  if (materiaPrima === null) {
                      resp.send(null);
                  }else{
                    MateriaPrima.find(function(err, materias){
                      if (materias === null) {
                          resp.send(null);
                      }else{
                        resp.send(materias);
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


exports.buscarNombreMateriaPrima = function(req, resp){

  MateriaPrima.find({id_materiaPrima: req.params.materiaPrima}, function(err, materia){
    if (err) {
      resp.send(err)
    }else{
      resp.send(materia[0].nombreMateriaPrima);
    }

  });

}
