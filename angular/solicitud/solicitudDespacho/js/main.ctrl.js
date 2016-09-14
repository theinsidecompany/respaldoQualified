app.controller('solDespachoController', function ($scope, $notify, $http, $rootScope, $timeout){

  listarSolicitudes();
  function listarSolicitudes(){
    var id_cliente = $rootScope.loggedUser.id_usuario;
    $http.get('/api/listarSDFiltro/' + id_cliente).success(function(response){
      $scope.listaSD = response;
    })
  }


  $scope.enviarDatosModalVista = function(sol){

    $scope.id_sol = sol.id_solicitud_despacho_cliente;
    $scope.fecha = sol.fecha_creacion;
    $scope.listaLotesSD = sol.lotes;
    $scope.cliente = sol.cliente;


  }

  $scope.enviarObservacionModal = function (sol, id_lote) {

    id = {id_solicitud: sol, id_lote: id_lote};

    $http.post('/api/traerObservacion', id).success(function(respuesta){
      $scope.ObservacionesModal = respuesta.observacion;
    });

  };


  $scope.enviarRecepcion = function(solicitud){

    var nuevo = [{"id_proceso" : 15, "descripcion" : "Finalizada", "color" : "A901DB", "icono" : "flag", "visible" : true}];
    var elemento = {'id_solicitud_despacho': solicitud.id_solicitud_despacho, 'id_inspector': solicitud.id_inspector, 'proceso': nuevo};
    $http.post('/api/entregar', elemento).success(function(response){
    })

    for (var i = 0; i < solicitud.lotes.length; i++) {
      var aux = {id_solicitud: solicitud.lotes[i].id_solicitud, id_lote: solicitud.lotes[i].id_lote};
      $http.post('/api/setearFinalizado').success(function(respuesta){});
    }

    var solicitud = {solicitud: solicitud};
    $http.post('/api/fin', solicitud).success(function(response){
    })

    listarSolicitudes();

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



})
