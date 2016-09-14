var contTree = 0;
app.controller('chart1', function($scope, $rootScope, $http) {

  habilitarDashAdmin();
  function habilitarDashAdmin() {
    if ($rootScope.loggedUser.perfil[0].id_perfil === 1) {
      $scope.dash = false;
      $scope.dashAdmin = true;
    }else{
      $scope.dash = true;
      $scope.dashAdmin = false;
    }
  }



  //
  // $(function () {
  //
  //     // Create the chart
  //     $('#container').highcharts({
  //         chart: {
  //             type: 'pie'
  //         },
  //         title: {
  //             text: 'Prueba drilldown'
  //         },
  //         xAxis: {
  //             type: 'category'
  //         },
  //
  //         legend: {
  //             enabled: false
  //         },
  //
  //         plotOptions: {
  //             series: {
  //                 borderWidth: 0,
  //                 dataLabels: {
  //                     enabled: true,
  //                 }
  //             }
  //         },
  //
  //         series: [{
  //             name: 'Things',
  //             colorByPoint: true,
  //             data: [{
  //                 name: 'Animals',
  //                 y: 5,
  //                 drilldown: 'animals'
  //             }]
  //         }],
  //         drilldown: {
  //             series: [{
  //                 id: 'animals',
  //                 name: 'Animals',
  //                 data: [{
  //                     name: 'Cats',
  //                     y: 4,
  //                     drilldown: 'cats'
  //                 }, ['Dogs', 2],
  //                     ['Cows', 1],
  //                     ['Sheep', 2],
  //                     ['Pigs', 1]
  //                 ]
  //             }, {
  //
  //                 id: 'cats',
  //                 data: [1, 2, 3]
  //             }]
  //         }
  //     })
  // });

  //--------------------------------------------------------------------------------------------------------------------------------//
  $scope.traerTipoMuestreoSolicitudes = function() {
    var id_usuario = $rootScope.loggedUser.id_usuario;
    $http.get('/api/solicitud/' + id_usuario).success(function(response) {
      eliminateDuplicates(response);
    });
  }

  $scope.filtroFechaTipo = function(inicio, fin){
    var id_usuario = $rootScope.loggedUser.id_usuario;
    $http.get('/api/solicitud/' + id_usuario).success(function(response) {
      var fecha1 = inicio.getTime();
      var fecha2 = fin.getTime();
      var fecha3;
      var fechaAuxiliar;
      var listaNueva = [];

      for (var i = 0; i < response.length; i++) {
        fechaAuxiliar = Date.parse(response[i].fecha_creacion);
        if (fechaAuxiliar >= fecha1 && fechaAuxiliar <= fecha2) {
          listaNueva.push(response[i]);
        }
      }
      eliminateDuplicates(listaNueva);
    });
  }



  function eliminateDuplicates(arr) {
    var i;
    var out = [];
    var obj = {};

    for (i=0;i< arr.length;i++) {
      obj[arr[i].tipoMuestreo.descripcion]=0;
    }
    for (i in obj) {
      out.push(i);
    }


    var cant;
    var listaData = [];
    for (var i = 0; i < out.length; i++) {
      cant = 0;
      for (var j = 0; j < arr.length; j++) {
        if (out[i] === arr[j].tipoMuestreo.descripcion) {
          cant++;
        }
      }
      var aux ={name: out[i], y: cant, drilldown: out[i]};
      listaData.push(aux);
    }

    //Separar Lotes por distintos tipos de muestreo
    //--------------------------------------------------------------------------------------------------------------------------------//
    var listaLotes = [];
    var listaGranos = [];
    var listaAceite = [];

    for (var i = 0; i < arr.length; i++) {
      if (arr[i].tipoMuestreo.id_muestreo === 1) {
        if (listaLotes[0] === undefined) {
          listaLotes = arr[i].lote;
        }else {
          listaLotes.concat(arr[i].lote);
        }
      }else if (arr[i].tipoMuestreo.id_muestreo === 7) {
        if (listaAceite[0] === undefined) {
          listaAceite = arr[i].lote;
        }else {
          listaAceite.push(arr[i].lote)
        }
      }else if (arr[i].tipoMuestreo.id_muestreo === 8) {
        if (listaGranos[0] === undefined) {
          listaGranos = arr[i].lote;
        }else {
          listaGranos.push(arr[i].lote);
        }
      }
    }
    //--------------------------------------------------------------------------------------------------------------------------------//



    //Eliminacion duplicados para cantidades
    //--------------------------------------------------------------------------------------------------------------------------------//
    var out2 = [];
    var obj2 = {};

    for (i=0;i< listaLotes.length;i++) {
      obj2[listaLotes[i].materiaPrima.nombreMateriaPrima]=0;
    }
    for (i in obj2) {
      out2.push(i);
    }


    var out3 = [];
    var obj3 = {};

    for (i=0;i< listaGranos.length;i++) {
      obj3[listaGranos[i].materiaPrima.nombreMateriaPrima]=0;
    }
    for (i in obj3) {
      out3.push(i);
    }

    var out4 = [];
    var obj4 = {};

    for (i=0;i< listaAceite.length;i++) {
      obj4[listaAceite[i].tipoAceite]=0;
    }
    for (i in obj4) {
      out4.push(i);
    }
    //--------------------------------------------------------------------------------------------------------------------------------//


    //Asignar Cantidades tipo Materias primas
    //CantidadesHarina Nombre y cantidad para sus tipos de materia prima
    //CantidadesAceite Nombre y cantidad para sus tipos de materia prima
    //CantidadesGranos Nombre y cantidad para sus tipos de materia prima
    //--------------------------------------------------------------------------------------------------------------------------------//
    var contHarina;
    var CantidadesHarina = [];
    for (var i = 0; i < out2.length; i++) {
      contHarina = 0;
      for (var j = 0; j < listaLotes.length; j++) {
        if (out2[i] === listaLotes[j].materiaPrima.nombreMateriaPrima) {
          contHarina = contHarina + Number(listaLotes[j].cantidad);
        }
      }
      var nuevo =[out2[i], contHarina];
      CantidadesHarina.push(nuevo);
    }


    var contAceite;
    var CantidadesAceite = [];
    for (var i = 0; i < out4.length; i++) {
      contAceite = 0;
      for (var j = 0; j < listaAceite.length; j++) {
        if (out4[i] === listaAceite[j].tipoAceite) {
          contAceite = contAceite + Number(listaAceite[j].toneladas);
        }
      }
      var nuevo = [out4[i], contAceite];
      CantidadesAceite.push(nuevo);
    }


    var contGranos;
    var CantidadesGranos = [];
    for (var i = 0; i < out3.length; i++) {
      contGranos = 0;
      for (var j = 0; j < listaGranos.length; j++) {
        if (out3[i] === listaGranos[j].materiaPrima.nombreMateriaPrima) {
          contGranos = contGranos + Number(listaGranos[j].toneladas);
        }
      }
      var nuevo = [out3[i], contGranos];
      CantidadesGranos.push(nuevo);
    }
    //--------------------------------------------------------------------------------------------------------------------------------//


    // carga grafico
    $('#container').highcharts({
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Tipos de Muestreos'
      },
      subtitle: {
        text: ''
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y:.1f}%'
          }
        }
      },

      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
      },
      series: [{
        name: 'Tipos de Muestreos',
        colorByPoint: true,
        data: listaData
      }],
      drilldown: {
        series: [{
          name: 'Harinas',
          id: 'Harinas',
          data: CantidadesHarina
        }, {
          name: 'Granos',
          id: 'Granos',
          data: CantidadesGranos
        }, {
          name: 'Aceite',
          id: 'Aceite',
          data: CantidadesAceite
        }]
      }
    });

  }
  //--------------------------------------------------------------------------------------------------------------------------------//


  //Funcion que trae todas las solicitudes de la base de datos.
  //--------------------------------------------------------------------------------------------------------------------------------//
  $scope.traerSolicitudesHarinaCliente = function() {
    var usuario = {id_usuario: $rootScope.loggedUser.id_usuario};
    $http.post('/api/solicitudesDashboard', usuario).success(function(response) {
      var cont = 0;
      for (var i = 0; i < response.length; i++) {
        cont += response[i].lote.length;
      }

      $(function () {
        $('#donut').highcharts({
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
          },
          title: {
            text: 'Total<br>Lotes<br>' + cont,
            align: 'center',
            verticalAlign: 'middle',
            y: 40
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
            pie: {
              dataLabels: {
                enabled: true,
                distance: -50,
                style: {
                  fontWeight: 'bold',
                  color: 'white',
                  textShadow: '0px 1px 2px black'
                }
              },
              startAngle: -90,
              endAngle: 90,
              center: ['50%', '75%']
            }
          },
          series: [{
            type: 'pie',
            name: 'Conteo Lotes',
            innerSize: '50%',
            data: [
              ['Lotes', cont],
            ]
          }]
        });
      });
    });
  }


  $scope.filtroFechaLote = function(inicio, fin){
    var usuario = {id_usuario: $rootScope.loggedUser.id_usuario};
    $http.post('/api/solicitudesDashboard', usuario).success(function(response) {
      var fecha1 = inicio.getTime();
      var fecha2 = fin.getTime();
      var fecha3;
      var fechaAuxiliar;
      var listaNueva = [];

      for (var i = 0; i < response.length; i++) {
        fechaAuxiliar = Date.parse(response[i].fecha_creacion);
        if (fechaAuxiliar >= fecha1 && fechaAuxiliar <= fecha2) {
          listaNueva.push(response[i]);
        }
      }

      var cont = 0;
      for (var i = 0; i < listaNueva.length; i++) {
        cont += listaNueva[i].lote.length;
      }

      $(function () {
        $('#donut').highcharts({
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
          },
          title: {
            text: 'Total<br>Lotes<br>' + cont,
            align: 'center',
            verticalAlign: 'middle',
            y: 40
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point}</b>'
          },
          plotOptions: {
            pie: {
              dataLabels: {
                enabled: true,
                distance: -50,
                style: {
                  fontWeight: 'bold',
                  color: 'white',
                  textShadow: '0px 1px 2px black'
                }
              },
              startAngle: -90,
              endAngle: 90,
              center: ['50%', '75%']
            }
          },
          series: [{
            type: 'pie',
            name: 'Conteo Lotes',
            innerSize: '50%',
            data: [
              ['Lotes', cont],
            ]
          }]
        });
      });

    });
  }

  //--------------------------------------------------------------------------------------------------------------------------------//


  //--------------------------------------------------------------------------------------------------------------------------------//
  $scope.listarBodega = function(){
    var id_usuario = $rootScope.loggedUser.id_usuario;
    $http.get('/api/traerLotesUsuarios/' + id_usuario).success(function(response){
      var listaBodega = [];
      var listaLotes = response[0].lotes;
      var objeto;
      for (var i = 0; i < listaLotes.length; i++) {
        objeto = {bodega: listaLotes[i].bodega.nombreBodega, cantidad: listaLotes[i].bultos, materia: listaLotes[i].materiaPrima.nombreMateriaPrima, kilos: listaLotes[i].cantidad};
        listaBodega.push(objeto);
      }

      eliminarBodegasDup(listaBodega);
    });
  }


  $scope.filtroFechaBodega = function(inicio, fin){
    var id_usuario = $rootScope.loggedUser.id_usuario;
    $http.post('/api/traerLotesUsuarios/'+ id_usuario).success(function(response) {
      var fecha1 = inicio.getTime();
      var fecha2 = fin.getTime();
      var fecha3;
      var fechaAuxiliar;
      var listaNueva = [];
      var listaLotes = response[0].lotes;


      for (var i = 0; i < listaLotes.length; i++) {
        fechaAuxiliar = Date.parse(listaLotes[i].fecha_creacion);
        if (fechaAuxiliar >= fecha1 && fechaAuxiliar <= fecha2) {
          listaNueva.push(listaLotes[i]);
        }
      }

      var listaBodega = [];
      var objeto;
      for (var i = 0; i < listaNueva.length; i++) {
        for (var j = 0; j < listaNueva[i].lote.length; j++) {
          objeto = {bodega: listaLotes[i].bodega.nombreBodega, cantidad: listaLotes[i].bultos, materia: listaLotes[i].materiaPrima.nombreMateriaPrima, kilos: listaLotes[i].cantidad};
          listaBodega.push(objeto);
        }
      }
      eliminarBodegasDup(listaBodega);

    });
  }



  function eliminarBodegasDup(arr) {
    var i;
    var out = [];
    var obj = {};

    for (i=0;i< arr.length;i++) {
      obj[arr[i].bodega]=0;
    }
    for (i in obj) {
      out.push(i);
    }


    var cant;
    var listaData = [];
    var listaAux;
    var listaFin = [];
    for (var i = 0; i < out.length; i++) {
      listaAux = [];
      cant = 0;
      for (var j = 0; j < arr.length; j++) {
        if (out[i] === arr[j].bodega) {
          cant =  cant + Number(arr[j].cantidad);
          listaAux.push(arr[j].materia);
        }
      }

      var out2 = [];
      var obj2= {};

      for (k=0;k< listaAux.length;k++) {
        obj2[listaAux[k]]=0;
      }
      for (k in obj2) {
        out2.push(k);
      }

      var nuevo = {bodega: out[i], lista: out2};
      listaFin.push(nuevo);
      var aux = {name: out[i], data: [{name: out[i], y: cant, drilldown: out[i]}]};
      listaData.push(aux);
    }

    var contMateria;
    var listaMateria;
    var listaFinal = [];

    for (var i = 0; i < listaFin.length; i++) {
      listaMateria = [];
      for (var j = 0; j < listaFin[i].lista.length; j++) {
        contMateria = 0;
        for (var k = 0; k < arr.length; k++) {
          if (listaFin[i].bodega === arr[k].bodega && listaFin[i].lista[j] === arr[k].materia) {
            contMateria =  contMateria + Number(arr[k].kilos);
          }
        }
        var nuevo = [listaFin[i].lista[j], contMateria];
        listaMateria.push(nuevo);
      }
      var nuevo = {id: listaFin[i].bodega, name:  listaFin[i].bodega, data: listaMateria};
      listaFinal.push(nuevo);
    }


    // carga grafico
    $('#container5').highcharts({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Cantidad por Bodega'
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        categories: ['Bodegas']
      },
      yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
          text: 'Materias por Bodega'
        }
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y}'
          }
        }
      },

      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
      },
      series: listaData,
      drilldown: {
        series: listaFinal
      }
    });

  }
  //--------------------------------------------------------------------------------------------------------------------------------//


  //--------------------------------------------------------------------------------------------------------------------------------//
  $scope.traerSolicitudesProveedor = function() {
    var usuario = {id_usuario: $rootScope.loggedUser.id_usuario};
    $http.post('/api/solicitudesDashboard', usuario).success(function(response) {
      var listaBodega = [];
      var objeto;
      for (var i = 0; i < response.length; i++) {
        for (var j = 0; j < response[i].lote.length; j++) {
          objeto = {proveedor: response[i].lote[j].trader.nombreTrader, cantidad: response[i].lote[j].bultos, materia: response[i].lote[j].materiaPrima.nombreMateriaPrima, kilos: response[i].lote[j].cantidad};
          listaBodega.push(objeto);
        }
      }
      eliminarProveedorDup(listaBodega);
    });
  }

  $scope.filtroFechaProveedor = function(inicio, fin){
    var usuario = {id_usuario: $rootScope.loggedUser.id_usuario};
    $http.post('/api/solicitudesDashboard', usuario).success(function(response) {
      var fecha1 = inicio.getTime();
      var fecha2 = fin.getTime();
      var fecha3;
      var fechaAuxiliar;
      var listaNueva = [];

      for (var i = 0; i < response.length; i++) {
        fechaAuxiliar = Date.parse(response[i].fecha_creacion);
        if (fechaAuxiliar >= fecha1 && fechaAuxiliar <= fecha2) {
          listaNueva.push(response[i]);
        }
      }

      var listaBodega = [];
      var objeto;
      for (var i = 0; i < listaNueva.length; i++) {
        for (var j = 0; j < listaNueva[i].lote.length; j++) {
          objeto = {proveedor: listaNueva[i].lote[j].trader.nombreTrader, cantidad: listaNueva[i].lote[j].bultos, materia: listaNueva[i].lote[j].materiaPrima.nombreMateriaPrima, kilos: listaNueva[i].lote[j].cantidad};
          listaBodega.push(objeto);
        }
      }
      eliminarProveedorDup(listaBodega);

    });
  }

  function eliminarProveedorDup(arr) {

    var i;
    var out = [];
    var obj = {};

    for (i=0;i< arr.length;i++) {
      obj[arr[i].proveedor]=0;
    }
    for (i in obj) {
      out.push(i);
    }

    var cant;
    var listaData = [];
    var listaAux;
    var listaFin = [];
    for (var i = 0; i < out.length; i++) {
      listaAux = [];
      cant = 0;
      for (var j = 0; j < arr.length; j++) {
        if (out[i] === arr[j].proveedor) {
          cant =  cant + Number(arr[j].cantidad);
          listaAux.push(arr[j].materia);
        }
      }

      var out2 = [];
      var obj2= {};

      for (k=0;k< listaAux.length;k++) {
        obj2[listaAux[k]]=0;
      }
      for (k in obj2) {
        out2.push(k);
      }

      var nuevo = {proveedor: out[i], lista: out2};
      listaFin.push(nuevo);
      var aux = {name: out[i], y: cant, drilldown: out[i]};
      listaData.push(aux);
    }


    var contMateria;
    var listaMateria;
    var listaFinal = [];

    for (var i = 0; i < listaFin.length; i++) {
      listaMateria = [];
      for (var j = 0; j < listaFin[i].lista.length; j++) {
        contMateria = 0;
        for (var k = 0; k < arr.length; k++) {
          if (listaFin[i].proveedor === arr[k].proveedor && listaFin[i].lista[j] === arr[k].materia) {
            contMateria =  contMateria + Number(arr[k].kilos);
          }
        }
        var nuevo = [listaFin[i].lista[j], contMateria];
        listaMateria.push(nuevo);
      }
      var nuevo = {id: listaFin[i].proveedor, name:  listaFin[i].proveedor, data: listaMateria};
      listaFinal.push(nuevo);
    }


    // carga grafico
    $('#container3').highcharts({
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Tipos de Muestreos'
      },
      subtitle: {
        text: ''
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y}'
          }
        }
      },

      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
      },
      series: [{
        name: 'Proveedores',
        colorByPoint: true,
        data: listaData
      }],
      drilldown: {
        series: listaFinal
      }
    });

  }

  //--------------------------------------------------------------------------------------------------------------------------------//



  //--------------------------------------------------------------------------------------------------------------------------------//
  $scope.traerSolicitudesPais = function() {
    var usuario = {id_usuario: $rootScope.loggedUser.id_usuario};
    $http.post('/api/solicitudesDashboard', usuario).success(function(response) {
      var listaPais = [];
      var objeto;
      for (var i = 0; i < response.length; i++) {
        for (var j = 0; j < response[i].lote.length; j++) {
          objeto = {origen: response[i].lote[j].paisTrader.nombrePais, cantidad: response[i].lote[j].bultos, materia: response[i].lote[j].materiaPrima.nombreMateriaPrima, kilos: response[i].lote[j].cantidad};
          listaPais.push(objeto);
        }
      }
      eliminarPaisDup(listaPais);
    });
  }

  $scope.filtroFechaPais = function(inicio, fin){
    var usuario = {id_usuario: $rootScope.loggedUser.id_usuario};
    $http.post('/api/solicitudesDashboard', usuario).success(function(response) {
      var fecha1 = inicio.getTime();
      var fecha2 = fin.getTime();
      var fecha3;
      var fechaAuxiliar;
      var listaNueva = [];

      for (var i = 0; i < response.length; i++) {
        fechaAuxiliar = Date.parse(response[i].fecha_creacion);
        if (fechaAuxiliar >= fecha1 && fechaAuxiliar <= fecha2) {
          listaNueva.push(response[i]);
        }
      }

      var listaPais = [];
      var objeto;

      for (var i = 0; i < listaNueva.length; i++) {
        for (var j = 0; j < listaNueva[i].lote.length; j++) {
          objeto = {origen: listaNueva[i].lote[j].paisTrader.nombrePais, cantidad: listaNueva[i].lote[j].bultos, materia: listaNueva[i].lote[j].materiaPrima.nombreMateriaPrima, kilos: listaNueva[i].lote[j].cantidad};
          listaPais.push(objeto);
        }
      }
      eliminarPaisDup(listaPais);
    });
  }


  function eliminarPaisDup(arr) {
    var i;
    var out = [];
    var obj = {};

    for (i=0;i< arr.length;i++) {
      obj[arr[i].origen]=0;
    }
    for (i in obj) {
      out.push(i);
    }


    var cant;
    var listaData = [];
    for (var i = 0; i < out.length; i++) {
      cant = 0;
      for (var j = 0; j < arr.length; j++) {
        if (out[i] === arr[j].origen) {
          cant = cant + Number(arr[j].cantidad);
        }
      }
      var aux = {name: out[i], data: [cant], type: 'column', id: i};
      listaData.push(aux);
    }



    var cant;
    var listaData = [];
    var listaAux;
    var listaFin = [];
    for (var i = 0; i < out.length; i++) {
      listaAux = [];
      cant = 0;
      for (var j = 0; j < arr.length; j++) {
        if (out[i] === arr[j].origen) {
          cant =  cant + Number(arr[j].cantidad);
          listaAux.push(arr[j].materia);
        }
      }

      var out2 = [];
      var obj2= {};

      for (k=0;k< listaAux.length;k++) {
        obj2[listaAux[k]]=0;
      }
      for (k in obj2) {
        out2.push(k);
      }

      var nuevo = {origen: out[i], lista: out2};
      listaFin.push(nuevo);
      var aux = {name: out[i], data: [{name: out[i], y: cant, drilldown: out[i]}]};
      listaData.push(aux);
    }

    var contMateria;
    var listaMateria;
    var listaFinal = [];

    for (var i = 0; i < listaFin.length; i++) {
      listaMateria = [];
      for (var j = 0; j < listaFin[i].lista.length; j++) {
        contMateria = 0;
        for (var k = 0; k < arr.length; k++) {
          if (listaFin[i].origen === arr[k].origen && listaFin[i].lista[j] === arr[k].materia) {
            contMateria =  contMateria + Number(arr[k].kilos);
          }
        }
        var nuevo = [listaFin[i].lista[j], contMateria];
        listaMateria.push(nuevo);
      }
      var nuevo = {id: listaFin[i].origen, name:  listaFin[i].origen, data: listaMateria};
      listaFinal.push(nuevo);
    }

    // carga grafico
    $('#container4').highcharts({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Cantidad por Pais'
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        categories: ['Paises']
      },
      yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
          text: 'Materias por País'
        }
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y}'
          }
        }
      },

      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
      },
      series: listaData,
      drilldown: {
        series: listaFinal
      }
    });

  }
  //--------------------------------------------------------------------------------------------------------------------------------//





  //Metodos Dashboards Administrador
  //--------------------------------------------------------------------------------------------------------------------------------//

  $scope.traerSolicitudeLoteUsuario = function() {
    $http.get('/api/OTAdminAnimal').success(function(response){
      var listaLotes = [];
      var objeto;
      for (var i = 0; i < response.length; i++) {
        for (var j = 0; j < response[i].lote.length; j++) {
          if (response[i].tipoMuestreo.id_muestreo != 7) {
            objeto = {cliente: response[i].cliente.nombre, cantidad: response[i].lote[j].bultos, tipo: response[i].tipoMuestreo.descripcion , materia: response[i].lote[j].materiaPrima.nombreMateriaPrima, kilos: response[i].lote[j].cantidad};
            listaLotes.push(objeto);
          }else {
            objeto = {cliente: response[i].cliente.nombre, cantidad: response[i].lote[j].bultos, tipo: response[i].tipoMuestreo.descripcion , materia: response[i].lote[j].tipoAceite, kilos: response[i].lote[j].cantidad};
            listaLotes.push(objeto);
          }

        }
      }
      eliminarAdminLoteDup(listaLotes);
    });
  }

  function eliminarAdminLoteDup(arr){

    var i;
    var out = [];
    var obj = {};

    for (i=0;i< arr.length;i++) {
      obj[arr[i].cliente]=0;
    }
    for (i in obj) {
      out.push(i);
    }


    var listaTipo = [];
    var listaData = [];
    for (var i = 0; i < out.length; i++) {
      cant = 0;
      for (var j = 0; j < arr.length; j++) {
        if (out[i] === arr[j].cliente) {
          listaTipo.push(arr[j])
        }
      }
      var aux = {cliente: out[i], lista: listaTipo};
      listaData.push(aux);
    }
    console.log(listaData);


    var listaMateria = [];
    var listaSemi = [];
    for (var i = 0; i < out.length; i++) {
      for (var j = 0; j < listaData.length; j++) {
        if (out[i] === listaData[j].cliente) {
          for (var k = 0; k < listaData[j].lista.length; k++) {
            var aux = {materia: listaData[j].lista[k].materia, cantidad: listaData[j].lista[k].cantidad , tipo : listaData[j].lista[k].tipo};
            listaMateria.push(aux);
          }
          var nuevo = {cliente: out[i], lista: listaMateria};
          listaSemi.push(nuevo);
        }
      }
    }




    var out3 = [];
    var obj3 = {};
    var listaFin = [];


    for (var i = 0; i < out.length; i++) {
      for (var j = 0; j < listaSemi.length; j++) {
        if (out[i] === listaSemi[j].cliente) {
          for (q=0;q< listaSemi[j].lista.length;q++) {
            obj3[listaSemi[j].lista[q].materia]=0;
          }
          for (r in obj3) {
            out3.push(r);
          }
        }
      }
      var aux = {cliente: out[i], lista: out3};
      listaFin.push(aux);
    }

    console.log(listaFin);




    // var cant;
    // var listaData = [];
    // var listaAux;
    // var listaFin = [];
    // for (var i = 0; i < out.length; i++) {
    //   listaAux = [];
    //   cant = 0;
    //   for (var j = 0; j < arr.length; j++) {
    //     if (out[i] === arr[j].origen) {
    //       cant =  cant + Number(arr[j].cantidad);
    //       listaAux.push(arr[j].materia);
    //     }
    //   }
    //
    //   var out2 = [];
    //   var obj2= {};
    //
    //   for (k=0;k< listaAux.length;k++) {
    //     obj2[listaAux[k]]=0;
    //   }
    //   for (k in obj2) {
    //     out2.push(k);
    //   }
    //
    //   var nuevo = {origen: out[i], lista: out2};
    //   listaFin.push(nuevo);
    //   var aux = {name: out[i], data: [{name: out[i], y: cant, drilldown: out[i]}]};
    //   listaData.push(aux);
    // }
    //
    // var contMateria;
    // var listaMateria;
    // var listaFinal = [];
    //
    // for (var i = 0; i < listaFin.length; i++) {
    //   listaMateria = [];
    //   for (var j = 0; j < listaFin[i].lista.length; j++) {
    //     contMateria = 0;
    //     for (var k = 0; k < arr.length; k++) {
    //       if (listaFin[i].origen === arr[k].origen && listaFin[i].lista[j] === arr[k].materia) {
    //         contMateria =  contMateria + Number(arr[k].kilos);
    //       }
    //     }
    //     var nuevo = [listaFin[i].lista[j], contMateria];
    //     listaMateria.push(nuevo);
    //   }
    //   var nuevo = {id: listaFin[i].origen, name:  listaFin[i].origen, data: listaMateria};
    //   listaFinal.push(nuevo);
    // }


  }

  //--------------------------------------------------------------------------------------------------------------------------------//



  traerAvisosFiltro();
  //Funcion que carga la lista de avisos del usuario
  //-----------------------------------------------------------------------------------//
  function traerAvisosFiltro() {
    $rootScope.chatUsers = [];
    var id_usuario = $rootScope.loggedUser.id_usuario;
    $http.get('/api/avisos/' + id_usuario).success(function(response) {
      if (response[0] === undefined) {} else {
        for (var i = 0; i < response[0].chatUsers.length; i++) {
          $rootScope.chatUsers.splice(0, 0, response[0].chatUsers[i]);
        }
      }
    });
  }
  //-----------------------------------------------------------------------------------//

  $scope.habilitaTipoMuestreo = false;
  $scope.habilitaTotalLote = false;
  $scope.habilitaPorBodega = false;
  $scope.habilitaPorProveedor = false;
  $scope.habilitaPorPlanta = false;
  $scope.habilitaPorPais = false;
  $scope.habilitaLotesPorCliente = false;
  $scope.habilitaProductosMuestreados = false;
  $scope.habilitaSellosUtilizados = false;
  $scope.habilitaMuestreosArea = false;
  $scope.habilitaMuestreosRetirosCliente = false;

  $scope.mostrarDashboard = function(valor) {
    if (valor === 1) {
      $scope.habilitaTipoMuestreo = true;
      $scope.habilitaTotalLote = false;
      $scope.habilitaPorBodega = false;
      $scope.habilitaPorProveedor = false;
      $scope.habilitaPorPlanta = false;
      $scope.habilitaPorPais = false;
      $scope.traerTipoMuestreoSolicitudes();
    } else if (valor === 2) {
      $scope.habilitaTipoMuestreo = false;
      $scope.habilitaTotalLote = true;
      $scope.habilitaPorBodega = false;
      $scope.habilitaPorProveedor = false;
      $scope.habilitaPorPlanta = false;
      $scope.habilitaPorPais = false;
      $scope.traerSolicitudesHarinaCliente();
    } else if (valor === 3) {
      $scope.habilitaTipoMuestreo = false;
      $scope.habilitaTotalLote = false;
      $scope.habilitaPorBodega = true;
      $scope.habilitaPorProveedor = false;
      $scope.habilitaPorPlanta = false;
      $scope.habilitaPorPais = false;
      $scope.listarBodega();
    } else if (valor === 4) {
      $scope.habilitaTipoMuestreo = false;
      $scope.habilitaTotalLote = false;
      $scope.habilitaPorBodega = false;
      $scope.habilitaPorProveedor = true;
      $scope.habilitaPorPlanta = false;
      $scope.habilitaPorPais = false;
      $scope.traerSolicitudesProveedor();
    } else if (valor === 5) {
      $scope.habilitaTipoMuestreo = false;
      $scope.habilitaTotalLote = false;
      $scope.habilitaPorBodega = false;
      $scope.habilitaPorProveedor = false;
      $scope.habilitaPorPlanta = true;
      $scope.habilitaPorPais = false;
    } else if(valor === 6){
      $scope.habilitaTipoMuestreo = false;
      $scope.habilitaTotalLote = false;
      $scope.habilitaPorBodega = false;
      $scope.habilitaPorProveedor = false;
      $scope.habilitaPorPlanta = false;
      $scope.habilitaPorPais = true;
      $scope.traerSolicitudesPais();
    }else if (valor === 7) {
      $scope.habilitaLotesPorCliente = true;
      $scope.habilitaProductosMuestreados = false;
      $scope.habilitaSellosUtilizados = false;
      $scope.habilitaMuestreosArea = false;
      $scope.habilitaMuestreosRetirosCliente = false;
      $scope.traerSolicitudeLoteUsuario();
    }else if (valor === 8) {
      $scope.habilitaLotesPorCliente = false;
      $scope.habilitaProductosMuestreados = true;
      $scope.habilitaSellosUtilizados = false;
      $scope.habilitaMuestreosArea = false;
      $scope.habilitaMuestreosRetirosCliente = false;
    }
    else if (valor === 9) {
      $scope.habilitaLotesPorCliente = false;
      $scope.habilitaProductosMuestreados = false;
      $scope.habilitaSellosUtilizados = true;
      $scope.habilitaMuestreosArea = false;
      $scope.habilitaMuestreosRetirosCliente = false;
    }else if (valor === 10) {
      $scope.habilitaLotesPorCliente = false;
      $scope.habilitaProductosMuestreados = false;
      $scope.habilitaSellosUtilizados = false;
      $scope.habilitaMuestreosArea = true;
      $scope.habilitaMuestreosRetirosCliente = false;
    }else if (valor === 11) {
      $scope.habilitaLotesPorCliente = false;
      $scope.habilitaProductosMuestreados = false;
      $scope.habilitaSellosUtilizados = false;
      $scope.habilitaMuestreosArea = false;
      $scope.habilitaMuestreosRetirosCliente = true;
    }
  };



  //Metodos para datepicker
  //-----------------------------------------------------------------------------------------------------------------//
  $scope.fecha_inicio_tipo = new Date();
  $scope.fecha_fin_tipo = new Date();
  $scope.fecha_inicio_lote = new Date();
  $scope.fecha_fin_lote = new Date();
  $scope.fecha_inicio_bodega = new Date();
  $scope.fecha_fin_bodega = new Date();
  $scope.fecha_inicio_proveedor = new Date();
  $scope.fecha_fin_proveedor = new Date();
  $scope.fecha_inicio_pais = new Date();
  $scope.fecha_fin_pais = new Date();

  $scope.today = function() {
    $scope.fecha_inicio_tipo = new Date();
    $scope.fecha_fin_tipo = new Date();
    $scope.fecha_inicio_lote = new Date();
    $scope.fecha_fin_lote = new Date();
    $scope.fecha_inicio_bodega = new Date();
    $scope.fecha_fin_bodega = new Date();
    $scope.fecha_inicio_proveedor = new Date();
    $scope.fecha_fin_proveedor = new Date();
    $scope.fecha_inicio_pais = new Date();
    $scope.fecha_fin_pais = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.fecha_inicio_tipo = null;
    $scope.fecha_fin_tipo = null;
    $scope.fecha_inicio_lote = null;
    $scope.fecha_fin_lote = null;
    $scope.fecha_inicio_bodega = null;
    $scope.fecha_fin_bodega = null;
    $scope.fecha_inicio_proveedor = null;
    $scope.fecha_fin_proveedor = null;
    $scope.fecha_inicio_pais = null;
    $scope.fecha_fin_pais = null;
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

  $scope.open3 = function() {
    $scope.popup3.opened = true;
  };

  $scope.open4 = function() {
    $scope.popup4.opened = true;
  };

  $scope.open5 = function() {
    $scope.popup5.opened = true;
  };

  $scope.open6 = function() {
    $scope.popup6.opened = true;
  };

  $scope.open7 = function() {
    $scope.popup7.opened = true;
  };

  $scope.open8 = function() {
    $scope.popup8.opened = true;
  };

  $scope.open9 = function() {
    $scope.popup9.opened = true;
  };

  $scope.open10 = function() {
    $scope.popup10.opened = true;
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

  $scope.popup3 = {
    opened: false
  };

  $scope.popup4 = {
    opened: false
  };

  $scope.popup5 = {
    opened: false
  };

  $scope.popup6 = {
    opened: false
  };

  $scope.popup7 = {
    opened: false
  };

  $scope.popup8 = {
    opened: false
  };

  $scope.popup9 = {
    opened: false
  };

  $scope.popup10 = {
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
  //
  //
  //
  // $scope.habilitar1 = false;
  // $scope.habilitar2 = false;
  // $scope.habilitar3 = false;
  // $scope.habilitar4 = false;
  // $scope.habilitarGeneral = true;
  //
  // validarUsuario();
  // function validarUsuario(){
  //   if ($rootScope.loggedUser.perfil[0].id_perfil !== 1) {
  //     solicitudesHarinaCliente();
  //   }
  // }
  //
  //
  //
  // function solicitudesHarinaCliente() {
  //   var usuario = {id_usuario: $rootScope.loggedUser.id_usuario};
  //   $http.post('/api/solicitudesDashboard', usuario).success(function(response) {
  //
  //     var solIniciada = [{"name": "Solicitud Iniciada", "id": "0", "color": "#058DC7 "}];
  //     var solAsignada = [{"name": "Inspección Asignada", "id": "1", "color": "#24ED5D "}];
  //     var solLaboratorio = [{"name": "Laboratorio", "id": "2", "color": "#0EF6D3 "}];
  //     var solTransporte = [{"name": "Inspección Transporte", "id": "3", "color": "#F1C420 "}];
  //     var listaIniciada = [];
  //     var listaAsignada = [];
  //     var listaLab = [];
  //     var listaTrans = [];
  //     var contIni;
  //     var contAsi;
  //     var contLab;
  //     var contTrans;
  //     var index;
  //
  //     for (var i = 0; i < response.length; i++) {
  //
  //       contIni = 0;
  //       contAsi = 0;
  //       contLab = 0;
  //       contTrans = 0;
  //
  //       if (response[i].proceso[0].id_proceso === 1) {
  //         var solIni = {"name": "Solicitud " + response[i].id_solicitud_cliente, "id": "O_" + i, "parent": "0", "value": response[i].lote.length};
  //         listaIniciada.push(solIni);
  //       }else if (response[i].proceso[0].id_proceso >= 4) {
  //
  //         for (var j = 0; j < response[i].lote.length; j++) {
  //           if (response[i].lote[j].inspectorEnvia === undefined && response[i].lote[j].envia === undefined) {
  //             contAsi++;
  //             index = i;
  //           }else if (response[i].lote[j].inspectorEnvia === true && response[i].lote[j].envia === undefined) {
  //             contLab++;
  //             index = i;
  //           }else if (response[i].lote[j].inspectorEnvia === true && response[i].lote[j].envia === true && response[i].lote[j].finalizado === undefined) {
  //             contTrans++;
  //             index = i;
  //           }
  //         }
  //
  //         if (contAsi > 0) {
  //           var solAsi = {"name": "Solicitud " + response[i].id_solicitud_cliente, "id": "O_" + index, "parent": "1", "value": contAsi};
  //           listaAsignada.push(solAsi);
  //         }
  //         if (contLab > 0) {
  //           var solLab = {"name": "Solicitud " + response[i].id_solicitud_cliente, "id": "O_" + index, "parent": "2", "value": contLab};
  //           listaLab.push(solLab);
  //         }
  //         if (contTrans > 0) {
  //           var solTrans = {"name": "Solicitud " + response[i].id_solicitud_cliente, "id": "O_" + index, "parent": "3", "value": contTrans};
  //           listaTrans.push(solTrans);
  //         }
  //       }
  //     }
  //
  //     var solIniciadaFinal = solIniciada.concat(listaIniciada);
  //     var solAsignadaFinal = solAsignada.concat(listaAsignada);
  //     var solLaboratorioFinal = solLaboratorio.concat(listaLab);
  //     var solTransporteFinal = solTransporte.concat(listaTrans);
  //     var paso1 = solIniciadaFinal.concat(solAsignadaFinal);
  //     var paso2 = paso1.concat(solLaboratorioFinal);
  //     var pasoFinal = paso2.concat(solTransporteFinal);
  //
  //
  //     var data = pasoFinal;
  //     $(function() {
  //
  //       function redirect() {
  //         window.location = '#/creacionSolicitudHarina';
  //       }
  //
  //
  //       var chart = new Highcharts.Chart({
  //         chart: {
  //           renderTo: 'container'
  //         },
  //         series: [{
  //           type: "treemap",
  //           layoutAlgorithm: 'squarified',
  //           allowDrillToNode: true,
  //           dataLabels: {
  //             enabled: false
  //           },
  //           levelIsConstant: false,
  //           levels: [{
  //             level: 1,
  //             dataLabels: {
  //               enabled: true
  //             },
  //             borderWidth: 3
  //           }],
  //           data: data,
  //           events: {
  //             click: function() {
  //               contTree++;
  //               if (contTree == 2) {
  //                 redirect();
  //                 contTree = 0;
  //               }
  //
  //             }
  //           }
  //         }],
  //         subtitle: {
  //           text: '   '
  //         },
  //         title: {
  //           text: 'Solicitudes'
  //         }
  //       });
  //     });
  //
  //     //--------------------------------------------------------------------------------------------------------------------------------//
  //
  //     $(function() {
  //
  //       function redirect() {
  //         window.location = '#/creacionSolicitudHarina';
  //       }
  //
  //       var data = solIniciadaFinal;
  //       var chart = new Highcharts.Chart({
  //         chart: {
  //           renderTo: 'container1'
  //         },
  //         series: [{
  //           type: "treemap",
  //           layoutAlgorithm: 'squarified',
  //           allowDrillToNode: true,
  //           dataLabels: {
  //             enabled: false
  //           },
  //           levelIsConstant: false,
  //           levels: [{
  //             level: 1,
  //             dataLabels: {
  //               enabled: true
  //             },
  //             borderWidth: 3
  //           }],
  //           data: data,
  //           events: {
  //             click: function() {
  //               contTree++;
  //               if (contTree == 2) {
  //                 redirect();
  //                 contTree = 0;
  //               }
  //
  //             }
  //           }
  //         }],
  //         subtitle: {
  //           text: ''
  //         },
  //         title: {
  //           text: 'Solicitudes Iniciadas'
  //         }
  //       });
  //     });
  //
  //
  //     //------------------------------------------------------------------------------------------------------------------------------------//
  //     $(function() {
  //
  //       function redirect() {
  //         window.location = '#/creacionSolicitudHarina';
  //       }
  //
  //       var data = solAsignadaFinal;
  //       var chart = new Highcharts.Chart({
  //         chart: {
  //           renderTo: 'container2'
  //         },
  //         series: [{
  //           type: "treemap",
  //           layoutAlgorithm: 'squarified',
  //           allowDrillToNode: true,
  //           dataLabels: {
  //             enabled: false
  //           },
  //           levelIsConstant: false,
  //           levels: [{
  //             level: 1,
  //             dataLabels: {
  //               enabled: true
  //             },
  //             borderWidth: 3
  //           }],
  //           data: data,
  //           events: {
  //             click: function() {
  //               contTree++;
  //               if (contTree == 2) {
  //                 redirect();
  //                 contTree = 0;
  //               }
  //
  //             }
  //           }
  //         }],
  //         subtitle: {
  //           text: ''
  //         },
  //         title: {
  //           text: 'Solicitudes Asignadas'
  //         }
  //       });
  //     });
  //
  //
  //     //-----------------------------------------------------------------------------------------------------------------------------------//
  //     $(function() {
  //
  //       function redirect() {
  //         window.location = '#/creacionSolicitudHarina';
  //       }
  //
  //       var data = solLaboratorioFinal;
  //       var chart = new Highcharts.Chart({
  //         chart: {
  //           renderTo: 'container3'
  //         },
  //         series: [{
  //           type: "treemap",
  //           layoutAlgorithm: 'squarified',
  //           allowDrillToNode: true,
  //           dataLabels: {
  //             enabled: false
  //           },
  //           levelIsConstant: false,
  //           levels: [{
  //             level: 1,
  //             dataLabels: {
  //               enabled: true
  //             },
  //             borderWidth: 3
  //           }],
  //           data: data,
  //           events: {
  //             click: function() {
  //               contTree++;
  //               if (contTree == 2) {
  //                 redirect();
  //                 contTree = 0;
  //               }
  //
  //             }
  //           }
  //         }],
  //         subtitle: {
  //           text: ''
  //         },
  //         title: {
  //           text: 'Solicitudes en Laboratorio'
  //         }
  //       });
  //     });
  //
  //
  //     //-------------------------------------------------------------------------------------------------------------------------------------//
  //     $(function() {
  //
  //       function redirect() {
  //         window.location = '#/creacionSolicitudHarina';
  //       }
  //
  //       var data = solTransporteFinal;
  //       var chart = new Highcharts.Chart({
  //         chart: {
  //           renderTo: 'container4'
  //         },
  //         series: [{
  //           type: "treemap",
  //           layoutAlgorithm: 'squarified',
  //           allowDrillToNode: true,
  //           dataLabels: {
  //             enabled: false
  //           },
  //           levelIsConstant: false,
  //           levels: [{
  //             level: 1,
  //             dataLabels: {
  //               enabled: true
  //             },
  //             borderWidth: 3
  //           }],
  //           data: data,
  //           events: {
  //             click: function() {
  //               contTree++;
  //               if (contTree == 2) {
  //                 redirect();
  //                 contTree = 0;
  //               }
  //
  //             }
  //           }
  //         }],
  //         subtitle: {
  //           text: ''
  //         },
  //         title: {
  //           text: 'Solicitudes en Despacho'
  //         }
  //       });
  //     });
  //
  //   });
  // }
  //
  // //--------------------------------------------------------------------------------------------------------------------------------//
  //
  // //------------------------------------------------------------------------------------------------------------------------//
  // $scope.cambioChart = function(valor) {
  //
  //   contTree = 0;
  //
  //   if (valor === 1) {
  //     $scope.habilitar1 = true;
  //     $scope.habilitar2 = false;
  //     $scope.habilitar3 = false;
  //     $scope.habilitar4 = false;
  //     $scope.habilitarGeneral = false;
  //   } else if (valor === 2) {
  //     $scope.habilitar1 = false;
  //     $scope.habilitar2 = true;
  //     $scope.habilitar3 = false;
  //     $scope.habilitar4 = false;
  //     $scope.habilitarGeneral = false;
  //   } else if (valor === 3) {
  //     $scope.habilitar1 = false;
  //     $scope.habilitar2 = false;
  //     $scope.habilitar3 = true;
  //     $scope.habilitar4 = false;
  //     $scope.habilitarGeneral = false;
  //   } else if (valor === 4) {
  //     $scope.habilitar1 = false;
  //     $scope.habilitar2 = false;
  //     $scope.habilitar3 = false;
  //     $scope.habilitar4 = true;
  //     $scope.habilitarGeneral = false;
  //   } else {
  //     $scope.habilitar1 = false;
  //     $scope.habilitar2 = false;
  //     $scope.habilitar3 = false;
  //     $scope.habilitar4 = false;
  //     $scope.habilitarGeneral = true;
  //   }
  //
  // };

});
