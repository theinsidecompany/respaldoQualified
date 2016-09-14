var TipoMuestreo = require('../modelo/tipoMuestreo');
var AlimentosRsa = require('../modelo/alimentosRsa');
var SubAlimentoRsa = require('../modelo/subTipoAlimentosRsa');
var AnalisisSubAlimento = require('../modelo/analisisSubAlimentoRSA');
var TipoAnalisis = require('../modelo/tipoAnalisis');
var SubAnalisis = require('../modelo/subAnalisis');
var Conserva = require('../modelo/tipoConserva');



exports.listarTipoMuestreo = function(req, resp){
  TipoMuestreo.find(function(err, listarTipoMuestreo){
    if (listarTipoMuestreo === null) {
      resp.send(null);
    }else{
      resp.send(listarTipoMuestreo);
    }
  });
}


exports.listarTipoAnalisis = function(req, resp){
  var id_tipoMuestreo = req.params.id_tipoMuestreo;
  TipoAnalisis.find({'id_tipoMuestreo': id_tipoMuestreo}, function(err, resultado){
    if (resultado === null) {
      resp.send(null);
    }else{
      resp.send(resultado);
    }
  });
}


exports.listarSubAnalisis = function(req, resp){
  var id_tipoAnalisis = req.params.id_tipoAnalisis;
    SubAnalisis.find({'id_tipoAnalisis': id_tipoAnalisis}, function(err, respuesta){
      if(respuesta[0] === undefined){
        resp.send(null);
      }else {
        resp.send(respuesta);
      }
    })
}


exports.listarAlimentosRsa = function(req, resp){
    AlimentosRsa.find(function(err, respuesta){
      if(respuesta[0] === undefined){
        resp.send(null);
      }else {
        resp.send(respuesta);
      }
    })
}


exports.listarSubAlimentoRsa = function(req, resp){
  var id_tipoAlimento = req.params.id_tipoAlimento;
    SubAlimentoRsa.find({'id_tipoAlimento': id_tipoAlimento}, function(err, respuesta){
      if(respuesta[0] === undefined){
        resp.send(null);
      }else {
        resp.send(respuesta);
      }
    })
}


exports.listarAnalisisSubAlimento = function(req, resp){
  var id_subAlimento = req.params.id_subAlimento;
    AnalisisSubAlimento.find({'id_subAlimento': id_subAlimento}, function(err, respuesta){
      if(respuesta[0] === undefined){
        resp.send(null);
      }else {
        resp.send(respuesta);
      }
    })
}

exports.listarConserva = function(req, resp){
    Conserva.find(function(err, respuesta){
      if(respuesta[0] === undefined){
        resp.send(null);
      }else {
        resp.send(respuesta);
      }
    })
}
//Metodo que trae ltodos los registros de tipos de analisis de la mongodb
//-------------------------------------------------------------------------//
// exports.listarTipoAnalisis = function(req, resp){
//   TipoAnalisis.find(function(err, listarTipoAnalisis){
//     if (listarTipoAnalisis === null) {
//         resp.send(null);
//     }else{
//       resp.send(listarTipoAnalisis);
//     }
//   });
// }
//-------------------------------------------------------------------------//
//metodo que crea un nuevo documento de tipo de analisis en la mongodb
//-------------------------------------------------------------------------//
// exports.crearTipoAnalisis = function(req, resp){
//   var nombre = req.body.tipoAnalisis;
//   TipoAnalisis.find(function(err, lista){
//     if (lista.length === 0) {
//         var id_tipoAnalisis = 1;
//     }else {
//       for (var i = 0; i < lista.length; i++) {
//           var id_tipoAnalisis = lista[i].id_tipoAnalisis + 1;
//       }
//     }
//   var nuevo = {id_tipoAnalisis: id_tipoAnalisis, tipoAnalisis: nombre};
//   TipoAnalisis.create(nuevo, function(err, respuesta){
//     if (respuesta !== null) {
//       TipoAnalisis.find(function(err, listarTipoAnalisis){
//         if (listarTipoAnalisis === null) {
//             resp.send(null);
//         }else{
//           resp.send(listarTipoAnalisis);
//         }
//       });
//     }
//   });
// })
// }
//-------------------------------------------------------------------------//
//Metodo que elimina un documento de tipo analisis acorde a un id de la mongodb
//-------------------------------------------------------------------------//
// exports.eliminaTipoAnalisis = function(req, resp){
//   var id = req.params.id_tipoAnalisis;
//   TipoAnalisis.remove({id_tipoAnalisis: id},function(err, respuesta){
//       if (respuesta !== null) {
//         TipoAnalisis.find(function(err, listarTipoAnalisis){
//           if (listarTipoAnalisis === null) {
//               resp.send(null);
//           }else{
//             resp.send(listarTipoAnalisis);
//           }
//         });
//       }
//   });
// }
//-------------------------------------------------------------------------//
//Modifica un documento de tipo de analisis acorde a un id en la mongodb
//-------------------------------------------------------------------------//
// exports.modificaTipoAnalisis = function(req, resp){
//   var id = req.params.id_tipoAnalisis;
// 	TipoAnalisis.update( {id_tipoAnalisis: id},
// 					{$set:{tipoAnalisis : req.body.tipoAnalisis}},
// 					function(err, respuesta) {
// 						if (respuesta !== null){
//               TipoAnalisis.find(function(err, listarTipoAnalisis){
//                 if (listarTipoAnalisis === null) {
//                     resp.send(null);
//                 }else{
//                   resp.send(listarTipoAnalisis);
//                 }
//               });
//             }
// 			});
// 	}
//-------------------------------------------------------------------------//
