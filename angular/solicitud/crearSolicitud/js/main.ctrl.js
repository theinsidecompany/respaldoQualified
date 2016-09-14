app.controller('crearSolicitudController', function ($scope, $notify, $http, $rootScope, $location, $timeout, Upload){

  $rootScope.listaLotes = [];
  $rootScope.listaLote = [];
  $scope.nombreCliente = $rootScope.loggedUser.nombre;
  $scope.fecha_creacion = new Date();
  $scope.habilitaTrader = false;
  $rootScope.guardar = true;
  $scope.retiro = "muestreo";
  //Trae los datos de los parametros de entrada a la pantalla desde la base de datos
  //--------------------------------------------------------------------------------//
  listarBodegas();
  listarMateriaPrima();
  listarPaises();
  listarMuestreo();
  listarTraders();
  listarSolTrader();

  function listarMuestreo(){
    $http.get('/api/tipoMuestreo').success(function(response){
      $scope.listaMuestreo = response;
    });
  }

  function listarSolTrader(){
    $http.get('/api/traders').success(function(response){
      $scope.listaTodoTraders = response;
    });
  }

  function listarTraders(){
    $http.get('/api/trader').success(function(response){
      $scope.listaTraders = response;
    });
  }

  function listarMateriaPrima(){
    var id_materia = 1;
    $http.get('/api/materiaPrima/' + id_materia).success(function(response){
      $scope.listarMateriaPrima = response;
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

  validaTrader();
  function validaTrader(){
    if ($rootScope.loggedUser.trader === true) {
      $scope.habilitaTrader = false;
    }else {
      $scope.habilitaTrader = true;
    }
  }

  //--------------------------------------------------------------------------------//


  //Este metodo agrega una solicitud a la base de datos, contiene el metodo agregarLote() el cual añade un arreglo de lotes a la solicitud.
  //----------------------------------------------------------------------------------------------------------------------------------------------//
  $scope.agregarSolicitud = function (fecha_muestreo){

    var hoy = new Date();
    var lote = $rootScope.listaLotes;
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

      for (var i = 0; i < lote.length; i++) {
        lote[i].fecha_creacion = hoy;
      }

      $http.post('/api/contador', auto).success(function(response){
        var nuevo = [{"id_proceso" : 1, "descripcion" : "Solicitud iniciada", "color" : "01DF01", "icono" : "check", "visible" : true}];
        var solicitud = {id_solicitud: response.id_solicitud, id_solicitud_cliente: response.id_solicitud_cliente, cliente: $rootScope.loggedUser, fecha_creacion: $scope.fecha_creacion, fecha_muestreo: fecha_muestreo, estado: 'En aprobacion', lote: lote, proceso: nuevo, tipoMuestreo: {'id_muestreo': $rootScope.idTipo, 'descripcion': $rootScope.titulo }};
        $http.post('/api/solicitud', solicitud).success(function(respuesta){
          $rootScope.$emit("identificadorSolicitud", respuesta);
        });

        var aviso = {usuario: $rootScope.loggedUser.id_usuario, name: 'Solicitud', id: solicitud.id_solicitud_cliente, online: 'nuevaSolicitud', status: 'fa-file ', id_solicitud: solicitud.id_solicitud};
        $http.post('/api/avisos', aviso).success(function(respu){
          $rootScope.chatUsers = respu;
        })
        var aviso = {usuario: 1, name: 'Solicitud', id: solicitud.id_solicitud, online: 'nuevaSolicitud', status: 'fa-file ', id_solicitud: solicitud.id_solicitud};
        $http.post('/api/avisos', aviso).success(function(respu){
        })
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
      $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
      $notify.setPosition('bottom-left');
      $notify.success('Notificacion', 'Solicitud Generada');
      $scope.clear();
      $rootScope.listaLotes = [];
      $rootScope.listaLote = [];
      $rootScope.guardar = true;
      $timeout(function() {
        $location.path("/busquedaSolicitudCliente");
      }, 500);
    }
  };
  //----------------------------------------------------------------------------------------------------------------------------------------------//

  //Metodos para la manipulacion de lote en modal vista
  //----------------------------------------------------------------------------------------------------------------------------------------------//
  //Este metodo Elimina un indice en el arreglo de lotes el cual se guardara con la soliciud.
  //-----------------------------------------------------------------------------------------------------------------//
  // $scope.removerLote = function (id){
  //   var listaLote = $rootScope.listaLote;
  //   for (var i = 0; i < listaLote.length; i++) {
  //     if (listaLote[i].id_lote === id) {
  //       listaLote.splice(i,1);
  //     }
  //   }
  //   $rootScope.listaLote = listaLote;
  //   $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
  //   $notify.setPosition('bottom-left');
  //   $notify.error('Notificacion', 'Item Removido');
  // };
  //-----------------------------------------------------------------------------------------------------------------//

  //----------------------------------------------------------------------------------------------------------------------------------------------//

  //Metodos para datepicker
  //-----------------------------------------------------------------------------------------------------------------//
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

  $scope.uploadPic = function(file) {

    $rootScope.nombreFile = file.name;

    file.upload = Upload.upload({
      url: '/archivoExcel',
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

    $http.get('/api/traerExcel/' + file.name).success(function(respuesta){
      var lista = $rootScope.listaLotes;
      var cont = $rootScope.listaLotes.length;

      if (lista.length === 0) {
        for (var i = 0; i < respuesta.length; i++) {
          var nuevo = {bodega: {nombreBodega: respuesta[i].bodega}, id_lote: Number(respuesta[i].nro), materiaPrima: {nombreMateriaPrima: respuesta[i].materiaPrima}, trader: {nombreTrader: respuesta[i].proveedor}, paisTrader: {nombrePais: respuesta[i].origen}, lote: respuesta[i].lote, bultos: respuesta[i].bultos, cantidad: respuesta[i].cantidad, contenedor: respuesta[i].contenedor, tipoMuestreo:{descripcion: respuesta[i].tipoMuestreo}, estadoLab: 'vacio'};
          lista.push(nuevo);
        }
        $rootScope.listaLotes = lista;
      }else{
        for (var i = 0; i < respuesta.length; i++) {
          var nuevo = {bodega: {nombreBodega: respuesta[i].bodega}, id_lote: (Number(respuesta[i].nro) + cont), materiaPrima: {nombreMateriaPrima: respuesta[i].materiaPrima}, trader: {nombreTrader: respuesta[i].proveedor}, paisTrader: {nombrePais: respuesta[i].origen}, lote: respuesta[i].lote, bultos: respuesta[i].bultos, cantidad: respuesta[i].cantidad, contenedor: respuesta[i].contenedor, tipoMuestreo:{descripcion: respuesta[i].tipoMuestreo}, estadoLab: 'vacio'};
          lista.push(nuevo);
        }
        $rootScope.listaLotes = lista;
      }
    });

  }

  $scope.removerLote = function(id_lote){

    var lista = $rootScope.listaLotes;
    var nuevaLista = [];

    for (var i = 0; i < lista.length; i++) {
      if (id_lote !== lista[i].id_lote) {
        nuevaLista.push(lista[i]);
      }
    }

    $rootScope.listaLotes = nuevaLista;
    $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
    $notify.setPosition('bottom-left');
    $notify.error('Notificacion', 'Item Removido');
  }

});


app.controller('modalLoteCtrl', function($scope, $rootScope){

  //Este metodo crea un arreglo de lotes el cual se guardara con la soliciud.
  //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
  $scope.agregarLote = function (materiaPrima, trader, pais, lote, bultos, cantidad, contenedor, bodega, traders, retiro, modalProcedencia){

    var id_lote;
    var listaNueva = $rootScope.listaLotes;
    if ($rootScope.listaLotes === undefined) {
      id_lote = 1;
    }else{
      id_lote = $rootScope.listaLotes.length + 1;

      for (var i = 0; i < listaNueva.length; i++) {
        id_lote = parseInt(listaNueva[i].id_lote) + 1;
      }

    }
    if (traders !== undefined) {
        var traders = {'id_trader': traders.id_usuario, 'nombre': traders.nombre};
    }else {
      var traders = '';
    }


    var nuevo = {'id_lote': id_lote, 'materiaPrima': materiaPrima, 'trader': trader, 'paisTrader': pais, 'lote': lote , 'bultos': bultos , 'cantidad': cantidad , 'contenedor': contenedor, 'bodega': bodega,
     'estadoLab': 'vacio', 'traders': traders, 'retiro': retiro, 'procedencia': modalProcedencia, tipoMuestreo: {'id_tipoMuestreo': 1, 'descripcion': "Harina"}};
    listaNueva.push(nuevo);
    $scope.materiaPrima = '';
    $scope.trader = '';
    $scope.pais = '';
    $scope.modalLote = '';
    $scope.modalBulto = '';
    $scope.modalCantidad = '';
    $scope.modalContenedor = '';
    $scope.modalId = '';
    $scope.modalProcedencia = '';
    $scope.bodega = '';
    $scope.modalTipo = '';
    $scope.traders = '';
    $rootScope.guardar = false;
    $rootScope.listaLotes = listaNueva;
  };


  //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

});
