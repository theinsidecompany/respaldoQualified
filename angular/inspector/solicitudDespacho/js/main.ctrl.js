app.controller('solDespachoInspecController', function ($scope, $notify, $http, $rootScope, $timeout, Upload, $sce){

  listarInspector();
  function listarInspector(){
    var id_inspector = $rootScope.loggedUser.id_usuario;
    $http.get('/api/listarSDFiltroInspector/' + id_inspector).success(function(response){
      $scope.listaSD = response;
    })
  }


  function cargarEventos(){
    var listaCarga = [];
    if ($scope.listaCarga != undefined) {
      listaCarga = $scope.listaCarga;
    }
    $(function () {
      $(".column").sortable({
        connectWith: ".column",
        handle: ".portlet-header",
        receive: function (e, ui) {
          var $target = $(e.target).find("h4");
          var message = {sello: ui.item[0].innerText, espacio: $target[0].innerText};
        }
      });

    });
  }

  $scope.modalVisualizacionCamion = function(item, index, lotes, contenedores, bodegas, cliente){

    $scope.modalChofer = item.chofer;
    $scope.modalEmpresa = item.empresa;
    $scope.modalPatente = item.patente;
    $scope.modalDestino = item.destino;
    $scope.modalFactura = item.factura;
    $scope.fecha_carga = item.fecha_carga;
    $scope.modalCheck = item.checklist;
    $scope.modalLotes = lotes;
    $scope.modalContenedores = contenedores;
    $scope.modalBodegas = bodegas;
    $scope.modalCliente = cliente;
    $scope.ObservacionesModalList = item.observaciones;
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

    var lista1 = [];
    var lista2 = [];
    var lista3 = [];
    var lista4 = [];
    for (var i = 0; i < listaNon.length; i++) {
      if (i < 5) {
        lista1.push(listaNon[i]);
      }else {
        lista3.push(listaNon[i]);
      }
    }

    for (var i = 0; i < listaPar.length; i++) {
      if (i < 5) {
        lista2.push(listaPar[i]);
      }else {
        lista4.push(listaPar[i]);
      }
    }

    $scope.listaPar = listaPar;
    $scope.listaNon = listaNon;
    $scope.lista1 = lista1;
    $scope.lista2 = lista2;
    $scope.lista3 = lista3;
    $scope.lista4 = lista4;
    $scope.itemCargaCamion = item;

    // console.log(item.carga);

  }


  $scope.enviarDatosVista = function(sd){
    $scope.id_solicitud = sd.id_solicitud_despacho;
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
    $scope.usuario = $rootScope.loggedUser.nombre;

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



  function setearFinaliza(asigna, cont, id_solicitud){
    if (asigna === cont) {
      var nuevo = {'id_solicitud_despacho': id_solicitud, 'id_inspector': $rootScope.loggedUser.id_usuario};
      $http.post('/api/asignaTermino', nuevo).success(function(response){
        $scope.listaSD = response;
      })
    }
  }


  function setearFinalizaFalse(asigna, cont, id_solicitud){
      var nuevo = {'id_solicitud_despacho': id_solicitud, 'id_inspector': $rootScope.loggedUser.id_usuario};
      $http.post('/api/asignaTerminoFalse', nuevo).success(function(response){
        $scope.listaSD = response;
      })
  }


  $scope.guardarChecklist = function(checklist){

    checklist.fecha = new Date();
    var check = {checklist: checklist}
    $scope.checklistModalTransporte = check;

  }

  $scope.cargaChecklist = function(modalCheck){

    $scope.checklist = modalCheck.checklist;
    $scope.ObservacionesModalList = modalCheck.observaciones;
    $scope.denegar = true;

  }

  // $scope.enviarObservacionModal = function (sol, id_lote) {
  //
  //   id = {id_solicitud: sol, id_lote: id_lote};
  //
  //   $http.post('/api/traerObservacion', id).success(function(respuesta){
  //     $scope.ObservacionesModal = respuesta.observacion;
  //   });
  //
  // };


  $scope.enviarDatosTransporte = function(listalotesCamion, asignados){

    var listaSellos = [];
    for (var i = 0; i < listalotesCamion.length; i++) {
      for (var j = 0; j < listalotesCamion[i].sellos.length; j++) {
        listaSellos.push(listalotesCamion[i].sellos[j]);
      }
    }

    if (asignados != undefined) {
      for (var j = 0; j < asignados.length; j++) {
        for (var i = 0; i < listaSellos.length; i++) {
          if (Number(asignados[j]) === listaSellos[i]) {
            listaSellos.splice(i, 1);
          }
        }
      }
    }
    $rootScope.listaObservaciones = [];
    $scope.listaSellos = listaSellos;
    $timeout(function() {
      cargarEventos();
    }, 1000);
  }


  $scope.obtenerDatos = function(id_solicitud, empresa, chofer, patente, destino, factura, asignados, sellos, checklistModalTransporte, listaObservaciones){

    var elm = {};
    var elms = document.getElementById("div1").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }
    var div1 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div2").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div2 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div3").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div3 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div4").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div4 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div5").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div5 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div6").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div6 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div7").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div7 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div8").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div8 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div9").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div9 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div10").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div10 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div11").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div11 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div12").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div12 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div13").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div13 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div14").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div14 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div15").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div15 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div16").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div16 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div17").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div17 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div18").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div18 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div19").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div19 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div20").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div20 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div21").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div21 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div22").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div22 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div23").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div23 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div24").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div24 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div25").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div25 = elm.innerHTML;

    var elm = {};
    var elms = document.getElementById("div26").getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
      if (elms[i].id) {
        elm = elms[i];
        break;
      }
    }

    var div26 = elm.innerHTML;

    var espacio1 = {sector: 1, sello: div1};
    var espacio2 = {sector: 2, sello: div2};
    var espacio3 = {sector: 3, sello: div3};
    var espacio4 = {sector: 4, sello: div4};
    var espacio5 = {sector: 5, sello: div5};
    var espacio6 = {sector: 6, sello: div6};
    var espacio7 = {sector: 7, sello: div7};
    var espacio8 = {sector: 8, sello: div8};
    var espacio9 = {sector: 9, sello: div9};
    var espacio10 = {sector: 10 , sello: div10};
    var espacio11 = {sector: 11, sello: div11};
    var espacio12 = {sector: 12, sello: div12};
    var espacio13 = {sector: 13, sello: div13};
    var espacio14 = {sector: 14, sello: div14};
    var espacio15 = {sector: 15, sello: div15};
    var espacio16 = {sector: 16, sello: div16};
    var espacio17 = {sector: 17, sello: div17};
    var espacio18 = {sector: 18, sello: div18};
    var espacio19 = {sector: 19, sello: div19};
    var espacio20 = {sector: 20, sello: div20};
    var espacio21 = {sector: 21, sello: div21};
    var espacio22 = {sector: 22, sello: div22};
    var espacio23 = {sector: 23, sello: div23};
    var espacio24 = {sector: 24, sello: div24};
    var espacio25 = {sector: 25, sello: div25};
    var espacio26 = {sector: 26, sello: div26};

    var lista = [espacio1, espacio2, espacio3, espacio4, espacio5, espacio6, espacio7, espacio8, espacio9, espacio10, espacio11, espacio12,
      espacio13, espacio14, espacio15, espacio16, espacio17, espacio18, espacio19, espacio20, espacio21, espacio22, espacio23, espacio24, espacio25, espacio26];


      var cont = sellos;

      if (asignados != undefined) {
        var listaAsignados = asignados;
      }else {
        var listaAsignados = [];
      }

      for (var i = 0; i < lista.length; i++) {
        if (lista[i].sello != undefined) {
          cont++;
          listaAsignados.push(lista[i].sello);
        }
      }

      var checklist = [];
      if (checklistModalTransporte != undefined) {
        checklist = checklistModalTransporte;
      }else {
        checklist = null;
      }

      var id_solicitud_despacho = id_solicitud;
      $http.get('/api/SDUnica/'+ id_solicitud_despacho).success(function(response){
        var listaVieja = response[0].carga;
        if (response[0].carga[0] === undefined) {
          var registro = {'empresa': empresa, 'chofer': chofer, 'patente': patente, 'destino': destino, 'factura': factura, 'carga': lista, 'checklist': checklist, 'fecha_carga': new Date(), 'observaciones': listaObservaciones};
          var nuevo = {'id_solicitud_despacho': id_solicitud, 'lotes': registro , 'asigna': cont, 'asignados': listaAsignados, 'id_inspector': $rootScope.loggedUser.id_usuario};
          $http.post('/api/asignaTranporte', nuevo).success(function(response){
            $scope.solicicitudD = response[0];
            $scope.cliente = response[0].cliente;
            $scope.id_solicitud = response[0].id_solicitud_despacho;
            $scope.listalotesCamion = response[0].lotes;
            $scope.asignados = response[0].asignados;

            var listaCamiones = [];
            for (var i = 0; i < response[0].carga.length; i++) {
              listaCamiones.push(response[0].carga[i]);
            }
            $scope.listaCamiones = listaCamiones;

            var stringLotes = '';
            for (var i = 0; i < response[0].lotes.length; i++) {
              if (stringLotes.length < 1) {
                stringLotes = stringLotes + response[0].lotes[i].lote;
              }else {
                stringLotes = stringLotes + ', ' + response[0].lotes[i].lote;
              }
            }
            $scope.lotes = stringLotes;
            var stringContenedor = '';
            for (var i = 0; i < response[0].lotes.length; i++) {
              if (stringContenedor.length < 1) {
                stringContenedor = stringContenedor + response[0].lotes[i].contenedor;
              }else {
                stringContenedor = stringContenedor + ', ' + response[0].lotes[i].lote;
              }
            }
            $scope.contenedores = stringContenedor;
            var stringBodega = '';
            for (var i = 0; i < response[0].lotes.length; i++) {
              if (stringBodega.length < 1) {
                stringBodega = stringBodega + response[0].lotes[i].bodega.nombreBodega;
              }else {
                stringBodega = stringBodega + ', ' + response[0].lotes[i].bodega.nombreBodega;
              }
            }
            var cont = 0;
            for (var i = 0; i < response[0].lotes.length; i++) {
              cont += response[0].lotes[i].sellos.length;
            }
            $scope.cont = cont;
            $scope.bodegas = stringBodega;

            if (response[0].asigna == undefined) {
              $scope.sellos = 0;
            }else {
              $scope.sellos = response[0].asigna;
            }

            $timeout(function() {
              setearFinaliza(response[0].asigna, cont, response[0].id_solicitud_despacho);
            }, 500);

          })
        }else {
          var registro = {'empresa': empresa, 'chofer': chofer, 'patente': patente, 'destino': destino, 'factura': factura, 'carga': lista, 'checklist': checklist, 'observaciones': listaObservaciones};
          listaVieja.push(registro);
          var nuevo = {'id_solicitud_despacho': id_solicitud, 'lotes': listaVieja , 'asigna': cont, 'asignados': listaAsignados, 'id_inspector': $rootScope.loggedUser.id_usuario};
          $http.post('/api/asignaTranporte', nuevo).success(function(response){
            $scope.solicicitudD = response[0];
            $scope.cliente = response[0].cliente;
            $scope.id_solicitud = response[0].id_solicitud_despacho;
            $scope.listalotesCamion = response[0].lotes;
            $scope.asignados = response[0].asignados;

            var listaCamiones = [];
            for (var i = 0; i < response[0].carga.length; i++) {
              listaCamiones.push(response[0].carga[i]);
            }
            $scope.listaCamiones = listaCamiones;

            var stringLotes = '';
            for (var i = 0; i < response[0].lotes.length; i++) {
              if (stringLotes.length < 1) {
                stringLotes = stringLotes + response[0].lotes[i].lote;
              }else {
                stringLotes = stringLotes + ', ' + response[0].lotes[i].lote;
              }
            }
            $scope.lotes = stringLotes;
            var stringContenedor = '';
            for (var i = 0; i < response[0].lotes.length; i++) {
              if (stringContenedor.length < 1) {
                stringContenedor = stringContenedor + response[0].lotes[i].contenedor;
              }else {
                stringContenedor = stringContenedor + ', ' + response[0].lotes[i].lote;
              }
            }
            $scope.contenedores = stringContenedor;
            var stringBodega = '';
            for (var i = 0; i < response[0].lotes.length; i++) {
              if (stringBodega.length < 1) {
                stringBodega = stringBodega + response[0].lotes[i].bodega.nombreBodega;
              }else {
                stringBodega = stringBodega + ', ' + response[0].lotes[i].bodega.nombreBodega;
              }
            }
            var cont = 0;
            for (var i = 0; i < response[0].lotes.length; i++) {
              cont += response[0].lotes[i].sellos.length;
            }
            $scope.cont = cont;
            $scope.bodegas = stringBodega;

            if (response[0].asigna == undefined) {
              $scope.sellos = 0;
            }else {
              $scope.sellos = response[0].asigna;
            }
            $timeout(function() {
              setearFinaliza(response[0].asigna, cont, response[0].id_solicitud_despacho);
            }, 500);
          })
        }
      })

    }





    $scope.cancelarCamion = function(itemCargaCamion, solicicitudD, index){

      var id_solicitud_despacho = solicicitudD.id_solicitud_despacho;
      $http.get('/api/SDUnica/'+ id_solicitud_despacho).success(function(response){
        var asignados = response[0].asignados;
        var asigna = response[0].asigna;

        var lista = itemCargaCamion.carga;
        var nuevo = [];
        for (var i = 0; i < lista.length; i++) {
          if (lista[i].sello != undefined) {
            nuevo.push(lista[i].sello);
          }
        }
        for (var i = 0; i < nuevo.length; i++) {
          for (var j = 0; j < asignados.length; j++) {
            if (nuevo[i] === asignados[j]) {
              asignados.splice(j, 1);
            }
          }
        }

        var carga = response[0].carga;
        carga.splice(index, 1);
        var nuevoAsigna = asigna - nuevo.length;

        var nuevo = {'id_solicitud_despacho': id_solicitud_despacho, 'lotes': carga , 'asigna': nuevoAsigna, 'asignados': asignados, 'id_inspector': $rootScope.loggedUser.id_usuario};
        $http.post('/api/asignaTranporte', nuevo).success(function(response){
          $scope.solicicitudD = response[0];
          $scope.cliente = response[0].cliente;
          $scope.id_solicitud = response[0].id_solicitud_despacho;
          $scope.listalotesCamion = response[0].lotes;
          $scope.asignados = response[0].asignados;

          var listaCamiones = [];
          for (var i = 0; i < response[0].carga.length; i++) {
            listaCamiones.push(response[0].carga[i]);
          }
          $scope.listaCamiones = listaCamiones;

          var stringLotes = '';
          for (var i = 0; i < response[0].lotes.length; i++) {
            if (stringLotes.length < 1) {
              stringLotes = stringLotes + response[0].lotes[i].lote;
            }else {
              stringLotes = stringLotes + ', ' + response[0].lotes[i].lote;
            }
          }
          $scope.lotes = stringLotes;
          var stringContenedor = '';
          for (var i = 0; i < response[0].lotes.length; i++) {
            if (stringContenedor.length < 1) {
              stringContenedor = stringContenedor + response[0].lotes[i].contenedor;
            }else {
              stringContenedor = stringContenedor + ', ' + response[0].lotes[i].lote;
            }
          }
          $scope.contenedores = stringContenedor;
          var stringBodega = '';
          for (var i = 0; i < response[0].lotes.length; i++) {
            if (stringBodega.length < 1) {
              stringBodega = stringBodega + response[0].lotes[i].bodega.nombreBodega;
            }else {
              stringBodega = stringBodega + ', ' + response[0].lotes[i].bodega.nombreBodega;
            }
          }
          var cont = 0;
          for (var i = 0; i < response[0].lotes.length; i++) {
            cont += response[0].lotes[i].sellos.length;
          }
          $scope.cont = cont;
          $scope.bodegas = stringBodega;

          if (response[0].asigna == undefined) {
            $scope.sellos = 0;
          }else {
            $scope.sellos = response[0].asigna;
          }

          $timeout(function() {
            setearFinalizaFalse(response[0].asigna, cont, response[0].id_solicitud_despacho);
          }, 500);

        })
      })

    }


    $scope.enviarDespacho = function(sd){
      var nuevo = [{"id_proceso" : 14, "descripcion" : "Recepcion en Planta", "color" : "FFFF00", "icono" : "file", "visible" : true}];
      var elemento = {'id_solicitud_despacho': sd.id_solicitud_despacho, 'id_inspector': sd.id_inspector, 'proceso': nuevo};
      $http.post('/api/entregar', elemento).success(function(response){
        $scope.listaSD = response;
      })

      for (var i = 0; i < sd.lotes.length; i++) {
        var aux = {id_solicitud: sd.lotes[i].id_solicitud, id_lote: sd.lotes[i].id_lote};
        $http.post('/api/setearRecepcion', aux).success(function(respuesta){})
      }

    }

    // -----------------------------------------------------------------------------------------------------------

    $scope.uploadPic = function(file, modalSol, id_lote, listaEvidencias) {

      var lista = [];

      if (listaEvidencias.length !== 0) {
        var lista = listaEvidencias;
      }

      file.upload = Upload.upload({
        url: '/evidencias',
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

      lista.push({nombreArchivo: file.name});

      $scope.listaEvidencias = lista;

      $scope.numeros = lista.length;

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

    function printEvidencia() {
      var divName = 'evidenciaVer';
      var printContents = document.getElementById(divName).innerHTML;
      var popupWin = window.open('', 'Evidencias' ,'_blank', 'width=100%,height=100%');
      popupWin.document.open();
      popupWin.document.write('<html><head></head><body style: width:100%; height:100%;>' + printContents + '</body></html>');
      popupWin.document.close();
    }

    $scope.agregarObservacionDespacho = function(solicitud, observacion, id_lote, listaEvidencias, id_despacho){

      var archivos = listaEvidencias;
      var fecha = new Date();

      var nuevo = {observacion: [{fecha: fecha, contenido: observacion, emisor: $rootScope.loggedUser.nombre, cargo: $rootScope.loggedUser.perfil[0].nombre_perfil, evidencias: archivos}], id_solicitud: solicitud, id_lote: id_lote};
      var observacion_lote = {observacion: nuevo};
      var id = {id_solicitud: solicitud, id_lote: id_lote};

      $http.post('/api/traerObservacion', id).success(function(respuesta){

        if (respuesta !== '0') {

          var obs = {fecha: fecha, contenido: observacion, emisor: $rootScope.loggedUser.nombre, cargo: $rootScope.loggedUser.perfil[0].nombre_perfil, evidencias: archivos};
          var lista = respuesta.observacion;
          lista.push(obs);
          var nuevo = {observacion: lista, id_solicitud: respuesta.id_solicitud, id_lote: respuesta.id_lote, id_solicitud_cliente: respuesta.id_solicitud_cliente, id_orden_trabajo: respuesta.id_solicitud_cliente};

          $http.post('/api/actualizarObservacion', nuevo).success(function(respu){
            $scope.ObservacionesModal = respu[0].observacion;
            $scope.observacion = '';
            $scope.numeros = 0;
          });


        }else{

          $http.post('/api/agregarObservacion', observacion_lote).success(function(response){
            $scope.ObservacionesModal = response[0].observacion;
            $scope.observacion = '';
            $scope.numeros = 0;
          });

          $http.get('/api/SDUnica/' + id_despacho).success(function(sd){
            var lotes = sd[0].lotes;
            var lista = [];
            var lote = {};
            for (var i = 0; i < lotes.length; i++) {
              if (lotes[i].id_lote === id_lote) {
                lote = {'nroInforme': lotes[i].nroInforme, 'certificado': lotes[i].certificado, 'id_solicitud': lotes[i].id_solicitud, 'inocuidad': lotes[i].inocuidad, 'despacho': lotes[i].despacho, 'check': lotes[i].check, 'validaCheck':lotes[i].validaCheck,
                        'envia': lotes[i].envia, 'bodega': lotes[i].bodega, 'id_lote': lotes[i].id_lote, 'materiaPrima': lotes[i].materiaPrima, 'trader': lotes[i].trader, 'paisTrader': lotes[i].paisTrader, 'lote': lotes[i].lote, 'bultos': lotes[i].bultos,
                        'cantidad': lotes[i].cantidad, 'contenedor': lotes[i].contenedor, 'tipoMuestreo': lotes[i].tipoMuestreo, 'estadoLab': lotes[i].estadoLab, 'observaciones': true, 'sellos': lotes[i].sellos, 'asignados': lotes[i].asignados, 'inspectorEnvia': lotes[i].inspectorEnvia,
                      'calidad': lotes[i].calidad};
                lista.push(lote);
              }else{
                lista.push(lotes[i]);
              }
            }
            var post = {lotes: lista, id_despacho: id_despacho};
            $http.post('/api/actualizarSD', post).success(function(respuesta){
                $scope.lotesSD = respuesta;
            });
          });

        }

      });

      $scope.vaciarListaEvidencias();

    }

    $scope.enviarObservacionModal = function (sol, id_lote, id_despacho){

      $scope.modalSol = sol;

      id = {id_solicitud: sol, id_lote: id_lote};

      $http.post('/api/traerObservacion', id).success(function(respuesta){
        $scope.ObservacionesModal = respuesta.observacion;
      });
      $scope.id_loteObservacion = id_lote;
      $scope.id_despacho = id_despacho;

    };

    $scope.listaEvidencias = [];
    $scope.numeros = 0;

    $scope.vaciarListaEvidencias = function(){
      $scope.listaEvidencias = [];
    }

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

    // ------------------------------------------------------------------------------------------------------


    $scope.agregarObservacionCheckList = function(contenido, listaEvidencias, listaObservaciones){

      var archivos = listaEvidencias;
      var fecha = new Date();

      if (listaObservaciones === undefined) {

        var lista = [];

      }else{

        var lista = listaObservaciones;

      }

      var observacion = {fecha: fecha, contenido: contenido, emisor: $rootScope.loggedUser.nombre, cargo: $rootScope.loggedUser.perfil[0].nombre_perfil, evidencias: archivos};
      lista.push(observacion);
      $scope.ObservacionesModalCheckList = lista;
      $rootScope.listaObservaciones = lista;
      $scope.observacion = '';
      $scope.numeros = 0;
      $scope.listaEvidencias = [];

    }

    $scope.enviarObservacionModalCheckList = function (lista) {

      $scope.ObservacionesModalCheckList = lista;

    };


    $scope.imprimirCamion = function(){

      var divName = 'divCamion';
      var printContents = document.getElementById(divName).innerHTML;
      var popupWin = window.open('', 'Camion' ,'_blank', 'width=100%,height=100%');
      popupWin.document.open();
      popupWin.document.write('<html><head><link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet"></head><body onload="window.print()" style: width:100%; height:100%;>' + printContents + '</body></html>');
      popupWin.document.close();
    }


    $scope.imprimirChecklist = function(){

      var divName = 'divChecklist';
      var printContents = document.getElementById(divName).innerHTML;
      var popupWin = window.open('', 'Camion' ,'_blank', 'width=100%,height=100%');
      popupWin.document.open();
      popupWin.document.write('<html><head><link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet"></head><body onload="window.print()" style: width:100%; height:100%;>' + printContents + '</body></html>');
      popupWin.document.close();
    }

  })
