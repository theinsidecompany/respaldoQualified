app.controller('busquedaController', ['$scope', '$rootScope', '$http' ,'$notify', '$timeout', '$sce',function ($scope, $rootScope, $http , $notify, $timeout, $sce) {

  traerAvisosFiltro();
  listarProcesos();

  //Funcion que carga la lista de avisos del usuario
  //-----------------------------------------------------------------------------------//
  function traerAvisosFiltro(){
    $rootScope.chatUsers = [];
    var id_usuario = $rootScope.loggedUser.id_usuario;

    $http.get('/api/avisos/' + id_usuario).success(function(response){
      if (response[0] === undefined) {
      }else {
        for (var i = 0; i < response[0].chatUsers.length; i++) {
          $rootScope.chatUsers.splice(0, 0, response[0].chatUsers[i]);
        }
      }
    })
  }
  //-----------------------------------------------------------------------------------//


  //Metodo para desplegar accesos rapidos en modal vista
  //-----------------------------------------------------------------------------------//
  $scope.muestraInspector = false;
  $scope.muestraRechaza = false;
  $scope.seleccionFlujo = function(seleccion){

    if (seleccion === 3) {
      $scope.muestraInspector = true;
      $scope.muestraRechaza = false;
    }else if (seleccion === 2) {
      $scope.muestraRechaza = true;
      $scope.muestraInspector = false;
    }
  }
  //-----------------------------------------------------------------------------------//
  //Metodo que trae las observaciones por solicitud
  //----------------------------------------------------------------------------------//

  function listarObservacion(sol){
    var id_solicitud = sol.id_solicitud;
    $http.get('/api/observacion/' + id_solicitud).success(function(response){
      if (response[0] !== undefined) {
        var nuevo = response[0];
        $scope.observacion = nuevo.observacion;
        $scope.muestraObservacion = true;
        $scope.muestraDatos = false;
      }else{
        $scope.muestraObservacion = false;
        $scope.muestraDatos = true;
      }
    })

  }

  //----------------------------------------------------------------------------------//


  //Funcion que trae todas las solicitudes de la base de datos.
  //-----------------------------------------------------------------------------------//
  $scope.AsignarInspector = function(fecha_planificacion, modalSol , inspector, laboratorio){
    var laboratorio = laboratorio.id_usuario;
    var id_inspector = inspector.id_usuario;
    var fecha_planificacion = fecha_planificacion;
    var listaEstados = [];
    fechaActual = new Date();
    var lote = modalSol.lote;

    for (var i = 0; i < lote.length; i++) {
      lote[i].fecha_planificacion = fecha_planificacion;
    }

    if (fecha_planificacion <= fechaActual) {
      $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
      $notify.setPosition('bottom-left');
      $notify.info('Notificacion', 'Fecha planificacion no valida');
    }else {
      if (modalSol.id_orden_trabajo === undefined || modalSol.id_orden_trabajo === null) {
        var identificador = {id: 'ordenTrabajo'};
        $http.post('/api/contador2', identificador).success(function(response){
          var nuevo = [{"id_proceso" : 4, "descripcion" : "Inspeccion Asignada", "color" : "819FF7", "icono" : "search", "visible" : true}];
          $http.put('/api/solicitud/' + modalSol.id_solicitud, {'id_orden_trabajo': response.seq, 'estado': 'En proceso' , 'proceso': nuevo, 'inspector': id_inspector, 'laboratorio': laboratorio, 'fecha_planificacion': fecha_planificacion}).success(function(respuesta){
            $http.get('/api/noasignada').success(function(salida){
              for (var i = 0; i < salida.length; i++) {
                var fechaPlanificacion = new Date(salida[i].fecha_muestreo);
                if (fechaPlanificacion >= fechaActual) {
                  listaEstados.push({solicitud: salida[i], estado: 'En proceso'});
                }
                if (fechaPlanificacion < fechaActual) {
                  listaEstados.push({solicitud: salida[i], estado: 'Atrasada'});
                }
              }
              $scope.solicitudes = listaEstados;
            });
          });

          $http.put('/api/solicitudEncargado/' + modalSol.id_solicitud, {encargado: inspector.nombre}).success(function(resultado){
          });

          var loteAux = {id_solicitud: modalSol.id_solicitud, lote: lote};
          $http.post('/api/modificaLoteCompleto', loteAux).success(function(lotesRespuesta){});

          var aviso2 = {usuario: 1, name: 'Orden de Trabajo', id: response.seq, online: 'inspectorAsignado', status: 'fa-male ', id_solicitud: modalSol.id_solicitud};
          $http.post('/api/avisos', aviso2).success(function(respu){
          })
          var aviso3 = {usuario: id_inspector, name: 'Orden de Trabajo', id: response.seq, online: 'InspeccionAsignada', status: 'fa-male ', id_solicitud: modalSol.id_solicitud};
          $http.post('/api/avisos', aviso3).success(function(respu){
          })

        });
      }else {
        var identificador = {id: 'ordenTrabajo'};
        var nuevo = [{"id_proceso" : 4, "descripcion" : "Inspeccion Asignada", "color" : "819FF7", "icono" : "search", "visible" : true}];
        $http.put('/api/solicitud/' + modalSol.id_solicitud, {'id_orden_trabajo': modalSol.id_orden_trabajo, 'estado': 'En proceso' , 'proceso': nuevo, 'inspector': id_inspector, 'laboratorio': laboratorio, 'fecha_planificacion': fecha_planificacion}).success(function(respuesta){
          $http.get('/api/noasignada').success(function(salida){
            for (var i = 0; i < salida.length; i++) {
              var fechaPlanificacion = new Date(salida[i].fecha_muestreo);
              if (fechaPlanificacion >= fechaActual) {
                listaEstados.push({solicitud: salida[i], estado: 'En proceso'});
              }
              if (fechaPlanificacion < fechaActual) {
                listaEstados.push({solicitud: salida[i], estado: 'Atrasada'});
              }
            }
            $scope.solicitudes = listaEstados;
          });

          var loteAux = {id_solicitud: modalSol.id_solicitud, lote: lote};
          $http.post('/api/modificaLoteCompleto', loteAux).success(function(lotesRespuesta){});

          $http.put('/api/solicitudEncargado/' + modalSol.id_solicitud, {encargado: inspector.nombre}).success(function(resultado){
          });

          var aviso2 = {usuario: 1, name: 'Orden de Trabajo', id: modalSol.id_orden_trabajo, online: 'inspectorAsignado', status: 'fa-male ', id_solicitud: modalSol.id_solicitud};
          $http.post('/api/avisos', aviso2).success(function(respu){
          })
          var aviso3 = {usuario: id_inspector, name: 'Orden de Trabajo', id: modalSol.id_orden_trabajo, online: 'InspeccionAsignada', status: 'fa-male ', id_solicitud: modalSol.id_solicitud};
          $http.post('/api/avisos', aviso3).success(function(respu){
          })

        });
      }

      $scope.muestraInspector = false;
      $scope.muestraRechaza = false;
      $timeout(function() {
        listarSolicitudes();
      }, 500);
      $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
      $notify.setPosition('bottom-left');
      $notify.success('Notificacion', 'Inspector Asignado');
    }
  };
  //-----------------------------------------------------------------------------------//


  //Funcion cancela una solicitud de la base de datos.
  //-----------------------------------------------------------------------------------//
  $scope.rechazaSolicitud = function(modalSol){
    var id_inspector = modalSol.inspector;
    var id_orden_trabajo = modalSol.id_orden_trabajo;
    var listaEstados = [];
    fechaActual = new Date();
    var nuevo = [{"id_proceso" : 2, "descripcion" : "Solicitud Rechazada", "color" : "FF0000", "icono" : "ban", "visible" : true}];
    if (modalSol.inspector === undefined) {
      var contenido ={id_orden_trabajo: '', estado: 'En aprobacion', proceso: nuevo, inspector: '', laboratorio: '',fecha_planificacion: ''};
    }else{
      var contenido = {id_orden_trabajo: id_orden_trabajo, estado: 'En aprobacion', proceso: nuevo, inspector: id_inspector, laboratorio: '',fecha_planificacion: ''};
    }
    $http.put('/api/solicitud/' + modalSol.id_solicitud, contenido).success(function(response){
      $http.get('/api/noasignada').success(function(response){
        for (var i = 0; i < response.length; i++) {
          var fechaPlanificacion = new Date(response[i].fecha_muestreo);
          if (fechaPlanificacion >= fechaActual) {
            listaEstados.push({solicitud: response[i], estado: 'En proceso'});
          }
          if (fechaPlanificacion < fechaActual) {
            listaEstados.push({solicitud: response[i], estado: 'Atrasada'});
          }
        }
        $scope.solicitudes = listaEstados;
      });
    });

    var aviso = {usuario: modalSol.cliente.id_usuario, name: 'Solicitud', id: modalSol.id_solicitud_cliente, online: 'SolicitudRechazada', status: 'fa-file ', id_solicitud: modalSol.id_solicitud};
    $http.post('/api/avisos', aviso).success(function(respu){
    })

    var aviso = {usuario: 1, name: 'Solicitud', id: modalSol.id_solicitud, online: 'SolicitudRechazada', status: 'fa-file ', id_solicitud: modalSol.id_solicitud};
    $http.post('/api/avisos', aviso).success(function(respu){
    })

    $scope.muestraInspector = false;
    $scope.muestraRechaza = false;
    $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
    $notify.setPosition('bottom-left');
    $notify.error('Notificacion', 'Solicitud Rechazada');
  };
  //-----------------------------------------------------------------------------------//
  //Funcion que envia id de la solicitud a eliminar al modal de advertecia
  //--------------------------------------------------------------------//
  $scope.eliminarModal = function(sol){
    $scope.modalSol = sol;
  };
  //--------------------------------------------------------------------//

  //Funcion que trae todos los Inpectores de la base de datos acorde al tipo de administrador.
  //-----------------------------------------------------------------------------------//
  listarUsuariosFiltro();
  function listarUsuariosFiltro(){
      var admin = $rootScope.loggedUser;
    if (admin.animal === undefined && admin.alimento === undefined && admin.agua === undefined) {
      var id_perfil = 3;
      $http.get('/api/usuarios/' + id_perfil ).success(function(response){
        $scope.inspectores = response;
      });
    }else if (admin.animal === true && admin.alimento === false && admin.agua === false) {
      $http.get('/api/inspectoresAnimal').success(function(response){
        $scope.inspectores = response;
      });
    }else if (admin.animal === false && admin.alimento === true && admin.agua === true) {
      $http.get('/api/inspectoresFood').success(function(response){
        $scope.inspectores = response;
      });
    }

  };
  //-----------------------------------------------------------------------------------//


  //Funcion que trae las solicitudes de la base de datos filradas por asignacion de ot (no asignadas).
  //-----------------------------------------------------------------------------------//
  listarSolicitudes();
  function listarSolicitudes(){
    var listaEstados = [];
    fechaActual = new Date();
    var admin = $rootScope.loggedUser;


    if (admin.animal === undefined && admin.alimento === undefined && admin.agua === undefined) {
      $http.get('/api/noasignada').success(function(response){
        for (var i = 0; i < response.length; i++) {
          var fechaPlanificacion = new Date(response[i].fecha_muestreo);
          if (fechaPlanificacion >= fechaActual) {
            listaEstados.push({solicitud: response[i], estado: 'En proceso'});
          }
          if (fechaPlanificacion < fechaActual) {
            listaEstados.push({solicitud: response[i], estado: 'Atrasada'});
          }
        }
        $scope.solicitudes = listaEstados;
      });
    }else if (admin.animal === true && admin.alimento === false && admin.agua === false) {
      $http.get('/api/solicitudesAdminAnimal').success(function(response){
        for (var i = 0; i < response.length; i++) {
          var fechaPlanificacion = new Date(response[i].fecha_muestreo);
          if (fechaPlanificacion >= fechaActual) {
            listaEstados.push({solicitud: response[i], estado: 'En proceso'});
          }
          if (fechaPlanificacion < fechaActual) {
            listaEstados.push({solicitud: response[i], estado: 'Atrasada'});
          }
        }
        $scope.solicitudes = listaEstados;
      });
    }else if (admin.animal === false && admin.alimento === true && admin.agua === true) {
      $http.get('/api/solicitudesAdminFood').success(function(response){
        for (var i = 0; i < response.length; i++) {
          var fechaPlanificacion = new Date(response[i].fecha_muestreo);
          if (fechaPlanificacion >= fechaActual) {
            listaEstados.push({solicitud: response[i], estado: 'En proceso'});
          }
          if (fechaPlanificacion < fechaActual) {
            listaEstados.push({solicitud: response[i], estado: 'Atrasada'});
          }
        }
        $scope.solicitudes = listaEstados;
      });
    }

  };
  //-----------------------------------------------------------------------------------//


  //Funcion que trae las solicitudes de la base de datos filradas por asignacion de ot (asignadas).
  //-----------------------------------------------------------------------------------//
  listarSolicitudesOt();
  function listarSolicitudesOt(){
    var listaEstados = [];
    fechaActual = new Date();
    var admin = $rootScope.loggedUser;

    if (admin.animal === undefined && admin.alimento === undefined && admin.agua === undefined) {
      $http.get('/api/asignada').success(function(response){
        for (var i = 0; i < response.length; i++) {
          var fechaPlanificacion = new Date(response[i].fecha_planificacion);
          if (fechaPlanificacion >= fechaActual) {
            listaEstados.push({solicitud: response[i], estado: 'En proceso'});
          }
          if (fechaPlanificacion < fechaActual) {
            listaEstados.push({solicitud: response[i], estado: 'Atrasada'});
          }
        }
        $scope.ordenTrabajo = listaEstados;
      });
    }else if (admin.animal === true && admin.alimento === false && admin.agua === false) {
      $http.get('/api/OTAdminAnimal').success(function(response){
        for (var i = 0; i < response.length; i++) {
          var fechaPlanificacion = new Date(response[i].fecha_muestreo);
          if (fechaPlanificacion >= fechaActual) {
            listaEstados.push({solicitud: response[i], estado: 'En proceso'});
          }
          if (fechaPlanificacion < fechaActual) {
            listaEstados.push({solicitud: response[i], estado: 'Atrasada'});
          }
        }
        $scope.ordenTrabajo = listaEstados;
      });
    }else if (admin.animal === false && admin.alimento === true && admin.agua === true) {
      $http.get('/api/OTAdminFood').success(function(response){
        for (var i = 0; i < response.length; i++) {
          var fechaPlanificacion = new Date(response[i].fecha_muestreo);
          if (fechaPlanificacion >= fechaActual) {
            listaEstados.push({solicitud: response[i], estado: 'En proceso'});
          }
          if (fechaPlanificacion < fechaActual) {
            listaEstados.push({solicitud: response[i], estado: 'Atrasada'});
          }
        }
        $scope.ordenTrabajo = listaEstados;
      });
    }


  };
  //-----------------------------------------------------------------------------------//



  //Metodo que modifica el campo mensaje de solicitud para agregar y listar la lista de este
  //------------------------------------------------------------------------------------------------------------------------------//
  $scope.modalMensaje = function (modalSol, msj) {
    var lista = [];
    var id;
    if (modalSol.mensaje.length === 0) {
      id_mensaje = 1;
    } else {
      id_mensaje = modalSol.mensaje.length + 1;
    }
    lista = modalSol.mensaje;
    var fecha = new Date();
    var nuevo = {id_mensaje: id_mensaje, fecha: fecha, contenido: msj, emisor: $rootScope.loggedUser.nombre, cargo: $rootScope.loggedUser.perfil[0].nombre_perfil};
    lista.push(nuevo);
    $http.put('/api/solicitudMensaje/' + modalSol.id_solicitud, {mensaje: lista}).success(function(response){
    });
    $scope.mensajesModal = lista;
    $scope.mensajeArea = '';

    var aviso = {usuario: modalSol.cliente.id_usuario, name: 'Solicitud ', id: modalSol.id_solicitud_cliente, online: 'mensajeNuevo', status: 'fa-envelope ', id_solicitud: modalSol.id_solicitud};
    $http.post('/api/avisos', aviso).success(function(respu){
      traerAvisosFiltro();
    })

    if (modalSol.id_orden_trabajo === undefined) {
      var aviso2 = {usuario: 1, name: 'Solicitud', id: modalSol.id_solicitud, online: 'mensajeEnviado', status: 'fa-envelope ', id_solicitud: modalSol.id_solicitud};
      $http.post('/api/avisos', aviso2).success(function(respu){
      })
      var mail = {nombre: 'Qualified', para: $rootScope.loggedUser.correo, asunto: 'Alerta Qualified', contenido: 'Mensaje enviado por ' + $rootScope.loggedUser.nombre + ' Mensaje: ' + msj};
      $http.post('/api/mail', mail).success(function(respuesta){});
      var mail = {nombre: 'Qualified', para: modalSol.cliente.correo, asunto: 'Alerta Qualified', contenido: 'Mensaje enviado por ' + $rootScope.loggedUser.nombre + ' Mensaje: ' + msj};
      $http.post('/api/mail', mail).success(function(respuesta){});
    }else {
      var aviso = {usuario: modalSol.inspector, name: 'Orden de Trabajo', id: modalSol.id_orden_trabajo, online: 'mensajeNuevo', status: 'fa-envelope ', id_solicitud: modalSol.id_solicitud};
      $http.post('/api/avisos', aviso).success(function(resultado){
      })
      var aviso1 = {usuario: 1, name: 'Orden de Trabajo', id: modalSol.id_orden_trabajo, online: 'mensajeEnviado', status: 'fa-envelope ', id_solicitud: modalSol.id_solicitud};
      $http.post('/api/avisos', aviso1).success(function(respu){
      })
      $http.get('/api/usuarioId/' + modalSol.inspector).success(function(respu){
        var mail = {nombre: 'Qualified', para: respu[0].correo, asunto: 'Alerta Qualified', contenido: 'Mensaje enviado por ' + $rootScope.loggedUser.nombre + ' Mensaje: ' + msj};
        $http.post('/api/mail', mail).success(function(respuesta){});
      });

      var mail = {nombre: 'Qualified', para: $rootScope.loggedUser.correo, asunto: 'Alerta Qualified', contenido: 'Mensaje enviado por ' + $rootScope.loggedUser.nombre + ' Mensaje: ' + msj};
      $http.post('/api/mail', mail).success(function(respuesta){});

      var mail = {nombre: 'Qualified', para: modalSol.cliente.correo, asunto: 'Alerta Qualified', contenido: 'Mensaje enviado por ' + $rootScope.loggedUser.nombre + ' Mensaje: ' + msj};
      $http.post('/api/mail', mail).success(function(respuesta){});
      if (modalSol.laboratorio !== undefined) {
        var aviso3 = {usuario: modalSol.laboratorio, name: 'Orden de Trabajo', id: modalSol.id_orden_trabajo, online: 'mensajeNuevo', status: 'fa-envelope ', id_solicitud: modalSol.id_solicitud};
        $http.post('/api/avisos', aviso3).success(function(resultado){
        })
        $http.get('/api/usuarioId/' + modalSol.laboratorio).success(function(respu){
          var mail = {nombre: 'Qualified', para: respu[0].correo, asunto: 'Alerta Qualified', contenido: 'Mensaje enviado por ' + $rootScope.loggedUser.nombre + ' Mensaje: ' + msj};
          $http.post('/api/mail', mail).success(function(respuesta){});
        });
      }
    }

    $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
    $notify.setPosition('bottom-left');
    $notify.info('Notificacion', 'Mensaje Enviado');

  };
  //------------------------------------------------------------------------------------------------------------------------------//

  //Metodo para enviar datos a modal (Solicitud y mensaje)
  //------------------------------------------------------------------//
  $scope.enviarMensajeModal = function (sol) {
    $scope.modalSol = sol;
    $scope.mensajesModal = sol.mensaje;
  };
  $scope.enviarVistaModal = function (sol) {
    $scope.modalSolicitud = sol;
    $scope.modalSol = sol.id_solicitud;
    $scope.modalFecha = sol.fecha_creacion;
    $scope.modalFechaMuestreo = sol.fecha_muestreo;
    $scope.modalCliente = sol.cliente.nombre;
    $scope.listaLotesModal = sol.lote;
    $scope.modalFechaPlanificacion = sol.fecha_planificacion;
    $scope.muestraInspector = false;
    $scope.muestraRechaza = false;
    listarObservacion(sol);
  };
  $scope.inspectorModal = function(sol){
    $scope.modalSolInspector = sol;
  }
  //-----------------------------------------------------------------//


  //Metodos WorkFlow
  //----------------------------------------------------------------------//
  // $scope.flujo = '';
  // function listarPasos(paso){
  //   var paso_actual = paso;
  //   var id_perfil = $rootScope.loggedUser.perfil[0].id_perfil;
  //   $http.get('/api/workFlow/'+ id_perfil).success(function(response){
  //     var workFlow = response[0].workFlow;
  //     var lista = [];
  //     for (var i = 0; i < workFlow.length; i++) {
  //       if (workFlow[i].paso_actual === paso_actual && workFlow[i].check === true) {
  //         lista.push(workFlow[i]);
  //
  //       }
  //     }
  //     $http.get('/api/paso').success(function(respuesta){
  //       var pasos = respuesta;
  //       var flujo = [];
  //       for (var i = 0; i < lista.length; i++) {
  //         for (var j = 0; j < pasos.length; j++) {
  //           if (lista[i].id_paso === pasos[j].id) {
  //             var nuevo = {id: lista[i].id_paso, nombre: pasos[j].paso};
  //             flujo.push(nuevo);
  //           }
  //         }
  //       }
  //       $scope.flujo = flujo;
  //     })
  //   })
  // }
  //----------------------------------------------------------------------//



  $scope.mostrarPdf = function(id_solicitud, id_lote){

    $http.get('/api/solicitudUnica/' + id_solicitud).success(function(response){

      for (var i = 0; i < response[0].lote.length; i++) {
        if (response[0].lote[i].id_lote === id_lote) {

          var nombreCertificado = response[0].lote[i].certificado;
          $http.get('/traerCertificado/' + nombreCertificado).success(function(certificado){
            var contentType = 'application/pdf';
            var b64Data = certificado;

            var blob = b64toBlob(b64Data, contentType);
            var blobUrl = URL.createObjectURL(blob);
            $scope.content = $sce.trustAsResourceUrl(blobUrl);
            $timeout(function() {
              printPdf();
            }, 300);
          });
        }
      };
    });
    $timeout(function() {
      printPdf();
    }, 300);
  }

  function printPdf() {
    var divName = 'pdfVer';
    var printContents = document.getElementById(divName).innerHTML;
    var popupWin = window.open('', 'Certificados' ,'_blank', 'width=100%,height=100%');
    popupWin.document.open();
    popupWin.document.write('<html><head></head><body style="width=100%,height=100%">' + printContents + '</body></html>');
    popupWin.document.close();
  }

  //Metodos DatePicker
  //------------------------------------------------------------------------------------------------------------------------------//
  $scope.today = function() {
    $scope.fecha_muestreo = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.fecha_muestreo = null;
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  // Disable weekend selection
  function disabled(data) {
    var hoy = new Date();
    var date = data.date,
    mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.fecha_muestreo = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
    mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }
  //------------------------------------------------------------------------------------------------------------------------------//

  // Metodos Auxiliares
  $scope.filtroEstadosOt = function(estado){
    var listaEstadoAtrasada = [];
    var listaEstadoProceso = [];
    fechaActual = new Date();
    $http.get('/api/asignada').success(function(response){
      for (var i = 0; i < response.length; i++) {
        var fechaPlanificacion = new Date(response[i].fecha_planificacion);
        if (fechaPlanificacion >= fechaActual) {
          listaEstadoProceso.push({solicitud: response[i], estado: 'En proceso'});
        }
        if (fechaPlanificacion < fechaActual) {
          listaEstadoAtrasada.push({solicitud: response[i], estado: 'Atrasada'});
        }
      }
      if (estado === 'En proceso') {
        $scope.ordenTrabajo = listaEstadoProceso;
      }
      if (estado === 'Atrasada') {
        $scope.ordenTrabajo = listaEstadoAtrasada;
      }
      if (estado === 'Todas') {
        listarSolicitudesOt();
      }
    });
  }

  $scope.filtroEstados = function(estado){
    var listaEstadoAtrasada = [];
    var listaEstadoProceso = [];
    fechaActual = new Date();
    $http.get('/api/noasignada').success(function(response){
      for (var i = 0; i < response.length; i++) {
        var fechaPlanificacion = new Date(response[i].fecha_muestreo);
        if (fechaPlanificacion >= fechaActual) {
          listaEstadoProceso.push({solicitud: response[i], estado: 'En proceso'});
        }
        if (fechaPlanificacion < fechaActual) {
          listaEstadoAtrasada.push({solicitud: response[i], estado: 'Atrasada'});
        }
      }
      if (estado === 'En proceso') {
        $scope.solicitudes = listaEstadoProceso;
      }
      if (estado === 'Atrasada') {
        $scope.solicitudes = listaEstadoAtrasada;
      }
      if (estado === 'Todas') {
        listarSolicitudes();
      }
    });
  }


  $scope.filtrarProceso = function(id_proceso){

    var lista = [];
    fechaActual = new Date();
    if (id_proceso === null) {
      listarSolicitudesOt();
    }else{
      $http.get('/api/filtro/' + id_proceso).success(function(response){
        for (var i = 0; i < response.length; i++) {
          var fechaPlanificacion = new Date(response[i].fecha_planificacion);
          if (fechaPlanificacion >= fechaActual) {
            lista.push({solicitud: response[i], estado: 'En proceso'});
          }
          if (fechaPlanificacion < fechaActual) {
            lista.push({solicitud: response[i], estado: 'Atrasada'});
          }
        }

        $scope.ordenTrabajo = lista;

      });
    }

  }

  function listarProcesos(){

    $http.get('/api/procesos').success(function(respuesta){
      $scope.pasos = respuesta;
    });


  }

  $scope.eliminarImg = function(nombre, solicitud){


    $http.delete('/eliminarImg/' + nombre).success(function(response){});

    var archivo = {nombreArchivo: nombre};
    $http.put('/api/solicitudArchivo/' + solicitud.id_solicitud, archivo).success(function(respuesta){
      $scope.modalSolicitud.evidencia = respuesta.evidencia;
    });
    $timeout(function() {
      listarSolicitudesOt();
    }, 300);

  }


  //Funcion que elimina un lote de una solicitud.
  //--------------------------------------------------------------------//
  $scope.eliminarLoteSolicitud = function(id_lote, id_sol, listaLote){

    if (listaLote.length === 1) {
      $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
      $notify.setPosition('bottom-left');
      $notify.info('Notificacion', 'La solicitud no puede quedar sin items');
    }else {
      var usuarioLote = {id_solicitud: id_sol, id_lote: id_lote, id_usuario: $rootScope.loggedUser.id_usuario};
      $http.post('/api/lote', usuarioLote).success(function(response){
        $scope.listaLotesModal = response[0].lote;
      });
      $timeout(function() {
        listarSolicitudesOt();
      }, 300);
      $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
      $notify.setPosition('bottom-left');
      $notify.error('Notificacion', 'Item Romovido');
    }
  };
  //--------------------------------------------------------------------//

  // Metodo que habilita la columna de edicion de un Lote.
  //--------------------------------------------------------------------//
  $scope.setearValoresMod = function(lote, fecha, solicitud){
    $rootScope.habilitarEdicion();
    listaTraders();
    listarMateriaPrima();
    listarBodegas();
    listarPaises();
    listarMuestreo();
    $scope.materiaPrima = lote.materiaPrima.id_materiaPrima;
    $scope.pais = lote.paisTrader.nombrePais;
    $scope.trader = lote.trader.id_trader;
    $scope.modalLote = lote.lote;
    $scope.modalBulto = lote.bultos;
    $scope.modalCantidad = lote.cantidad;
    $scope.modalContenedor = lote.contenedor;
    $scope.bodega = lote.bodega.id_bodega;
    $scope.id_lote = lote.id_lote;
    $scope.muestreo = lote.tipoMuestreo.id_tipoMuestreo;
    fecha_muestreo = new Date(fecha);
    $scope.fecha_muestreo_mod = fecha_muestreo;
  };
  //--------------------------------------------------------------------//

  // Metodo que habilita la edicion
  $rootScope.habilitarEdicion = function(){
    if (!$rootScope.habilitar) {
      $rootScope.habilitar = true;
    }else{
      $rootScope.habilitar = false;
    }
  }

  $scope.deshabilitarEdicion = function(){
    $rootScope.habilitar = false;
  }

  //Este metodo Elimina un indice en el arreglo de lotes el cual se guardara con la soliciud.
  //-----------------------------------------------------------------------------------------------------------------//
  $scope.modificarLote = function(id_lote, materiaPrima, trader, modalLote, modalBulto, modalCantidad, modalContenedor, bodega, id_solicitud, pais, muestreo, modalSol){

    var listaNueva = [];
    var id_solicitud = modalSol.id_solicitud;

    $http.get('/api/materiaPrima' + materiaPrima).success(function(materia){

      var lote = {bodega: {nombreBodega: bodega}, id_lote: id_lote, materiaPrima: {nombreMateriaPrima: materia}, trader: {nombreTrader: trader}, paisTrader: {nombrePais: pais}, lote: modalLote, bultos: modalBulto, cantidad: modalCantidad, contenedor: modalContenedor, tipoMuestreo:{tipoMuestreo: muestreo}};


      for (var i = 0; i < modalSol.lote.length; i++) {
        if (id_lote !== modalSol.lote[i].id_lote) {
          listaNueva.push(modalSol.lote[i]);
        }
      }

      listaNueva.push(lote);

      var post = {lotes: listaNueva, id_solicitud: modalSol.id_solicitud};

      $http.put('/api/modificarLotes/' + id_solicitud, post).success(function(lotes){
        $scope.listaLotesModal = lotes;
      });
    });

    // var aviso = {usuario: $rootScope.loggedUser.id_usuario, name: 'Solicitud', id: modalSol.id_solicitud_cliente, online: 'SolModificada', status: 'fa-file ', id_solicitud: modalSol.id_solicitud};
    // $http.post('/api/avisos', aviso).success(function(respu){
    //   traerAvisosFiltro();
    // })
    // var aviso2 = {usuario: 1, name: 'Solicitud', id: modalSol.id_solicitud, online: 'SolModificada', status: 'fa-file ', id_solicitud: modalSol.id_solicitud};
    // $http.post('/api/avisos', aviso2).success(function(respu){
    // })
    //
    $rootScope.habilitar = false;
    $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
    $notify.setPosition('bottom-left');
    $notify.success('Notificacion', 'Item Modificado');
    //
    $timeout(function() {
      listarSolicitudesOt();
    }, 200);
  }
  //-----------------------------------------------------------------------------------------------------------------//

  // Metodo que trae los Traders(Proveedores) filtrados por el id de materia prima
  function listaTraders(){
    $http.get('/api/trader').success(function(response){
      $scope.listaTraders = response;
    });
  }

  // Metodo que setea el valor del pais al pulsar el boton editar item
  // function listarPaisPorTrader(listaTraders, id_trader){
  //   for (var i = 0; i < listaTraders.length; i++) {
  //     if (listaTraders[i].id_trader === id_trader) {
  //       $rootScope.paisTrader = listaTraders[i].nombrePais;
  //     }
  //   }
  // }

  // Metodo que cambia el valor del pais segun el trader
  // $scope.listarPais = function(lista, id_trader){
  //   for (var i = 0; i < lista.length; i++) {
  //     if (lista[i].id_trader === id_trader) {
  //       $rootScope.paisTrader = lista[i].nombrePais;
  //     }
  //   }
  // }

  function listarMateriaPrima(){
    $http.get('/api/materiaPrima').success(function(response){
      $scope.listarMateriaPrima = response;
    });
  }

  $scope.listaTradersFiltro = function(){
    $http.get('/api/trader').success(function(response){
      $scope.listaTraders = response;
    });
  }

  function listarBodegas(){
    $http.get('/api/traerBodega').success(function(response){
      $scope.listarBodegas = response;
    });
  };

  function listarPaises(){
    $http.get('/api/pais').success(function(response){
      $scope.listarPaises = response;
    });
  };

  function listarMuestreo(){

    $http.get('/api/tipoMuestreo').success(function(response){
      $scope.listaMuestreo = response;
    });

  }

  //Funcion que trae los laboratorios de la base de datos.
  //-----------------------------------------------------------------------------------//
  listarUsuarios();
  function listarUsuarios(){
    var id_perfil = 4;
    $http.get('/api/usuarios/' + id_perfil ).success(function(response){
      $scope.listarLaboratorios = response;
    });
  };
  //-----------------------------------------------------------------------------------//

  $scope.enviarObservacionModal = function (sol, id_lote) {

    id = {id_solicitud: sol.id_solicitud, id_lote: id_lote};

    $http.post('/api/traerObservacion', id).success(function(respuesta){
      $scope.ObservacionesModal = respuesta.observacion;
    });
    $scope.id_loteObservacion = id_lote;

  };

  $scope.mostrarEvidencia = function(evidencia){

    $http.get('/traerCertificado/' + evidencia).success(function(evidencias){
      var contentType = 'image/*';
      var b64Data = evidencias;

      var blob = b64toBlob(b64Data, contentType);
      var blobUrl = URL.createObjectURL(blob);
      $scope.evidencias = $sce.trustAsResourceUrl(blobUrl);
      $timeout(function() {
        printEvidencia();
      }, 300);
    });
  }

  function printEvidencia() {
    var divName = 'evidenciaVer';
    var printContents = document.getElementById(divName).innerHTML;
    var popupWin = window.open('', 'Evidencias' ,'_blank', 'width=100%,height=100%');
    popupWin.document.open();
    popupWin.document.write('<html><head></head><body style="width=100%,height=100%">' + printContents + '</body></html>');
    popupWin.document.close();
  }

  // Convierte base64 en blob para visualizar el pdf
  function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

}]);
