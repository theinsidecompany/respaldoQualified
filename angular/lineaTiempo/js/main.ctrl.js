app.controller('lineaController', function($scope, $http, $rootScope , $notify){

  traerSolicitudesFiltro();
  function traerSolicitudesFiltro(){
    var lista = [];
    var id_usuario = $rootScope.loggedUser.id_usuario;
    $http.get('/api/solicitud/' + id_usuario).success(function(response){
      for (var i = 0; i < response.length; i++) {
        if (response[i].tipoMuestreo.id_muestreo === 1) {
          for (var j = 0; j < response[i].lote.length; j++) {
            response[i].lote[j].id_solicitud = response[i].id_solicitud;
          }
          if (lista[0] === undefined) {
            lista = response[i].lote;
          }else {
            lista.push(response[i].lote);
          }
        }
      }
      $scope.listaLotes = lista;
    });
  };

  $scope.color1 = 'default';
  $scope.color2 = 'default';
  $scope.color3 = 'default';
  $scope.color4 = 'default';
  $scope.color5 = 'default';
  $scope.color6 = 'default';
  $scope.color7 = 'default';
  $scope.color8 = 'default';

  $scope.lienaTiempoDatos = function(item, lista, index){
    $scope.fecha_creacion = item.fecha_creacion ;
    $scope.fecha_planificacion = item.fecha_planificacion ;
    $scope.fecha_fin_muestreo = item.fecha_fin_muestreo ;
    $scope.fecha_inspector_envia = item.fecha_inspector_envia ;
    $scope.fecha_laboratorio = item.fecha_laboratorio ;
    $scope.fecha_aceptacion = item.fecha_aceptacion ;
    $scope.fecha_listo_transporte = item.fecha_listo_transporte ;
    $scope.fecha_recepcion = item.fecha_recepcion ;

    for (var i = 0; i < lista.length; i++) {
      if (i === index) {
        lista[i].fondo = 'success';
      }else {
        lista[i].fondo = 'default';
      }
    }

    $scope.listaLotes = lista;

    if (item.fecha_creacion != undefined && item.fecha_planificacion == undefined) {
      $scope.color1 = 'successs';
      $scope.color2 = 'default';
      $scope.color3 = 'default';
      $scope.color4 = 'default';
      $scope.color5 = 'default';
      $scope.color6 = 'default';
      $scope.color7 = 'default';
      $scope.color8 = 'default';
    }else if (item.fecha_planificacion != undefined && item.fecha_fin_muestreo == undefined) {
      $scope.color1 = 'success';
      $scope.color2 = 'success';
      $scope.color3 = 'default';
      $scope.color4 = 'default';
      $scope.color5 = 'default';
      $scope.color6 = 'default';
      $scope.color7 = 'default';
      $scope.color8 = 'default';
    }else if (item.fecha_fin_muestreo != undefined && item.fecha_inspector_envia == undefined) {
      $scope.color1 = 'success';
      $scope.color2 = 'success';
      $scope.color3 = 'success';
      $scope.color4 = 'default';
      $scope.color5 = 'default';
      $scope.color6 = 'default';
      $scope.color7 = 'default';
      $scope.color8 = 'default';
    }else if (item.fecha_inspector_envia != undefined && item.fecha_laboratorio == undefined) {
      $scope.color1 = 'success';
      $scope.color2 = 'success';
      $scope.color3 = 'success';
      $scope.color4 = 'success';
      $scope.color5 = 'default';
      $scope.color6 = 'default';
      $scope.color7 = 'default';
      $scope.color8 = 'default';
    }else if (item.fecha_laboratorio != undefined && item.fecha_aceptacion == undefined) {
      $scope.color1 = 'success';
      $scope.color2 = 'success';
      $scope.color3 = 'success';
      $scope.color4 = 'success';
      $scope.color5 = 'success';
      $scope.color6 = 'default';
      $scope.color7 = 'default';
      $scope.color8 = 'default';
    }else if (item.fecha_aceptacion != undefined && item.fecha_listo_transporte == undefined) {
      $scope.color1 = 'success';
      $scope.color2 = 'success';
      $scope.color3 = 'success';
      $scope.color4 = 'success';
      $scope.color5 = 'success';
      $scope.color6 = 'success';
      $scope.color7 = 'default';
      $scope.color8 = 'default';
    }else if (item.fecha_listo_transporte != undefined && item.fecha_recepcion == undefined) {
      $scope.color1 = 'success';
      $scope.color2 = 'success';
      $scope.color3 = 'success';
      $scope.color4 = 'success';
      $scope.color5 = 'success';
      $scope.color6 = 'success';
      $scope.color7 = 'success';
      $scope.color8 = 'default';
    }else if (item.fecha_recepcion != undefined) {
      $scope.color1 = 'success';
      $scope.color2 = 'success';
      $scope.color3 = 'success';
      $scope.color4 = 'success';
      $scope.color5 = 'success';
      $scope.color6 = 'success';
      $scope.color7 = 'success';
      $scope.color8 = 'success';
    }





  }


  $scope.enviarObservacionModal = function (sol, id_lote) {

    id = {id_solicitud: sol, id_lote: id_lote};

    $http.post('/api/traerObservacion', id).success(function(respuesta){
      $rootScope.ObservacionesModal = respuesta.observacion;
    });
    $rootScope.id_loteObservacion = id_lote;

  };

  $scope.filtroFecha = function(desde, hasta, lista){
    var fecha1 = desde.getTime();
    var fecha2 = hasta.getTime();
    var listaNueva = [];
    var aux;

    if (desde > hasta) {
      $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
      $notify.setPosition('bottom-left');
      $notify.error('Notificacion', 'Fecha desde no debe ser mayor a fecha hasta');
    }else {

      for (var i = 0; i < lista.length; i++) {
        aux = Date.parse(lista[i].fecha_creacion);
        if (aux >= fecha1 && aux <= fecha2) {
          listaNueva.push(lista[i]);
        }
      }
      $scope.listaLotes = listaNueva;
    }

  }


  //Metodos para datepicker
  //-----------------------------------------------------------------------------------------------------------------//
  $scope.fecha_desde = new Date();
  $scope.fecha_hasta = new Date();
  $scope.today = function() {
    $scope.fecha_desde = new Date();
    $scope.fecha_hasta = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.fecha_desde = null;
    $scope.fecha_hasta = null;
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
