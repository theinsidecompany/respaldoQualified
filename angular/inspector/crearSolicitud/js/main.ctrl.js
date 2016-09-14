app.controller('crearSolicitudInspectorController',function ($scope, $http ,$rootScope , $notify, $timeout) {

  $scope.habilitaHarina = false;
  $scope.habilitaMuestreo = false;
  $scope.habilitaAlimento = false;
  $scope.habilitaEnvio = false;

  $scope.muestraCrear = false;

  //Metodos Para Analisis de agua.
  //----------------------------------------------------------------------------------------------------------------------//
  $scope.agregarListaAnalisisAgua = function(tipoAnalisis, listaTipoAnalisis){

    var lista = [];

    if ($scope.listaAnalisis === undefined) {
      var listaAux = [];
    }else {
      var listaAux = $scope.listaAnalisis;
    }

    for (var i = 0; i < listaTipoAnalisis.length; i++) {
      if (listaTipoAnalisis[i].selAnalisis === true) {
        var nuevo = {nro: i, 'subAnalisis': listaTipoAnalisis[i].descripcion};
        lista.push(nuevo);
      }
    }

    var nuevoAux = {'tipoAnalisis': tipoAnalisis.descripcion, 'lista': lista, 'cantidad': lista.length};
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

    if (listaAux.length > 0) {
      $scope.muestraCrear = true;
    }

  }


  $scope.remover = function(index, lista){
    lista.splice(index, 1);

    if (lista.length <= 0) {
      $scope.muestraCrear = false;
    }

  }


  $scope.agregarMuestreoAgua = function(codigo, retiro, tipoMuestra, listaAnalisis){



    if (listaAnalisis.length <= 0) {

      $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
      $notify.setPosition('bottom-left');
      $notify.info('Notificacion', 'Sin Seleeccion de Analisis');

    }else{
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
          listaDescripcion += listaAnalisis[i].tipoAnalisis + '(' + listaAnalisis[i].cantidad + ')';
        }else if(listaDescripcion !== ''){
          listaDescripcion +=  " - " + listaAnalisis[i].tipoAnalisis + '(' + listaAnalisis[i].cantidad + ')';
        }
      }

      var nuevo = {'id_lote': id_lote, 'codigo': codigo, 'retiro': retiro, 'tipo': tipoMuestra, 'listaAnalisis': listaAnalisis, 'listaDescripcion': listaDescripcion};
      listaItems.push(nuevo);
      $scope.listaItems = listaItems;

      $rootScope.limpiarMuestreo();
      $rootScope.mostrarTablas(4);
    }




  }
  //----------------------------------------------------------------------------------------------------------------------//



  $scope.habilitarBotonMuestreo = function(valor){

    if (valor === null) {
      $scope.habilitaHarina = false;
      $scope.habilitaMuestreo = false;
      $scope.habilitaAlimento = false;
      $scope.habilitaEnvio = false;
    }else{
      var id_tipoMuerstreo = valor.id_tipoMuestreo;
    }

    if (id_tipoMuerstreo === 1) {
      $scope.habilitaHarina = true;
      $scope.habilitaMuestreo = false;
      $scope.habilitaAlimento = false;
      $scope.habilitaEnvio = true;
    }else if (id_tipoMuerstreo === 2) {
      $scope.habilitaHarina = false;
      $scope.habilitaMuestreo = false;
      $scope.habilitaAlimento = true;
      $scope.habilitaEnvio = true;
    }else{
      $scope.habilitaHarina = false;
      $scope.habilitaMuestreo = true;
      $scope.habilitaAlimento = false;
      $scope.habilitaEnvio = true;
    }

  }

  // -----------------------------------------------------------------------------------------



  $scope.mostrarCasino = false;
  function muestraCasino(valor){
    if (valor != 0) {
      $scope.mostrarCasino = true;
    }else {
      $scope.mostrarCasino = false;
    }
  }

  $scope.cambioCliente = function(usuario){
    $http.get('/api/listarTipoMuestreo').success(function(response){
      var lista = [];
      var listaM = [];
      if (usuario.animal) {
        lista.push(1);
        muestraCasino(0);
      }
      if (usuario.alimento) {
        lista.push(2);
        muestraCasino(1);
      }
      if (usuario.agua) {
        lista.push(3);
        muestraCasino(1);
      }


      for (var i = 0; i < lista.length; i++) {
        for (var j = 0; j < response.length; j++) {
          if (lista[i] === response[j].seleccion) {
            listaM.push(response[j]);
          }
        }
      }
      validaTrader(usuario);
      $scope.listaMuestreo = listaM;
    });
  }

  //Funcion que trae los clientes de la base de datos.
  //-----------------------------------------------------------------------------------//
  listarUsuarios();
  function listarUsuarios(){
    var id_perfil = 2;
    var lista = [];
    $http.get('/api/usuarios/' + id_perfil ).success(function(response){

      if ($rootScope. loggedUser.animal == true) {
        for (var i = 0; i < response.length; i++) {
          if (response[i].animal == true) {
            lista.push(response[i]);
          }
        }
      }else {
        for (var i = 0; i < response.length; i++) {
          if (response[i].animal == false) {
            lista.push(response[i]);
          }
        }
      }

      $scope.listarUsuarios = lista;

    });
  };
  //-----------------------------------------------------------------------------------//

  function validaTrader(usuario){
    if (usuario.trader === true) {
      $scope.habilitaTrader = false;
    }else {
      $scope.habilitaTrader = true;
    }
  }

  // Metodo Modal Harina
  // --------------------------------------------------------------------------------------
  $scope.cargarModalHarina = function(){

    $scope.retiro = "muestreo";

    $http.get('/api/traders').success(function(trader){
      $scope.listaTodoTraders = trader;
    });

    $http.get('/api/trader').success(function(proveedor){
      $scope.listaTraders = proveedor;
    });

    var id_materia = 1;
    $http.get('/api/materiaPrima/' + id_materia).success(function(materia){
      $scope.listarMateriaPrima = materia;
    });

    $http.get('/api/traerBodega').success(function(bodega){
      $scope.listarBodegas = bodega;
    });

    $http.get('/api/pais').success(function(pais){
      $scope.listarPaises = pais;
    });

  }

  $scope.listaLotes = [];
  $scope.habilitarSelector = false;

  //Este metodo crea un arreglo de lotes el cual se guardara con la soliciud.
  //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
  $scope.agregarLote = function (materiaPrima, trader, pais, lote, bultos, cantidad, contenedor, bodega, traders, retiro, modalProcedencia, lista){

    var id_lote;
    var listaLotes;

    if (lista.length === 0) {
      listaNueva = [];
      id_lote = 1;
    }else{
      listaNueva = lista;
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

    $scope.listaLotes = listaNueva;
    $scope.habilitarSelector = true;

    $rootScope.limpiarCamposModal();

  };


  $scope.agregarMuestreo = function(codigo, retiro, tipoMuestra, traders, pais, bodega, encargadoBodega, procedencia, toneladas, listaTipoAnalisis){
    var id_lote;
    if ($scope.listaItems === undefined || $scope.listaItems[0] === undefined) {
      var listaItems = [];
      id_lote = 1;
    }else{
      var listaItems = $scope.listaItems;
      var index = listaItems.length -1;
      id_lote = listaItems[index].id_lote + 1;
    }

    var nuevo = {'id_lote': id_lote, 'codigo': codigo, 'retiro': retiro, 'tipo': tipoMuestra, 'traders': traders, 'origen': pais, 'bodega': bodega, 'encargadoBodega': encargadoBodega, 'procedencia': procedencia, 'toneladas': toneladas, 'listaAnalisis': listaTipoAnalisis};
    listaItems.push(nuevo);
    $scope.listaItems = listaItems;
    for (var i = 0; i < listaTipoAnalisis.length; i++) {
      listaTipoAnalisis[i].selAnalisis = false;
    }
    $scope.listaTipoAnalisis = listaTipoAnalisis;
    $rootScope.limpiarModalMuestreo();
  }

  $scope.agregarGranos = function( retiro, traders, pais, bodega, encargadoBodega, procedencia, toneladas, materiaPrima, trader, temperatura, seleccionAlmacenaje){
    var id_lote;
    if ($scope.listaItems === undefined || $scope.listaItems[0] === undefined) {
      var listaItems = [];
      id_lote = 1;
    }else{
      var listaItems = $scope.listaItems;
      var index = listaItems.length - 1;
      id_lote = listaItems[index].id_lote + 1;
    }

    var nuevo = {'id_lote': id_lote, 'retiro': retiro, 'traders': traders, 'origen': pais, 'bodega': bodega, 'encargadoBodega': encargadoBodega, 'procedencia': procedencia, 'toneladas': toneladas, 'materiaPrima': materiaPrima, 'trader': trader, 'temperatura': temperatura, 'seleccionAlmacenaje': seleccionAlmacenaje};
    listaItems.push(nuevo);
    $scope.listaItems = listaItems;
    $rootScope.limpiarModalGranos();
  }

  $scope.agregarAceite = function(retiro, composito, traders, pais, bodega, encargadoBodega, procedencia, toneladas, tipoAceite, fabricante){
    var id_lote;
    if ($scope.listaItems === undefined || $scope.listaItems[0] === undefined) {
      var listaItems = [];
      id_lote = 1;
    }else{
      var listaItems = $scope.listaItems;
      var index = listaItems.length - 1;
      id_lote = listaItems[index].id_lote + 1;
    }

    if (composito) {
      estrato = null;
    }else {
      $scope.valorSuperior;
      $scope.valorMedio;
      $scope.valorInferior;
      var nuevoEstrato = [{'estrato': "Superior", 'seleccion': $scope.valorSuperior}, {'estrato': "Medio", 'seleccion': $scope.valorMedio}, {'estrato': "Inferior", 'seleccion': $scope.valorInferior}];
    }

    var nuevo = {'id_lote': id_lote, 'retiro': retiro, 'composito': composito, 'estrato': nuevoEstrato, 'traders': traders, 'origen': pais, 'bodega': bodega, 'encargadoBodega': encargadoBodega, 'procedencia': procedencia, 'toneladas': toneladas, 'tipoAceite': tipoAceite, 'fabricante': fabricante};
    listaItems.push(nuevo);
    $scope.listaItems = listaItems;
    $rootScope.limpiarCamposModalAceite();

  }


  $scope.agregarAlimento = function(codigo, retiro, tipo, listaAnalisis){
    var id_lote;
    if ($scope.listaItems === undefined || $scope.listaItems[0] === undefined) {
      var listaItems = [];
      id_lote = 1;
    }else{
      var listaItems = $scope.listaItems;
      var index = listaItems.length -1;
      id_lote = listaItems[index].id_lote + 1;
    }
    var nuevo = {'id_lote': id_lote, 'codigo': codigo, 'retiro': retiro, 'tipo': tipo, 'listaAnalisis': listaAnalisis};
    listaItems.push(nuevo);
    $scope.listaItems = listaItems;

    for (var i = 0; i < listaAnalisis.length; i++) {
      listaAnalisis[i].selAnalisis = false;
    }
    $scope.listaAnalisis = listaAnalisis;
    $rootScope.limpiarModalAlimentos();
  }

  $scope.eliminar = function(index, listaItems){
    listaItems.splice(index, 1);
  }



  $scope.removerLote = function(id_lote, lista){

    var lista = lista;
    var nuevaLista = [];

    for (var i = 0; i < lista.length; i++) {
      if (id_lote !== lista[i].id_lote) {
        nuevaLista.push(lista[i]);
      }
    }

    $scope.listaLotes = nuevaLista;

    if (nuevaLista.length === 0) {
      $scope.habilitarSelector = false;
    }else{
      $scope.habilitarSelector = true;
    }

    $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
    $notify.setPosition('bottom-left');
    $notify.error('Notificacion', 'Item Removido');
  }



  $scope.agregarSolicitud = function (fecha_muestreo, lista, cliente, tipo){

    var hoy = new Date();
    var lote = lista;
    var auto = {id_solicitud: 'solicitud', id_cliente: cliente.id_usuario};

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
        var solicitud = {id_solicitud: response.id_solicitud, id_solicitud_cliente: response.id_solicitud_cliente, cliente: cliente, fecha_creacion: $scope.fecha_creacion, fecha_muestreo: fecha_muestreo, estado: 'En aprobacion', lote: lote, proceso: nuevo, tipoMuestreo: {'id_muestreo': tipo.id_tipoMuestreo, 'descripcion': tipo.descripcion }};
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
      $rootScope.listaLotes = [];
      $rootScope.listaLote = [];
    }
  };


















  //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
















  // ----------------------------------------------------------------------------------
    $scope.mostrarAceite = false;
    $scope.mostrarGranos = false;
    $scope.mostrarAnalisis = false;
    $scope.mostrarMuestreo = false;
    $scope.mostrarTipo = false;
    $scope.mostrarAgua = false;
      function habilitarCampos(valor){

        if (valor === null) {
          $scope.mostrarAceite = false;
          $scope.mostrarGranos = false;
          $scope.mostrarAnalisis = false;
          $scope.mostrarMuestreo = false;
          $scope.mostrarTipo = false;
        }else{
          var idTipo = valor.id_tipoMuestreo;
        }


      if (idTipo === 7 || idTipo === 8 || idTipo === 6) {
        $scope.mostrarAnalisis = false;
      }else {
        $scope.mostrarAnalisis = true;
        $scope.mostrarMuestreo = true;
        $scope.mostrarTipo = true;
      }

      if (idTipo === 7) {
        $scope.mostrarAceite = true;
        $scope.mostrarGranos = false;
        $scope.mostrarAgua = false;
      }else if (idTipo === 8) {
        $scope.mostrarAceite = false;
        $scope.mostrarGranos = true;
        $scope.mostrarAgua = false;
      }else if (idTipo === 6) {
        $scope.mostrarAceite = false;
        $scope.mostrarGranos = false;
        $scope.mostrarTipo = true;
        $scope.mostrarAgua = true;
      }else {
        $scope.mostrarAceite = false;
        $scope.mostrarGranos = false;
        $scope.mostrarTipo = true;
        $scope.mostrarAgua = false;
      }

      $scope.colorSuperior = "warning";
      $scope.colorMedio = "warning";
      $scope.colorInferior = "warning";
      $scope.valorSuperior = false;
      $scope.valorMedio = false;
      $scope.valorInferior = false;

    }

  //  ------------------------------------------------------------------------------

  $scope.retiroAnimal = "muestreo";

  $scope.compositoSeleccion =  function(){
    $scope.colorSuperior = "warning";
    $scope.colorMedio = "warning";
    $scope.colorInferior = "warning";
    $scope.valorSuperior = false;
    $scope.valorMedio = false;
    $scope.valorInferior = false;
  }

  $scope.colorSuperior = "warning";
  $scope.colorMedio = "warning";
  $scope.colorInferior = "warning";
  $scope.valorSuperior = false;
  $scope.valorMedio = false;
  $scope.valorInferior = false;

  $scope.seleccionarSuperior = function(){

    if ($scope.colorSuperior === "success") {
      $scope.colorSuperior = "warning";
      $scope.valorSuperior = false;
    }else {
      $scope.colorSuperior = "success";
      $scope.valorSuperior = true;
    }
  }

  $scope.seleccionarMedio = function(){
    if ($scope.colorMedio === "success") {
      $scope.colorMedio = "warning";
      $scope.valorMedio = false;
    }else {
      $scope.colorMedio = "success"
      $scope.valorMedio = true;
    }
  }

  $scope.seleccionarInferior = function(){
    if ($scope.colorInferior === "success") {
      $scope.colorInferior = "warning";
      $scope.valorInferior = false;
    }else {
      $scope.colorInferior = "success"
      $scope.valorInferior = true;
    }
  }

  // Metodo Modal Muestreo
  // ----------------------------------------------------------------------------------

  $scope.cargarModalMuestreo = function(valor){

    habilitarCampos(valor);
    $scope.retiro = "muestreo";
    $scope.listaTipoAnalisis = [];

    $http.get('/api/traders').success(function(trader){
      $scope.listaTodoTraders = trader;
    });

    $http.get('/api/traerBodega').success(function(bodega){
      $scope.listarBodegas = bodega;
    });

    $http.get('/api/pais').success(function(pais){
      $scope.listarPaises = pais;
    });

    var id_materia = 2;
    $http.get('/api/materiaPrima/' + id_materia).success(function(materia){
      $scope.listarMateriaPrima = materia;
    });

    $http.get('/api/trader').success(function(proveedor){
      $scope.listaTraders = proveedor;
    });

    var id_tipoMuestreo = valor.id_tipoMuestreo;
    cargarLista(id_tipoMuestreo);
  }


  function cargarLista(valor){
    var id_tipoMuestreo = valor;
    if (id_tipoMuestreo != 6) {
      $http.get('/api/listarTipoAnalisis/' + id_tipoMuestreo).success(function(response){
        $scope.listaTipoAnalisis = response;
      });
    }else {
      $http.get('/api/listarTipoAnalisis/' + id_tipoMuestreo).success(function(response){
        $scope.listaAnalisisAgua = response;
      });
    }

  };

  $scope.seleccionAgua = function(agua){
    var agua = agua.id_tipoAnalisis;
    if (agua === 7) {
      $scope.mostrarAnalisis = true;
      $http.get('/api/microAgua').success(function(response){
        $scope.listaTipoAnalisis = response;
      })
    }else if (agua === 8) {
      $scope.mostrarAnalisis = true;
      $http.get('/api/traerNCH409').success(function(response){
        $scope.listaTipoAnalisis = response;
      })
    }else if (agua === 9) {
      $scope.mostrarAnalisis = true;
      $http.get('/api/traerNCH1333').success(function(response){
        $scope.listaTipoAnalisis = response;
      })
    }
  }

  // -----------------------------------------------------------------------------------

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


  // Metodo Modal Alimento
  // ---------------------------------------------------------------------------

  $scope.cargarModalAlimento = function(valor){

    var id_tipoMuestreo = valor.id_tipoMuestreo;
    $scope.retiro = "muestreo";
    $scope.listaSubAnalisis = [];
    $scope.listaAnalisis = [];

    $http.get('/api/listarTipoAnalisis/' + id_tipoMuestreo).success(function(response){
      $scope.listaTipoAnalisis = response;
    });

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
    var cont = 0;

    if (listaAux[0] === undefined) {
      listaAux.push(nuevoAux);
    }else {
      for (var i = 0; i < listaAux.length; i++) {
        if (listaAux[i].tipoAnalisis.id_tipoMuestreo === nuevoAux.tipoAnalisis.id_tipoMuestreo) {
          valida = i;
          cont++;
          break;
        }
      }

      if (cont != 0) {
        listaAux.splice(valida, 1, nuevoAux);
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


























  //Metodos para datepicker
  //-----------------------------------------------------------------------------------------------------------------//
  $scope.today = function() {
    $scope.fecha_muestreo = new Date();
    $scope.fecha_creacion = new Date();
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

// ------------------------------------------------------------------------------------

app.controller('limpiarCampos', function($rootScope, $scope){

  $rootScope.limpiarCamposModal = function(){

    $scope.materiaPrima = null;
    $scope.trader = "";
    $scope.retiro = 'muestreo';
    $scope.pais = "";
    $scope.modalLote = "";
    $scope.modalBulto = "";
    $scope.modalCantidad = "";
    $scope.modalContenedor = "";
    $scope.modalId = "";
    $scope.modalProcedencia = "";
    $scope.bodega = "";
    $scope.modalTipo = "";
    $scope.traders = "";
    $scope.guardar = false;

  };

  $rootScope.limpiarCamposModalAceite = function(){

    $scope.retiro = 'muestreo';
    $scope.composito = '';
    $scope.tipoMuestra = '';
    $scope.traders = '';
    $scope.pais = '';
    $scope.bodega = '';
    $scope.encargadoBodega = '';
    $scope.procedencia = '';
    $scope.toneladas = '';
    $scope.estrato = '';
    $scope.composito = '';
    $scope.tipoAceite = '';
    $scope.fabricante = '';

  };

  $rootScope.limpiarModalGranos = function(){

    $scope.retiro = 'muestreo';
    $scope.tipoMuestra = '';
    $scope.traders = '';
    $scope.pais = '';
    $scope.bodega = '';
    $scope.encargadoBodega = '';
    $scope.procedencia = '';
    $scope.toneladas = '';
    $scope.materiaPrima = '';
    $scope.trader = '';
    $scope.temperatura = '';
    $scope.seleccionAlmacenaje = '';

  };

  $rootScope.limpiarModalMuestreo = function(){

    $scope.codigo = '';
    $scope.retiro = 'muestreo';
    $scope.tipoMuestra = '';
    $scope.traders = '';
    $scope.pais = '';
    $scope.bodega = '';
    $scope.encargadoBodega = '';
    $scope.procedencia = '';
    $scope.toneladas = '';

  };


  $rootScope.limpiarModalAlimentos = function(){

    $scope.codigo = '';
    $scope.retiro = 'muestreo';
    $scope.tipo = '';
    $scope.listaAnalisis = [];

  };

});
