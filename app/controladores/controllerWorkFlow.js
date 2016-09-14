var WorkFlow = require('../modelo/workFlow');

//Metodo que guarda en base de datos los traders.
//----------------------------------------------------------------------------------//
exports.crearWorkFlow = function(req, resp){
    var id_perfil = req.body.id_perfil;
    var lista = req.body.workFlow;
    WorkFlow.find({'id_perfil': id_perfil},function(err, flows){
      if (flows === null) {
        WorkFlow.create({id_perfil: id_perfil, workFlow: lista}, function(err, resp){
        });
      }else{
        WorkFlow.remove({id_perfil: id_perfil}, function(err, respuesta){
          WorkFlow.create({id_perfil: id_perfil, workFlow: lista}, function(err, resp){
          });
        });
      }
    })
}
//----------------------------------------------------------------------------------//


//Metodo que trae de base de datostodos los traders.
//----------------------------------------------------------------------------------//
exports.listarWorkFlow = function(req, resp){
  var id = req.params.id_perfil;
  WorkFlow.find({'id_perfil': id},function(err, flows){
    if (flows === null) {
        resp.send(null);
    }else{
      resp.send(flows);
    }
  })
}
//----------------------------------------------------------------------------------//
