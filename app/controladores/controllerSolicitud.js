var Solicitud = require('../modelo/solicitud');
var Proceso = require('../modelo/proceso');

//Metodo que guarda en base de datos las solicitudes y sus lotes asociados.
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
exports.crearSolicitud = function(req, resp){
  var id_solicitud = req.body.id_solicitud;
  var id_solicitud_cliente = req.body.id_solicitud_cliente;
  var cliente = req.body.cliente;
  var fecha_creacion = req.body.fecha_creacion;
  var fecha_muestreo = req.body.fecha_muestreo;
  var fecha_planificacion = req.body.fecha_planificacion;
  var estado = req.body.estado;
  var lote = req.body.lote;
  var proceso = req.body.proceso;
  var tipoMuestreo = req.body.tipoMuestreo;
  var casino = req.body.casino;

  var nuevaSolicitud = {'id_solicitud': id_solicitud, 'id_solicitud_cliente': id_solicitud_cliente, 'cliente': cliente, 'casino': casino ,'fecha_creacion': fecha_creacion, 'fecha_muestreo': fecha_muestreo, fecha_planificacion: fecha_planificacion, 'estado': estado, 'lote': lote, 'proceso': proceso, 'tipoMuestreo': tipoMuestreo};
  Solicitud.create(nuevaSolicitud, function(err, respuesta){
    if (respuesta !== null) {
      resp.send(respuesta);
    }
  });
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//


//funcion que modifica un lote
//-----------------------------------------------------//
exports.modificaLoteUnicoAceptacion = function(req, resp){
  var id_solicitud = req.body.id_solicitud;
  var id_lote = req.body.id_lote;
  var fecha = new Date();

  Solicitud.update( {$and:[{id_solicitud: id_solicitud},{'lote.id_lote': id_lote}]}, {$set:{'lote.$.fecha_aceptacion': fecha}},
    function(err, solicitud) {
      if (solicitud !== null) {
        Solicitud.find(function(err, respuesta){
          if (respuesta === null) {
            resp.send(null);
          }else{
            resp.send(respuesta);
          }
        })
      }
    })
  }


  exports.modificaLoteUnicoListoTransporte = function(req, resp){
    var id_solicitud = req.body.id_solicitud;
    var id_lote = req.body.id_lote;
    var fecha = new Date();

    Solicitud.update( {$and:[{id_solicitud: id_solicitud},{'lote.id_lote': id_lote}]}, {$set:{'lote.$.fecha_listo_transporte': fecha}},
      function(err, solicitud) {
        if (solicitud !== null) {
          Solicitud.find(function(err, respuesta){
            if (respuesta === null) {
              resp.send(null);
            }else{
              resp.send(respuesta);
            }
          })
        }
      })
    }


    exports.modificaLoteUnicoDespacho = function(req, resp){
      var id_solicitud = req.body.id_solicitud;
      var id_lote = req.body.id_lote;
      var fecha = new Date();

      Solicitud.update( {$and:[{id_solicitud: id_solicitud},{'lote.id_lote': id_lote}]}, {$set:{'lote.$.fecha_despacho': fecha}},
        function(err, solicitud) {
          if (solicitud !== null) {
            Solicitud.find(function(err, respuesta){
              if (respuesta === null) {
                resp.send(null);
              }else{
                resp.send(respuesta);
              }
            })
          }
        })
      }



      exports.modificaLoteUnicoRecepcion = function(req, resp){
        var id_solicitud = req.body.id_solicitud;
        var id_lote = req.body.id_lote;
        var fecha = new Date();

        Solicitud.update( {$and:[{id_solicitud: id_solicitud},{'lote.id_lote': id_lote}]}, {$set:{'lote.$.fecha_recepcion': fecha}},
          function(err, solicitud) {
            if (solicitud !== null) {
              Solicitud.find(function(err, respuesta){
                if (respuesta === null) {
                  resp.send(null);
                }else{
                  resp.send(respuesta);
                }
              })
            }
          })
        }



        exports.modificaLoteUnicoFinalizado = function(req, resp){
          var id_solicitud = req.body.id_solicitud;
          var id_lote = req.body.id_lote;
          var fecha = new Date();

          Solicitud.update( {$and:[{id_solicitud: id_solicitud},{'lote.id_lote': id_lote}]}, {$set:{'lote.$.fecha_finalizado': fecha}},
            function(err, solicitud) {
              if (solicitud !== null) {
                Solicitud.find(function(err, respuesta){
                  if (respuesta === null) {
                    resp.send(null);
                  }else{
                    resp.send(respuesta);
                  }
                })
              }
            })
          }

//-----------------------------------------------------//



//Metodo que trae de base de datos todas las solicitudes.
//-----------------------------------------------------//
exports.traerSolicitudes = function(req, resp){
  Solicitud.find(function(err, solicitudes){
    if (solicitudes === null) {
      resp.send(null);
    }else{
      resp.send(solicitudes);
    }
  })
}
//-----------------------------------------------------//


//Metodo que trae de base de datos todas las solicitudes ,filtradas por tipo de Cliente (animal).
//-----------------------------------------------------//
exports.traerSolicitudesFiltroTipoAnimal = function(req, resp){
  Solicitud.find({$and: [ {'id_orden_trabajo': null}, { $or : [ { 'tipoMuestreo.id_muestreo': 1 }, { 'tipoMuestreo.id_muestreo' : 7 }, {'tipoMuestreo.id_muestreo': 8} ] } ]},function(err, solicitudes){
    if (solicitudes === null) {
      resp.send(null);
    }else{
      resp.send(solicitudes);
    }
  })
}
//-----------------------------------------------------//

//Metodo que trae de base de datos todas las solicitudes ,filtradas por tipo de Cliente (food).
//-----------------------------------------------------//
exports.traerSolicitudesFiltroTipoFood = function(req, resp){
  Solicitud.find({$and: [ {'id_orden_trabajo': null}, { $or : [ { 'tipoMuestreo.id_muestreo': 2 }, { 'tipoMuestreo.id_muestreo' : 3 }, {'tipoMuestreo.id_muestreo': 4}, {'tipoMuestreo.id_muestreo': 5}, {'tipoMuestreo.id_muestreo': 6} ] } ]},function(err, solicitudes){
    if (solicitudes === null) {
      resp.send(null);
    }else{
      resp.send(solicitudes);
    }
  })
}
//-----------------------------------------------------//


//Metodo que trae de base de datos todas las Ordenes de Trabajo ,filtradas por tipo de Cliente (animal).
//-----------------------------------------------------//
exports.traerOTFiltroTipoAnimal = function(req, resp){
  Solicitud.find({$and: [ {'id_orden_trabajo':{$ne:null}}, {'proceso.id_proceso': {$nin:[15]}}, { $or : [ { 'tipoMuestreo.id_muestreo': 1 }, { 'tipoMuestreo.id_muestreo' : 7 }, {'tipoMuestreo.id_muestreo': 8} ] } ]},function(err, solicitudes){
    if (solicitudes === null) {
      resp.send(null);
    }else{
      resp.send(solicitudes);
    }
  })
}
//-----------------------------------------------------//

//Metodo que trae de base de datos todas las Ordenes de Trabajo ,filtradas por tipo de Cliente (food).
//-----------------------------------------------------//
exports.traerOTFiltroTipoFood = function(req, resp){
  Solicitud.find({$and: [{'id_orden_trabajo':{$ne:null}}, {'proceso.id_proceso': {$nin:[15]}}, { $or : [ { 'tipoMuestreo.id_muestreo': 2 }, { 'tipoMuestreo.id_muestreo' : 3 }, {'tipoMuestreo.id_muestreo': 4}, {'tipoMuestreo.id_muestreo': 5}, {'tipoMuestreo.id_muestreo': 6} ] } ]},function(err, solicitudes){
    if (solicitudes === null) {
      resp.send(null);
    }else{
      resp.send(solicitudes);
    }
  })
}
//-----------------------------------------------------//


//Metodo que trae de base de datos todas las solicitudes.
//-----------------------------------------------------//
exports.traerSolicitudesClienteLote = function(req, resp){
  var cont = 0;
  Solicitud.find({$and: [{'cliente.id_usuario': req.params.id_usuario},{'tipoMuestreo.id_muestreo': 1}]}, function(err, response){
    for (var i = 0; i < response.length; i++) {
      cont = cont + response[i].lote.length;
    }
    resp.send(cont);
  });

}
//-----------------------------------------------------//



//Metodo que trae de base de datos una solicitud.
//-----------------------------------------------------//
exports.traerSolicitud = function(req, resp){
  Solicitud.find({id_solicitud: req.params.id_solicitud},function(err, solicitudes){
    if (solicitudes === null) {
      resp.send(null);
    }else{
      resp.send(solicitudes);
    }
  })
}
//-----------------------------------------------------//


//Metodo que trae de base de datos las solicitudes filtradas por cliente.
//-----------------------------------------------------//
exports.traerSolicitudesFiltro = function(req, resp){
  var id = req.params.id_usuario;
  Solicitud.find({'cliente.id_usuario': id},function(err, solicitudes){
    if (solicitudes === null) {
      resp.send(null);
    }else{
      resp.send(solicitudes);
    }
  })
}
//-----------------------------------------------------//

//Metodo que trae de base de datos las solicitudes filtradas por laboratorio.
//-----------------------------------------------------//
exports.traerSolicitudesFiltroLab = function(req, resp){
  var id = req.params.id_usuario;
  Solicitud.find({$and:[{laboratorio: id},{'lote.inspectorEnvia': true}]},function(err, solicitudes){
    if (solicitudes === null) {
      resp.send(null);
    }else{
      resp.send(solicitudes);
    }
  })
}
//-----------------------------------------------------//

//Metodo que trae de base de datos las solicitudes filtradas por solicitudes sin asignar.
//-----------------------------------------------------//
exports.traerSolicitudesSinOT = function(req, resp){
  Solicitud.find({'id_orden_trabajo': null},function(err, solicitudes){
    if (solicitudes === null) {
      resp.send(null);
    }else{
      resp.send(solicitudes);
    }
  }).sort({id_solicitud: 1})
}
//-----------------------------------------------------//


//Metodo que trae de base de datos las solicitudes filtradas por solicitudes asignadas.
//-----------------------------------------------------//
exports.traerSolicitudesOT = function(req, resp){

  Solicitud.find({$and:[{'id_orden_trabajo':{$ne:null}}, {'proceso.id_proceso': {$nin:[15]}}]},function(err, solicitudes){
    if (solicitudes === null) {
      resp.send(null);
    }else{
      resp.send(solicitudes);
    }
  }).sort({id_orden_trabajo:1});

}
//-----------------------------------------------------//


//Metodo que trae de base de datos las solicitudes filtradas por inspector.
//-----------------------------------------------------//
exports.traerSolicitudesFiltroInspector = function(req, resp){
  var id = req.params.id_usuario;
  Solicitud.find({$and:[{'proceso.id_p roceso': {$nin:[15]}} ,{inspector: id}]},function(err, solicitudes){
    if (solicitudes === null) {
      resp.send(null);
    }else{
      resp.send(solicitudes);
    }
  }).sort({id_orden_trabajo:1})

}
//-----------------------------------------------------//
//Metodo que trae de base de datos las solicitudes filtradas por laboratorio.
//-----------------------------------------------------//
exports.traerSolicitudesFiltroLaboratorio = function(req, resp){
  var id = 8;
  Solicitud.find({'proceso.id_proceso': id },function(err, solicitudes){
    if (solicitudes === null) {
      resp.send(null);
    }else{
      resp.send(solicitudes);
    }
  }).sort({id_orden_trabajo: 1})
}
//-----------------------------------------------------//


//Metodo para eliminar una solicitud.
//-----------------------------------------------------------------------------------//
exports.eliminaSolicitud = function(req, resp){
  var id_usuario = req.body.id_usuario;
  Solicitud.remove({id_solicitud: req.params.id_solicitud},function(err, respuesta){
    if (respuesta !== null) {
      Solicitud.find({'cliente.id_usuario': id_usuario}, function(err, solicitudes){
        if (solicitudes !== null) {
          resp.send(solicitudes);
        }
      })
    }
  })
}
//-----------------------------------------------------------------------------------//


//Metodo para eliminar una solicitud.
//-----------------------------------------------------------------------------------//
exports.eliminaSolicitudSinCliente = function(req, resp){
  Solicitud.remove({id_solicitud: req.params.id_solicitud},function(err, respuesta){
  })
}
//-----------------------------------------------------------------------------------//



//Metodo para añadir mensajes a la solicitud.
//-------------------------------------------------------------------------------------------------------------------------------------//
exports.modificaSolicitud = function(req, resp){
  Solicitud.update( {id_solicitud: req.params.id_solicitud},
    {$set:{id_orden_trabajo: req.body.id_orden_trabajo, estado: req.body.estado , proceso: req.body.proceso, inspector: req.body.inspector, laboratorio: req.body.laboratorio ,fecha_planificacion: req.body.fecha_planificacion}},
    function(err, solicitud) {
      if (solicitud !== null) {
        Solicitud.find(function(err, respuesta){
          if (respuesta === null) {
            resp.send(null);
          }else{
            resp.send(respuesta);
          }
        })
      }
    })
  }


  exports.modificaMensajesSolicitud = function(req, resp){
    Solicitud.update( {id_solicitud: req.params.id_solicitud},
      {$set:{mensaje: req.body.mensaje}},
      function(err, solicitud) {
        if (solicitud !== null) {
          Solicitud.find(function(err, respuesta){
            if (respuesta === null) {
              resp.send(null);
            }else{
              resp.send(respuesta);
            }
          })
        }
      })
    }

    exports.modificarFechaSolicitud = function(req, resp){

      Solicitud.update({id_solicitud: req.params.id_solicitud}, {$set:{'fecha_muestreo': new Date(req.body.fecha_muestreo)}}, function(err, respuesta){
        resp.send(null);
      });

    }

    exports.modificaSolicitudLab = function(req, resp){
      Solicitud.update( {id_solicitud: req.params.id_solicitud},
        {$set:{proceso: req.body.proceso, estado: 'Finalizado'}},
        function(err, solicitud) {
          if (solicitud !== null) {
            Solicitud.find(function(err, respuesta){
              if (respuesta === null) {
                resp.send(null);
              }else{
                resp.send(respuesta);
              }
            })
          }
        })
      }


      exports.modificaSolicitudEncargado = function(req, resp){
        Solicitud.update( {id_solicitud: req.params.id_solicitud},
          {$set:{encargado: req.body.encargado}},
          function(err, solicitud) {
            if (solicitud !== null) {
              Solicitud.find(function(err, respuesta){
                if (respuesta === null) {
                  resp.send(null);
                }else{
                  resp.send(respuesta);
                }
              })
            }
          })
        }


        exports.modificaSolicitudEvidencia = function(req, resp){
          Solicitud.update( {id_solicitud: req.params.id_solicitud},
            {$set:{evidencia: req.body.evidencia}},
            function(err, solicitud) {
              if (solicitud !== null) {
                resp.send(null)
              }
            })
          }

          exports.modificaSolicitudCertificado = function(req, resp){
            Solicitud.update( {id_solicitud: req.params.id_solicitud},
              {$set:{certificado: req.body.certificado}},
              function(err, solicitud) {
                if (solicitud !== null) {
                  resp.send(null)
                }
              })
            }


            exports.modificaProceso = function(req, resp){
              var id_solicitud = req.body.id_solicitud;
              var proceso = req.body.proceso;
              Solicitud.update( {id_solicitud: id_solicitud},
                      {$set:{proceso: req.body.proceso}},
                      function(err, solicitud) {
                        if (solicitud !== null) {
                          resp.send(null)
                        }
                  })
              }



              exports.modificaLoteCompleto = function(req, resp){
                var id_solicitud = req.body.id_solicitud;
                var lote = req.body.lote;
                Solicitud.update( {id_solicitud: id_solicitud},
                        {$set:{lote: lote}},
                        function(err, solicitud) {
                          if (solicitud !== null) {
                            resp.send(null)
                          }
                    })
                }



            //------------------------------------------------------------------------------------------------------------------------------------//


            // Metodos que filtran por proceso las solicitudes
            //------------------------------------------------------------------------------------------------------------------------------------//

            exports.filtroListar = function(req, resp){

              var id_proceso = req.params.id_proceso;
              var id_inspector = req.body.id_inspector;

              if (id_proceso != 0) {
                Solicitud.find({$and:[{'proceso.id_proceso': id_proceso}, {inspector: id_inspector}]}, function(err, solicitudes){
                  if (solicitudes != null) {
                    resp.send(solicitudes);
                  }
                })

              }else{
                Solicitud.find({$and:[{'proceso.id_proceso': {$nin:[15]}}, {inspector: id_inspector}]}, function(err, solicitudes){
                  if (solicitudes != null) {
                    resp.send(solicitudes);
                  }
                })

              }

            }

            exports.filtroListarAdministrador = function(req, resp){

              var id_proceso = req.params.id_proceso;

              if (id_proceso != 0) {
                Solicitud.find({'proceso.id_proceso': id_proceso}, function(err, solicitudes){
                  if (solicitudes != null) {
                    resp.send(solicitudes);
                  }
                })

              }else{
                Solicitud.find({$and:[{'proceso.id_proceso': {$nin:[15]}}]}, function(err, solicitudes){
                  if (solicitudes != null) {
                    resp.send(solicitudes);
                  }
                })

              }

            }

            exports.modificaSolicitudArchivo = function(req, resp){

              var nombre = req.body.nombreArchivo;
              var id_solicitud = req.params.id_solicitud;


              Solicitud.update({id_solicitud: id_solicitud}, {$pull:{'evidencia': {nombre: nombre}}}, function(err, solicitud){
                if (err) {
                  resp.send(null);
                }else{

                  Solicitud.findOne({id_solicitud: id_solicitud}, function(err, solicitud){
                    if (solicitud !== null) {
                      resp.send(solicitud);
                    }else{
                      resp.send(null);
                    }
                  });

                }


              });

            };

            exports.eliminaPdfSolicitud = function(req, resp){

              var nombre = req.body.nombre;
              var id_solicitud = req.body.id_solicitud;
              var id_lote = req.body.id_lote;

              Solicitud.update({$and:[{id_solicitud: id_solicitud},{'lote.id_lote': id_lote}]}, {$set:{'lote.$.certificado': undefined, 'lote.$.estadoDoc': undefined}}, function(err, solicitud){
                if (err !== null) {
                  resp.send(null);
                }else{
                  var id = 8;
                  Solicitud.find({'proceso.id_proceso': id },function(err, solicitudes){
                    if (solicitudes === null) {
                      resp.send(null);
                    }else{
                      resp.send(solicitudes);
                    }
                  }).sort({id_orden_trabajo: 1})
                }
              });
            }

            exports.aprobarLotes = function(req, resp){

              var id_solicitud = req.params.id_solicitud;
              var lotes = req.body.lotes;
              Solicitud.update({id_solicitud: id_solicitud}, {$set:{lote: req.body.lotes}}, function(err, lotes){
                if (lotes !== null) {
                  var id = 8;
                  Solicitud.find({'proceso.id_proceso': id },function(err, solicitudes){
                    if (solicitudes === null) {
                      resp.send(null);
                    }else{
                      resp.send(solicitudes);
                    }
                  }).sort({id_orden_trabajo: 1})
                }else{
                  resp.send(null);
                }
              });

            }
