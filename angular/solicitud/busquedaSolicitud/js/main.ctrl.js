app.controller('busquedaClienteController', function ($scope, $notify, $http, $rootScope, $timeout, $sce, $location) {


  listarMuestreo();
  function listarMuestreo(){
    $http.get('/api/listarTipoMuestreo').success(function(response){
      var lista = [];
      var listaM = [];
      if ($rootScope.loggedUser.animal) {
        lista.push(1);
      }
      if ($rootScope.loggedUser.alimento) {
        lista.push(2);
      }
      if ($rootScope.loggedUser.agua) {
        lista.push(3);
      }


      for (var i = 0; i < lista.length; i++) {
        for (var j = 0; j < response.length; j++) {
          if (lista[i] === response[j].seleccion) {
            listaM.push(response[j]);
          }
        }
      }

      $scope.listaMuestreo = listaM;
    });
  }

  $scope.redirigirCreacion = function(tipoMuestreo){
    if(tipoMuestreo === undefined){
      $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
      $notify.setPosition('bottom-left');
      $notify.error('Notificacion', 'Debe seleccionar tipo de Muestreo');
    }else {
      var tipo = tipoMuestreo.id_tipoMuestreo;
      var nombre = tipoMuestreo.descripcion;
      $rootScope.titulo = nombre;
      $rootScope.idTipo = tipo;
      if (tipo === 1) {
        $location.path('creacionSolicitudHarina');
      }else if (tipo === 2) {
        $location.path('creacionSolicitudAlimento');
      }else if (tipo === 3) {
        $location.path('creacionMuestreo');
      }else if (tipo === 4) {
        $location.path('creacionMuestreo');
      }else if (tipo === 5) {
        $location.path('creacionMuestreo');
      }else if (tipo === 6) {
        $location.path('creacionMuestreo');
      }else if (tipo === 7) {
        $location.path('creacionMuestreo');
      }else if(tipo === 8){
        $location.path('creacionMuestreo');
      }else {
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.error('Notificacion', 'Debe seleccionar tipo de Muestreo');
      }
    }
  }

  //Carga de datos.
  //-----------------------------------------------------------------------------------//
  traerSolicitudesFiltro();
  traerAvisosFiltro();
  $rootScope.habilitar = false;
  $scope.listaProcesos = [];
  var solicitudes = [];
  // Metodo que trae las solicitudes filtradas por usuario.
  function traerSolicitudesFiltro(){
    var id_usuario = $rootScope.loggedUser.id_usuario;
    $http.get('/api/solicitud/' + id_usuario).success(function(response){
      solicitudes = response;
      for (var i = 0; i < solicitudes.length; i++) {
        for (var j = 0; j < solicitudes[i].proceso.length; j++) {
          if (!solicitudes[i].proceso[j].visible) {
            solicitudes[i].proceso.splice(j, 1);
            j--;
          }
        }
      }
      $scope.solicitudes = solicitudes;
    });
  };
  //-----------------------------------------------------------------------------------//


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


  //Funcion que elimina una solicitud desde la base de datos y refresca la pantalla
  //-----------------------------------------------------------------------------------//
  $scope.eliminaSolicitud = function(id_solicitud, id_solicitud_cliente){
    var idUsuario = {id_usuario: $rootScope.loggedUser.id_usuario};
    $http.post('/api/solicitud/' + id_solicitud, idUsuario).success(function(response){
      solicitudes = response;
      $scope.solicitudes = solicitudes;
    });
    var aviso = {usuario: 1, name: 'Solicitud', id: id_solicitud, online: 'SolicitudCancelada', status: 'fa-file '};
    $http.post('/api/avisos', aviso).success(function(respu){
    })

    $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
    $notify.setPosition('bottom-left');
    $notify.error('Notificacion', 'Solicitud Cancelada');

    var mail = {nombre: 'Qualified', para: $rootScope.loggedUser.correo, asunto: 'Alerta Qualified', contenido: 'Solicitud ' + id_solicitud + ' cancelada por ' + $rootScope.loggedUser.nombre};
    $http.post('/api/mail', mail).success(function(respuesta){});
    $http.get('/api/usuarioId/' + 1).success(function(respu){
      var mail = {nombre: 'Qualified', para: respu[0].correo, asunto: 'Alerta Qualified', contenido: 'Solicitud ' + modalSol.id_solicitud + ' cancelada por ' + $rootScope.loggedUser.nombre};
      $http.post('/api/mail', mail).success(function(respuesta){});
    });
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
    var mensaje = {id_mensaje: id_mensaje, fecha: fecha, contenido: msj, emisor: $rootScope.loggedUser.nombre, cargo: $rootScope.loggedUser.perfil[0].nombre_perfil};
    lista.push(mensaje);
    $http.put('/api/solicitudMensaje/' + modalSol.id_solicitud, {mensaje: lista}).success(function(response){
    });
    $scope.mensajesModal = lista;
    $scope.mensajeArea = '';

    var aviso = {usuario: $rootScope.loggedUser.id_usuario, name: 'Solicitud ', id: modalSol.id_solicitud_cliente, online: 'mensajeEnviado', status: 'fa-envelope ', id_solicitud: modalSol.id_solicitud};
    $http.post('/api/avisos', aviso).success(function(respu){
      traerAvisosFiltro();
    })
    var mail = {nombre: 'Qualified', para: $rootScope.loggedUser.correo, asunto: 'Alerta Qualified', contenido: 'Mensaje enviado por ' + $rootScope.loggedUser.nombre + 'Mensaje: ' + msj };
    $http.post('/api/mail', mail).success(function(respuesta){});

    if (modalSol.inspector !== undefined) {
      var aviso = {usuario: modalSol.inspector, name: 'Orden de Trabajo', id: modalSol.id_orden_trabajo, online: 'mensajeNuevo', status: 'fa-envelope ', id_solicitud: modalSol.id_solicitud};
      $http.post('/api/avisos', aviso).success(function(resultado){
      })
      var aviso1 = {usuario: 1, name: 'Orden de Trabajo', id: modalSol.id_orden_trabajo, online: 'mensajeNuevo', status: 'fa-envelope ', id_solicitud: modalSol.id_solicitud};
      $http.post('/api/avisos', aviso1).success(function(respu){
      })
      $http.get('/api/usuarioId/' + 1).success(function(respu){
        var mail = {nombre: 'Qualified', para: respu[0].correo, asunto: 'Alerta Qualified', contenido: 'Mensaje enviado por ' + $rootScope.loggedUser.nombre + ' Mensaje: ' + msj};
        $http.post('/api/mail', mail).success(function(respuesta){});
      });
      $http.get('/api/usuarioId/' + modalSol.inspector).success(function(respu){
        var mail = {nombre: 'Qualified', para: respu[0].correo, asunto: 'Alerta Qualified', contenido: 'Mensaje enviado por ' + $rootScope.loggedUser.nombre + ' Mensaje: ' + msj};
        $http.post('/api/mail', mail).success(function(respuesta){});
      });
      if (modalSol.laboratorio !== undefined) {
        var aviso3 = {usuario: modalSol.laboratorio, name: 'Orden de Trabajo', id: modalSol.id_orden_trabajo, online: 'mensajeNuevo', status: 'fa-envelope ', id_solicitud: modalSol.id_solicitud};
        $http.post('/api/avisos', aviso3).success(function(resultado){
        })
        $http.get('/api/usuarioId/' + modalSol.laboratorio).success(function(respu){
          var mail = {nombre: 'Qualified', para: respu[0].correo, asunto: 'Alerta Qualified', contenido: 'Mensaje enviado por ' + $rootScope.loggedUser.nombre + ' Mensaje: ' + msj};
          $http.post('/api/mail', mail).success(function(respuesta){});
        });
      }
    }else {
      var aviso2 = {usuario: 1, name: 'Solicitud', id: modalSol.id_solicitud, online: 'mensajeNuevo', status: 'fa-envelope ', id_solicitud: modalSol.id_solicitud};
      $http.post('/api/avisos', aviso2).success(function(respu){
      })
      $http.get('/api/usuarioId/' + 1).success(function(respu){
        var mail = {nombre: 'Qualified', para: respu[0].correo, asunto: 'Alerta Qualified', contenido: 'Mensaje enviado por ' + $rootScope.loggedUser.nombre + ' Mensaje: ' + msj};
        $http.post('/api/mail', mail).success(function(respuesta){});
      });
    }

    $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
    $notify.setPosition('bottom-left');
    $notify.info('Notificacion', 'Mensaje Enviado');

  };
  //------------------------------------------------------------------------------------------------------------------------------//


  //Metodo para realizar el cambio de estado a finalizado
  //------------------------------------------------------------------------------------------------------------------------------//
  $scope.confirmaRecepcion = function(modalSol){
    var nuevo = [{"id_proceso" : 15, "descripcion" : "Finalizado", "color" : "A901DB", "icono" : "flag", "visible" : true}];
    $http.put('/api/solicitud/' + modalSol.id_solicitud, {id_orden_trabajo: modalSol.id_orden_trabajo, estado: 'Finalizado' , proceso: nuevo, inspector: modalSol.inspector, laboratorio: modalSol.laboratorio,fecha_planificacion: modalSol.fecha_planificacion}).success(function(respuesta){
    });
    traerSolicitudesFiltro();

    var aviso = {usuario: $rootScope.loggedUser.id_usuario, name: 'Solicitud', id: modalSol.id_solicitud_cliente, online: 'SolFinalizada', status: 'fa-file ', id_solicitud: modalSol.id_solicitud};
    $http.post('/api/avisos', aviso).success(function(respu){
      traerAvisosFiltro();
    })
    var aviso1 = {usuario: modalSol.inspector, name: 'Orden de Trabajo', id: modalSol.id_orden_trabajo, online: 'OTFinalizada', status: 'fa-file ', id_solicitud: modalSol.id_solicitud};
    $http.post('/api/avisos', aviso1).success(function(respu){
    })
    var aviso2 = {usuario: modalSol.laboratorio, name: 'Orden de Trabajo', id: modalSol.id_orden_trabajo, online: 'OTFinalizada', status: 'fa-file ', id_solicitud: modalSol.id_solicitud};
    $http.post('/api/avisos', aviso2).success(function(respu){
    })
    var aviso3 = {usuario: 1, name: 'Orden de Trabajo', id: modalSol.id_orden_trabajo, online: 'OTFinalizada', status: 'fa-file ', id_solicitud: modalSol.id_solicitud};
    $http.post('/api/avisos', aviso3).success(function(respu){
    })

    //
    var mail = {nombre: 'Qualified', para: $rootScope.loggedUser.correo, asunto: 'Alerta Qualified', contenido: 'Solicitud ' + modalSol.id_solicitud_cliente + ' recibida por ' + $rootScope.loggedUser.nombre};
    $http.post('/api/mail', mail).success(function(respuesta){});

    $http.get('/api/usuarioId/' + 1).success(function(respu){
      var mail = {nombre: 'Qualified', para: respu[0].correo, asunto: 'Alerta Qualified', contenido: 'Orden de Trabajo ' + modalSol.id_orden_trabajo + ' recibida por ' + $rootScope.loggedUser.nombre};
      $http.post('/api/mail', mail).success(function(respuesta){});
    });
    $http.get('/api/usuarioId/' + modalSol.inspector).success(function(respu){
      var mail = {nombre: 'Qualified', para: respu[0].correo, asunto: 'Alerta Qualified', contenido: 'Orden de Trabajo ' + modalSol.id_orden_trabajo + ' recibida por ' + $rootScope.loggedUser.nombre};
      $http.post('/api/mail', mail).success(function(respuesta){});
    });

  }
  //------------------------------------------------------------------------------------------------------------------------------//

  //Metodo para enviar datos a modal (Solicitud y mensaje)
  //------------------------------------------------------------------//
  $scope.enviarMensajeModal = function (sol) {
    $scope.modalSol = sol;
    $scope.mensajesModal = sol.mensaje;
  };
  //-----------------------------------------------------------------//


  //Funcion que carga el modal con los datos de la solicitud seleccionada
  //--------------------------------------------------------------------//
  $scope.enviarVistaModal = function (sol) {
    $scope.modalSol = sol.id_solicitud;
    $scope.modalSolcliente = sol.id_solicitud_cliente;
    $scope.modalFecha = sol.fecha_creacion;
    $scope.modalFechaMuestreo = sol.fecha_muestreo;
    $scope.modalCliente = sol.cliente.nombre;
    $scope.listaLotesModal = sol.lote;
    $scope.habilitado = sol.proceso[0].id_proceso;
    $scope.modalFechaPlanificacion = sol.fecha_planificacion;
    $scope.solicitud = sol;
  };
  //--------------------------------------------------------------------//


  //Funcion que envia datos a la vista de recepcion
  //--------------------------------------------------------------------//
  $scope.enviarRecepcion = function(sol){
    $scope.modalSol = sol;
  }
  //--------------------------------------------------------------------//


  //Funcion que envia id de la solicitud a eliminar al modal de advertecia
  //--------------------------------------------------------------------//
  $scope.eliminarModal = function(sol){
    $scope.modalSol = sol;
  };
  //--------------------------------------------------------------------//

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
      traerSolicitudesFiltro();
      $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
      $notify.setPosition('bottom-left');
      $notify.error('Notificacion', 'Item Romovido');
    }
  };
  //--------------------------------------------------------------------//

  $scope.modificarFechaMuestreo = function(fecha, id_solicitud){
    var hoy = new Date();
    if (hoy >= fecha) {
      $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
      $notify.setPosition('bottom-left');
      $notify.info('Notificacion', 'Fecha muestreo no valida');
    }else {
      var fechaMod = {fecha_muestreo: fecha, id_solicitud: id_solicitud};
      $http.put('/api/solicitudCliente/' + id_solicitud, fechaMod).success(function(response){
      });
      $timeout(function() {
        traerSolicitudesFiltro();
        $scope.modalFechaMuestreo = fecha;
      }, 200);
    }
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

    $rootScope.habilitar = false;
    $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
    $notify.setPosition('bottom-left');
    $notify.success('Notificacion', 'Item Modificado');
    //
    $timeout(function() {
      traerSolicitudesFiltro();
    }, 200);
  }
  //-----------------------------------------------------------------------------------------------------------------//


  //Metodos Auxiliares
  // Metodo que habilita la columna de edicion de un Lote.
  //--------------------------------------------------------------------//
  $scope.setearValoresMod = function(lote, fecha){
    $rootScope.habilitarEdicion();
    $scope.listaTradersFiltroPorId(lote.materiaPrima.id_materiaPrima, lote.trader.id_trader);
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

  $rootScope.deshabilitarEdicion = function(){
    $rootScope.habilitar = false;
  }

  // Metodo que trae los Traders(Proveedores) filtrados por el id de materia prima
  $scope.listaTradersFiltroPorId = function(id_materiaPrima, id_trader){
    $http.get('/api/trader/' + id_materiaPrima).success(function(response){
      $scope.listaTraders = response;
      listarPaisPorTrader(response, id_trader);
    });
  }

  // Metodo que setea el valor del pais al pulsar el boton editar item
  function listarPaisPorTrader(listaTraders, id_trader){
    for (var i = 0; i < listaTraders.length; i++) {
      if (listaTraders[i].id_trader === id_trader) {
        $rootScope.paisTrader = listaTraders[i].nombrePais;
      }
    }
  }

  // Metodo que cambia el valor del pais segun el trader
  $scope.listarPais = function(lista, id_trader){
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].id_trader === id_trader) {
        $rootScope.paisTrader = lista[i].nombrePais;
      }
    }
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
    popupWin.document.write('<html><head></head><body style: width:100%; height:100%;>' + printContents + '</body></html>');
    popupWin.document.close();
  }

  $scope.enviarObservacionModal = function (sol, id_lote) {

    $scope.modalSol = sol;

    id = {id_solicitud: sol.id_solicitud, id_lote: id_lote};

    $http.post('/api/traerObservacion', id).success(function(respuesta){
      $scope.ObservacionesModal = respuesta.observacion;
    });
    $scope.id_loteObservacion = id_lote;

  };

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


  $scope.mostrarPdf = function(certificado){

          var nombreCertificado = certificado;
          $http.get('/traerCertificado/' + nombreCertificado).success(function(certificado){
            var contentType = 'application/pdf';
            var b64Data = certificado;

            var blob = b64toBlob2(b64Data, contentType);
            var blobUrl = URL.createObjectURL(blob);
            $scope.content = $sce.trustAsResourceUrl(blobUrl);
            $timeout(function() {
              printPdf();
            }, 300);
          });
  }

  function printPdf() {
    var divName = 'pdfVer';
    var printContents = document.getElementById(divName).innerHTML;
    var popupWin = window.open('', 'Certificados' ,'_blank', 'width=100%,height=100%');
    popupWin.document.open();
    popupWin.document.write('<html><head></head><body style="width=100%,height=100%">' + printContents + '</body></html>');
    popupWin.document.close();
  }

  function b64toBlob2(b64Data, contentType, sliceSize) {
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




});
