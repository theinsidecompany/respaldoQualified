var Proceso = require('../modelo/proceso');

exports.listarProcesos = function(req, resp){

  Proceso.find(function(err, procesos){

    if (procesos !== null) {

      resp.send(procesos);

    }

  });

}
