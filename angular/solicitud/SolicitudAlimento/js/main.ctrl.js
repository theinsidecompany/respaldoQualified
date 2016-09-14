app.controller('SolicitudAlimentoController', function ($scope, $notify, $http, $rootScope, $location, $timeout, Upload){

  listarTipoAnalisis();
  listarSolTrader();
  listarBodegas();
  listarPaises();
  validaTrader();


  $scope.retiro = "muestreo";

  function listarSolTrader(){
    $http.get('/api/traders').success(function(response){
      $scope.listaTodoTraders = response;
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

  function validaTrader(){
    if ($rootScope.loggedUser.trader === true) {
      $scope.habilitaTrader = false;
    }else {
      $scope.habilitaTrader = true;
    }
  }
  function listarTipoAnalisis(){
    var id_tipoMuestreo = 2;
    $http.get('/api/listarTipoAnalisis/' + id_tipoMuestreo).success(function(respuesta){
      $scope.listaTipoAnalisis = respuesta;
    });
  }

  $scope.mostrarAlimentos = false;
  $scope.mostrarSubAlimentos = false;
  $scope.mostrarSubAnalisis = false;

  $scope.SeleccionAnalisis = function(analisis){

    $scope.listaSubAnalisis = [];

    if (analisis.id_tipoAnalisis === 2) {
      $scope.mostrarAlimentos = true;
      $scope.mostrarSubAlimentos = false;
      $scope.mostrarSubAnalisis = false;
      $http.get('/api/listarAlimentosRsa').success(function(respuesta){
        $scope.listaAlimentosRsa = respuesta;
      })
    }else{
      $scope.mostrarAlimentos = false;
      $scope.mostrarSubAlimentos = false;
      $scope.mostrarSubAnalisis = true;
      var id_tipoAnalisis = analisis.id_tipoAnalisis;
      $http.get('/api/listarSubAnalisis/' + id_tipoAnalisis).success(function(response){
        $scope.listaSubAnalisis = response;
      })
    }
  }

  $scope.SeleccionAlimento = function(alimento){
    $scope.listaSubAnalisis = [];
    if (alimento != 18) {
      var id_tipoAlimento = alimento;
      $scope.mostrarAlimentos = true;
      $scope.mostrarSubAlimentos = true;
      $scope.mostrarSubAnalisis = true;
      $http.get('/api/listarSubAlimentoRsa/' + id_tipoAlimento ).success(function(respuesta){
        $scope.listaSubAlimentos = respuesta;
      })
    }else {
      $scope.mostrarAlimentos = true;
      $scope.mostrarSubAlimentos = false;
      $scope.mostrarSubAnalisis = true;
      $http.get('/api/listarConserva').success(function(response){
        $scope.listaSubAnalisis = response;
      })
    }
  }

  $scope.SeleccionSubAlimento = function(sub){
    $scope.listaSubAnalisis = [];
    var id_subAlimento = sub;
    $http.get('/api/listarAnalisisSubAlimento/' + id_subAlimento).success(function(response){
      $scope.listaSubAnalisis = response;
    })
    $scope.mostrarSubAnalisis = true;
  }



  //Metodos Modal
  //-----------------------------------------------------------------------------------------------------------------//
  $scope.agregarListaAnalisis = function(tipoAnalisis, subanalisis, alimentosRSA, subAlimentos){

    var lista = [];

    if ($scope.listaAnalisis === undefined) {
      var listaAux = [];
    }else {
      var listaAux = $scope.listaAnalisis;
    }

    for (var i = 0; i < subanalisis.length; i++) {
      if (subanalisis[i].selAnalisis === true) {
        var nuevo = {nro: i, 'subAnalisis': subanalisis[i].descripcion};
        lista.push(nuevo);
      }
    }

    if (tipoAnalisis.id_tipoAnalisis === 2) {
      var nuevoAux = {'tipoAnalisis': tipoAnalisis, 'alimentosRSA':alimentosRSA, 'subAlimentos': subAlimentos, 'lista': lista, 'cantidad': lista.length};
    }else {
      var nuevoAux = {'tipoAnalisis': tipoAnalisis, 'lista': lista, 'cantidad': lista.length};
    }

    var valida = 0;
    var index;

    if (listaAux[0] === undefined) {
      listaAux.push(nuevoAux);
    }else {
      for (var i = 0; i < listaAux.length; i++) {
        if (listaAux[i].tipoAnalisis === nuevoAux.tipoAnalisis) {
          valida = i + 1;
          index = i;
          break;
        }
      }

      if (valida != 0) {
        listaAux.splice(index, 1, nuevoAux);
      }else {
        listaAux.push(nuevoAux);
      }
    }
    $scope.listaAnalisis = listaAux;
  }


  $scope.seleccionarTodo = function(lista){

    for (var i = 0; i < lista.length; i++) {
      lista[i].selAnalisis = true;
    }

  }

  $scope.desSeleccionar = function(lista){

    for (var i = 0; i < lista.length; i++) {
      lista[i].selAnalisis = false;
    }

  }



  $scope.mostrar = function(index, lista, listaSubAnalisis){
    var id = lista[index].tipoAnalisis;
    var alimento = lista[index].alimentosRSA;
    var subAlimentos = lista[index].subAlimentos;
    var lista = lista[index].lista;
    SeleccionAnalisis(id, alimento, subAlimentos, lista, listaSubAnalisis);
    $scope.$on('respuesta', function(event, response) {
      $scope.listaSubAnalisis = response;
    });

  }

  $scope.remover = function(index, lista){
    lista.splice(index, 1);
  }

  function SeleccionAnalisis(analisis, alimento, subAlimentos, lista){

    $scope.listaSubAnalisis = [];
    var respuesta;
    if (analisis.id_tipoAnalisis === 2) {
      $scope.mostrarAlimentos = true;
      $scope.mostrarSubAlimentos = true;
      $scope.mostrarSubAnalisis = true;
      $scope.alimentosRsa = alimento;
      $scope.subAlimentosRsa = subAlimentos;
      var id_subAlimento = subAlimentos;
      $http.get('/api/listarAnalisisSubAlimento/' + id_subAlimento).success(function(response){
        for (var i = 0; i < response.length; i++) {
          for (var j = 0; j < lista.length; j++) {
            if (response[i].descripcion === lista[j].subAnalisis) {
              response[i].selAnalisis = true;
            }
          }
        }
        $scope.$emit('respuesta', response);
      })
    }else{
      $scope.mostrarAlimentos = false;
      $scope.mostrarSubAlimentos = false;
      $scope.mostrarSubAnalisis = true;
      var id_tipoAnalisis = analisis.id_tipoAnalisis;
      $http.get('/api/listarSubAnalisis/' + id_tipoAnalisis).success(function(response){
        for (var i = 0; i < response.length; i++) {
          for (var j = 0; j < lista.length; j++) {
            if (response[i].descripcion === lista[j].subAnalisis) {
              response[i].selAnalisis = true;
            }
          }
        }

        $scope.$emit('respuesta', response);
      })
    }
  }
  //-----------------------------------------------------------------------------------------------------------------//

  $scope.agregarMuestreo = function(codigo, retiro, tipo, listaAnalisis){
    var id_lote;
    if ($scope.listaItems === undefined || $scope.listaItems[0] === undefined) {
      var listaItems = [];
      id_lote = 1;
    }else{
     var listaItems = $scope.listaItems;
     var index = listaItems.length -1;
     id_lote = listaItems[index].id_lote + 1;
    }

    var listaDescripcion = '';
    for (var i = 0; i < listaAnalisis.length; i++) {
      if (listaDescripcion === '') {
        listaDescripcion += listaAnalisis[i].tipoAnalisis.descripcion + '(' + listaAnalisis[i].cantidad  +  ')';
      }else {
        listaDescripcion += ' - ' + listaAnalisis[i].tipoAnalisis.descripcion + '(' + listaAnalisis[i].cantidad  +  ')';
      }
    }
    var nuevo = {'id_lote': id_lote, 'codigo': codigo, 'retiro': retiro, 'tipo': tipo, 'listaAnalisis': listaAnalisis, 'listaDescripcion': listaDescripcion};
    listaItems.push(nuevo);
    $scope.listaItems = listaItems;

    for (var i = 0; i < listaAnalisis.length; i++) {
      listaAnalisis[i].selAnalisis = false;
    }
    $scope.listaAnalisis = listaAnalisis;

  }

  $scope.eliminar = function(index, listaItems){
    listaItems.splice(index, 1);
  }

  $scope.crearSolicitud = function(fecha_muestreo, casino){
    var hoy = new Date();
    var lote = $scope.listaItems;
    var auto = {id_solicitud: 'solicitud', id_cliente: $rootScope.loggedUser.id_usuario};
    if (fecha_muestreo <= hoy) {
      $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
      $notify.setPosition('bottom-left');
      $notify.info('Notificacion', 'Fecha de muestreo no valida');
    }else if (lote.length === 0) {
      $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
      $notify.setPosition('bottom-left');
      $notify.info('Notificacion', 'La solicitud sin item(s)');
    }else {
      $http.post('/api/contador', auto).success(function(response){
        var nuevo = [{"id_proceso" : 1, "descripcion" : "Solicitud iniciada", "color" : "01DF01", "icono" : "check", "visible" : true}];
        var solicitud = {id_solicitud: response.id_solicitud, id_solicitud_cliente: response.id_solicitud_cliente, cliente: $rootScope.loggedUser, casino: casino , fecha_creacion: $scope.fecha_creacion, fecha_muestreo: fecha_muestreo, estado: 'En aprobacion', lote: lote, proceso: nuevo, tipoMuestreo: {'id_muestreo': $rootScope.idTipo, 'descripcion': $rootScope.titulo}};
        $http.post('/api/solicitud', solicitud).success(function(respuesta){
          $rootScope.$emit("identificadorSolicitud", respuesta);
        });

        $rootScope.$on("identificadorSolicitud", function(event, solicitud){
          $scope.valida = true;
          var mail = {nombre: 'Qualified', para: $rootScope.loggedUser.correo, asunto: 'Alerta Qualified', contenido: 'Solicitud ' + solicitud.id_solicitud + ' creada por ' + $rootScope.loggedUser.nombre};
          $http.post('/api/mail', mail).success(function(respuesta){});
          $http.get('/api/usuarioId/' + 1).success(function(respu){
            var mail = {nombre: 'Qualified', para: respu[0].correo, asunto: 'Alerta Qualified', contenido: 'Solicitud ' + solicitud.id_solicitud + ' creada por ' + $rootScope.loggedUser.nombre};
            $http.post('/api/mail', mail).success(function(respuesta){});
          });
        });
      });

      $timeout(function() {
        $scope.listaItems = '';
        $location.path("/busquedaSolicitudCliente");
      }, 500);
    }
  }





  //Metodos para datepicker
  //-----------------------------------------------------------------------------------------------------------------//
  $scope.fecha_creacion = new Date();
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

  //-----------------------------------------------------------------------------------------------------------------//


});
