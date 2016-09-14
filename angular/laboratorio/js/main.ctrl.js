app.controller('laboratorioController', function($scope, $http, $rootScope, $notify, $timeout, Upload, $sce){

  traerAvisosFiltro();
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


  //Metodo que lista las solicitudes que estan en proceso de laboraorio
  //--------------------------------------------------------------------------------------//
  listarOrdenLaboratorio();
  function listarOrdenLaboratorio(){
    var listaEstados = [];
    var fechaActual = new Date();
    var id_usuario = $rootScope.loggedUser.id_usuario;
    $http.get('/api/solicitudLaboratorio/' + id_usuario).success(function(response){
      for (var i = 0; i < response.length; i++) {
        var fechaPlanificacion = new Date(response[i].fecha_planificacion);
        if (fechaPlanificacion >= fechaActual) {
          listaEstados.push({solicitud: response[i], estado: 'En proceso'});
        }
        if (fechaPlanificacion < fechaActual) {
          listaEstados.push({solicitud: response[i], estado: 'Atrasada'});
        }
      }
      $scope.solicitudes = listaEstados;
    })
  }
  //--------------------------------------------------------------------------------------//


  //Metodo para desplegar accesos rapidos en modal vista
  //-----------------------------------------------------------------------------------//
  $scope.muestraAprueba = false;
  $scope.muestraRechaza = false;
  $scope.seleccionFlujo = function(seleccion){
    if (seleccion === 9) {
      $scope.muestraAprueba = true;
      $scope.muestraRechaza = false;
    }else if (seleccion === 10) {
      $scope.muestraRechaza = true;
      $scope.muestraAprueba = false;
    }
  }
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

    var aviso = {usuario: $rootScope.loggedUser.id_usuario, name: 'Orden de Trabajo', id: modalSol.id_orden_trabajo, online: 'mensajeEnviado', status: 'fa-envelope ', id_solicitud: modalSol.id_solicitud};
    $http.post('/api/avisos', aviso).success(function(resultado){
    })
    var aviso1 = {usuario: 1, name: 'Orden de Trabajo', id: modalSol.id_orden_trabajo, online: 'mensajeNuevo', status: 'fa-envelope ', id_solicitud: modalSol.id_solicitud};
    $http.post('/api/avisos', aviso1).success(function(respu){
    })
    var aviso2 = {usuario: modalSol.inspector, name: 'Orden de Trabajo', id: modalSol.id_orden_trabajo, online: 'mensajeNuevo', status: 'fa-envelope ', id_solicitud: modalSol.id_solicitud};
    $http.post('/api/avisos', aviso2).success(function(respu){
    })
    var aviso3 = {usuario: modalSol.cliente.id_usuario, name: 'Solicitud', id: modalSol.id_solicitud_cliente, online: 'mensajeNuevo', status: 'fa-envelope ', id_solicitud: modalSol.id_solicitud};
    $http.post('/api/avisos', aviso3).success(function(respu){
    })

    var mail = {nombre: 'Qualified', para: $rootScope.loggedUser.correo, asunto: 'Alerta Qualified', contenido: 'Mensaje enviado por ' + $rootScope.loggedUser.nombre + 'Mensaje: ' + msj };
    $http.post('/api/mail', mail).success(function(respuesta){});
    $http.get('/api/usuarioId/' + 1).success(function(respu){
      var mail = {nombre: 'Qualified', para: respu[0].correo, asunto: 'Alerta Qualified', contenido: 'Mensaje enviado por ' + $rootScope.loggedUser.nombre + ' Mensaje: ' + msj};
      $http.post('/api/mail', mail).success(function(respuesta){});
    });
    $http.get('/api/usuarioId/' + modalSol.inspector).success(function(respu){
      var mail = {nombre: 'Qualified', para: respu[0].correo, asunto: 'Alerta Qualified', contenido: 'Mensaje enviado por ' + $rootScope.loggedUser.nombre + ' Mensaje: ' + msj};
      $http.post('/api/mail', mail).success(function(respuesta){});
    });
    var mail = {nombre: 'Qualified', para: modalSol.cliente.correo, asunto: 'Alerta Qualified', contenido: 'Mensaje enviado por ' + $rootScope.loggedUser.nombre + 'Mensaje: ' + msj };
    $http.post('/api/mail', mail).success(function(respuesta){});

    $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
    $notify.setPosition('bottom-left');
    $notify.info('Notificacion', 'Mensaje Enviado');
    $rootScope.chatUsers.splice(0, 0, {name: 'Solicitud ', id: modalSol.id_solicitud, online: 'mensajeEnviado', status: 'fa-envelope '});
  };
  //------------------------------------------------------------------------------------------------------------------------------//


  //Metodo para enviar datos a modal (mensaje)
  //------------------------------------------------------------------//
  $scope.enviarMensajeModal = function (sol) {
    $scope.modalSol = sol;
    $scope.mensajesModal = sol.mensaje;
  };
  //-----------------------------------------------------------------//


  //Metodo para enviar datos a modal (Vista)
  //------------------------------------------------------------------//
  $scope.enviarVistaModal = function (sol) {
    var cont = 0;
    $scope.modalSolicitud = sol;
    $scope.modalSol = sol.id_solicitud;
    $scope.modalFecha = sol.fecha_creacion;
    $scope.modalFechaMuestreo = sol.fecha_muestreo;
    $scope.modalCliente = sol.cliente.nombre;
    $scope.listaLotesModal = sol.lote;
    $scope.modalFechaPlanificacion = sol.fecha_planificacion;
    if (sol.proceso[0].id_proceso === 3) {
      $scope.imprime = true;
    }else {
      $scope.imprime = false;
    }
    $scope.muestraAprueba = false;
    $scope.muestraRechaza = false;
    for (var i = 0; i < sol.lote.length; i++) {
      if (sol.lote[i].estadoLab !== 'vacio') {
        cont++;
      }
    }
    if (cont === sol.lote.length) {
      $scope.habilitarTodos = true;
    }
  };
  //-----------------------------------------------------------------//

  // Metodo que filtra las solicitudes por 'En proceso' y 'Atrasada'
  $scope.filtroEstados = function(estado){
    var listaEstadoAtrasada = [];
    var listaEstadoProceso = [];
    fechaActual = new Date();
    $http.get('/api/laboratorio').success(function(response){
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
        $scope.solicitudes = listaEstadoProceso;
      }
      if (estado === 'Atrasada') {
        $scope.solicitudes = listaEstadoAtrasada;
      }
      if (estado === 'Todas') {
        listarOrdenLaboratorio();
      }
    });

  }



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
  }

  function printPdf() {
    var divName = 'pdfVer';
    var printContents = document.getElementById(divName).innerHTML;
    var popupWin = window.open('', 'Certificados' ,'_blank', 'width=100%,height=100%');
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


  $scope.eliminarPdf = function(id_solicitud, id_lote, nombrePdf){

    var pdf = {id_solicitud: id_solicitud, id_lote: id_lote, nombre: nombrePdf};

    $http.delete('/eliminarPdf', pdf).success(function(response){});

    $http.post('/api/eliminarPdf', pdf).success(function(response){
      $scope.listaLotesModal = response[0].lote;
    });
    $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
    $notify.setPosition('bottom-left');
    $notify.info('Notificacion', 'Certificado Removido');
    $timeout(function() {
      listarOrdenLaboratorio();
    }, 300);


  }

  $scope.setarValorModalTodos = function(solicitud, listaLotesModal){
    var lista = listaLotesModal;
    var listaNueva = [];

    for (var i = 0; i < lista.length; i++) {
      if (lista[i].envia === true && lista[i].certificado === undefined) {
        listaNueva.push(lista[i]);
      }
    }
    $scope.listaNueva = listaNueva;
    $scope.solicitud = solicitud;
    $scope.listaLotesModalAcepta = listaLotesModal;
  }

  $scope.uploadPic = function(file, listaNueva, solicitud, nroInforme, listaLotesModalAcepta) {
    var fecha = new Date();
    file.upload = Upload.upload({
      url: '/certificado',
      data: {file: file},
    });

    file.upload.then(function (response) {
      $timeout(function () {
        file.result = response.data;
      });
    }, function (response) {
      if (response.status > 0)
      $scope.errorMsg = response.status + ': ' + response.data;
    }, function (evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });

    for (var i = 0; i < listaNueva.length; i++) {
      for (var j = 0; j < listaLotesModalAcepta.length; j++) {
        if (listaNueva[i].id_lote === listaLotesModalAcepta[j].id_lote) {
          listaLotesModalAcepta[j].nroInforme = nroInforme;
          listaLotesModalAcepta[j].certificado = file.name;
          listaLotesModalAcepta[j].envia = true;
          listaLotesModalAcepta[j].id_solicitud = solicitud.id_solicitud;
          listaLotesModalAcepta[j].estadoLab = 'aceptado';
          listaLotesModalAcepta[j].fecha_laboratorio = fecha;
        }
      }
    }

    var save = {id_solicitud: solicitud.id_solicitud, lote: listaLotesModalAcepta};
    $http.post('/api/loteCertificado', save).success(function(respu){
    })

    $scope.listaLotesModalAcepta = listaLotesModalAcepta;

    for (var i = 0; i < listaNueva.length; i++) {
            listaNueva[i].nroInforme = nroInforme;
            listaNueva[i].certificado = file.name;
        }

        $scope.listaNueva = listaNueva;
        $scope.nombreArchivos = file.name;
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.success('Notificacion', 'Certificado Enviado');
        listarOrdenLaboratorio();
  }


  $scope.enviarLotesUsuario = function(lista, solicitud, listaLotesModalAcepta, nombreArchivos){

    if (solicitud.tipoMuestreo.id_muestreo === 1) {
      if (nombreArchivos === undefined) {

                $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
                $notify.setPosition('bottom-left');
                $notify.error('Notificacion', 'Certificado no subido');

            } else {
                $scope.nombreArchivos = undefined;
                $scope.cont = 0;
                $scope.habilita = true;
                var id_usuario = solicitud.cliente.id_usuario;
                var lotes = lista;
                var nuevo = {
                    id_usuario: id_usuario,
                    lotes: lotes
                };
                $http.post('/api/lotesUsuario', nuevo).success(function(response) {})
                $timeout(function() {
                    cambiaEstado(solicitud.id_solicitud, listaLotesModalAcepta);
                }, 300);
            }
    }else {
      console.log('else');
        cambiaEstadoMuestras(solicitud, listaLotesModalAcepta);
    }

  }


    function cambiaEstado(solicitud, lotes){
      var cont = 0;
      for (var i = 0; i < lotes.length; i++) {
        if (lotes[i].certificado != undefined) {
          cont++;
        }
      }
      if (cont === lotes.length) {
        var pro = [{"id_proceso" : 11,
        "descripcion" : "Inspeccion Transporte",
        "color" : "FFFF00",
        "icono" : "truck",
        "visible" : true
      }];
        var nuevo = {
          id_solicitud: solicitud,
           proceso: pro
        };
        $http.post('/api/procesos', nuevo).success(function(response){})
        $timeout(function() {
           listarOrdenLaboratorio();
        }, 300);
      }
    }

    function cambiaEstadoMuestras(solicitud, lotes){
      var cont = 0;
      for (var i = 0; i < lotes.length; i++) {
        if (lotes[i].certificado != undefined) {
          cont++;
        }
      }
      if (cont === lotes.length) {
        var nuevo = [{"id_proceso" : 15, "descripcion" : "Finalizado", "color" : "A901DB", "icono" : "flag", "visible" : true}];
        $http.put('/api/solicitud/' + solicitud.id_solicitud, {id_orden_trabajo: solicitud.id_orden_trabajo, estado: 'Finalizado' , proceso: nuevo, inspector: solicitud.inspector, laboratorio: solicitud.laboratorio,fecha_planificacion: solicitud.fecha_planificacion}).success(function(respuesta){
        });
        $timeout(function() {
           listarOrdenLaboratorio();
        }, 300);
      }
    }




    $scope.habilita = true;
    $scope.cont = 0;

    $scope.habilitarBotonEnviar = function(item){
      if (item.envia === true) {
        $scope.cont++;
      }else {
        $scope.cont--;
        if ($scope.cont <= 0) {
          $scope.cont = 0;
        }
      }

      if ($scope.cont <= 0) {
            $scope.habilita = true;
        } else {
            $scope.habilita = false;
        }

        console.log($scope.cont);

    }

    $scope.reset = function(){
      $scope.cont = 0;
      $scope.habilita = true;
      console.log($scope.cont);
    }

  });
