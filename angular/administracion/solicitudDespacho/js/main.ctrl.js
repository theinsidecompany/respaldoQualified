app.controller('solDespachoAdminController', function ($scope, $notify, $http, $rootScope, $timeout){

  listarSolicitudes();
  function listarSolicitudes(){

    $http.get('/api/listarSD').success(function(response){
      $scope.listaSD = response;
    })
  }


  $scope.enviarDatosVista = function(sd){

    $scope.id_solcitud = sd.id_solcitud_despacho;
    $scope.cliente = sd.cliente;
    $scope.inspectorAsignado = sd.inspector;
    $scope.fecha = sd.fecha_creacion;
    $scope.lotesSD = sd.lotes;
    $scope.chofer = sd.chofer;

  }


  $scope.enviarDatosIngreso = function(sd){
    $scope.solicicitudD = sd;
    $scope.cliente = sd.cliente;
    $scope.id_solicitud = sd.id_solicitud_despacho;
    $scope.listalotesCamion = sd.lotes;
    $scope.asignados = sd.asignados;

    var listaCamiones = [];
    for (var i = 0; i < sd.carga.length; i++) {
      listaCamiones.push(sd.carga[i]);
    }
    $scope.listaCamiones = listaCamiones;

    var stringLotes = '';
    for (var i = 0; i < sd.lotes.length; i++) {
      if (stringLotes.length < 1) {
        stringLotes = stringLotes + sd.lotes[i].lote;
      }else {
        stringLotes = stringLotes + ', ' + sd.lotes[i].lote;
      }
    }
    $scope.lotes = stringLotes;
    var stringContenedor = '';
    for (var i = 0; i < sd.lotes.length; i++) {
      if (stringContenedor.length < 1) {
        stringContenedor = stringContenedor + sd.lotes[i].contenedor;
      }else {
        stringContenedor = stringContenedor + ', ' + sd.lotes[i].lote;
      }
    }
    $scope.contenedores = stringContenedor;
    var stringBodega = '';
    for (var i = 0; i < sd.lotes.length; i++) {
      if (stringBodega.length < 1) {
        stringBodega = stringBodega + sd.lotes[i].bodega.nombreBodega;
      }else {
        stringBodega = stringBodega + ', ' + sd.lotes[i].bodega.nombreBodega;
      }
    }
    var cont = 0;
    for (var i = 0; i < sd.lotes.length; i++) {
      cont += sd.lotes[i].sellos.length;
    }
    $scope.cont = cont;
    $scope.bodegas = stringBodega;

    if (sd.asigna == undefined) {
      $scope.sellos = 0;
    }else {
      $scope.sellos = sd.asigna;
    }
    }


    $scope.modalVisualizacionCamion = function(item, index){

      $scope.modalChofer = item.chofer;
      $scope.modalPatente = item.patente;
      $scope.modalDestino = item.destino;
      $scope.modalFactura = item.factura;
      $scope.modalCheck = item.checklist;
      $scope.index = index;



      var listaPar = [];
      var listaNon = [];
      for (var i = 0; i < item.carga.length; i++) {
        if(item.carga[i].sector %2==0)
        {
          listaPar.push(item.carga[i]);
        }else{
          listaNon.push(item.carga[i]);
        }
      }

      $scope.listaPar = listaPar;
      $scope.listaNon = listaNon;
      $scope.itemCargaCamion = item;

      // console.log(item.carga);

    }


    $scope.cargaChecklist = function(modalCheck){
      $scope.checklist = modalCheck;
      $scope.denegar = true;
    }


  $scope.enviarDatosInspector = function(sd){

    $scope.solicitud= sd;

  }


  listarUsuariosFiltro();
  function listarUsuariosFiltro(){
    $http.get('/api/inspectoresAnimal').success(function(response){
      $scope.inspectores = response;
    });
  };


  $scope.AsignarInspector = function(inspector, solicitud){
    var id_inspector = inspector.id_usuario;
    var inspector = inspector.nombre;
    var id_solicitud_despacho = solicitud.id_solicitud_despacho;
    var proceso = [{"id_proceso" : 11, "descripcion" : "Inspeccion Transporte", "color" : "FFFF00", "icono" : "truck", "visible" : true}];
    var nuevo = {'inspector': inspector, 'id_inspector': id_inspector, 'id_solicitud_despacho': id_solicitud_despacho, 'proceso': proceso};
    $http.post('/api/asignaInpectorSD', nuevo).success(function(response){
      $scope.listaSD = response;
    })
  }

  $scope.enviarObservacionModal = function (sol, id_lote) {

    id = {id_solicitud: sol, id_lote: id_lote};

    $http.post('/api/traerObservacion', id).success(function(respuesta){
      $scope.ObservacionesModal = respuesta.observacion;
    });

  };


})
