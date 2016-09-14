app.controller('parametrosController', function($scope, $http, $notify){

  listarBodegas();
  listarPaises();
  // listarProductos();
  listarUsuarios();
  // listarRegiones();
  listarTipoMuestreo();
  // listarTipoAnalisis();
  // listarTipoEnvases();

  $scope.materiaPrima = false;
  $scope.Proveedor = false;
  $scope.bodegaUsuario = false;
  $scope.muestreoDiv = false;
  // $scope.Envases = false;
  $scope.paisesProducto = false;
  // $scope.analisisDiv = false;
  $scope.muestra = function(valor){
    if (valor === 1) {
      $scope.materiaPrima = true;
      $scope.Proveedor = false;
      $scope.bodegaUsuario = false;
      $scope.muestreoDiv = false;
      // $scope.Envases = false;
      $scope.paisesProducto = false;
      // $scope.analisisDiv = false;
    }else if (valor === 2) {
      $scope.materiaPrima = false;
      $scope.Proveedor = false;
      $scope.bodegaUsuario = true;
      $scope.muestreoDiv = false;
      // $scope.Envases = false;
      $scope.paisesProducto = false;
      // $scope.analisisDiv = false;
    }else if (valor === 3) {
      $scope.materiaPrima = false;
      $scope.Proveedor = false;
      $scope.bodegaUsuario = false;
      $scope.muestreoDiv = true;
      // $scope.Envases = false;
      $scope.paisesProducto = false;
      // $scope.analisisDiv = false;
    }else if (valor === 4) {
      $scope.materiaPrima = false;
      $scope.Proveedor = false;
      $scope.bodegaUsuario = false;
      $scope.muestreoDiv = false;
      // $scope.Envases = true;
      $scope.paisesProducto = false;
      // $scope.analisisDiv = false;
    }else if (valor === 5) {
      $scope.materiaPrima = false;
      $scope.Proveedor = false;
      $scope.bodegaUsuario = false;
      $scope.muestreoDiv = false;
      // $scope.Envases = false;
      $scope.paisesProducto = true;
      // $scope.analisisDiv = false;
    }else if (valor === 6) {
      $scope.materiaPrima = false;
      $scope.Proveedor = false;
      $scope.bodegaUsuario = false;
      $scope.muestreoDiv = false;
      // $scope.Envases = false;
      $scope.paisesProducto = false;
      // $scope.analisisDiv = true;
    }else if (valor === 7) {
      $scope.materiaPrima = false;
      $scope.Proveedor = true;
      $scope.bodegaUsuario = false;
      $scope.muestreoDiv = false;
      // $scope.Envases = false;
      $scope.paisesProducto = false;
      // $scope.analisisDiv = true;
    }
  }
  //-------------------------------------------------------------------------------------------------------------------//

  //Funcion que trae los clientes de la base de datos.
  //-----------------------------------------------------------------------------------//
  listarUsuarios();
  function listarUsuarios(){
    var id_perfil = 2;
    $http.get('/api/usuarios/' + id_perfil ).success(function(response){
      $scope.listarUsuarios = response;
    });
  };
  //-----------------------------------------------------------------------------------//

  //Metodo que lista las regiones de chile de la base de datos.
  //-------------------------------------------------------------------------------------------------------------------//
  function listarRegiones(){
    $http.get('/api/region').success(function(response){
      $scope.listarRegiones = response;
    });
  }
  //-------------------------------------------------------------------------------------------------------------------//


  //Metodo que lista las comunas de chile de la base de datos.
  //-------------------------------------------------------------------------------------------------------------------//
  $scope.listarComunasFiltro = function(region){
    var id = region.id_region;
    $http.get('/api/comuna/' + id).success(function(response){
      $scope.listarComunas = response;
    });
  }
  //-------------------------------------------------------------------------------------------------------------------//

  //-------------------------------------------------------------------------------------------------------//

  //Traders
  //-------------------------------------------------------------------------------------------------------//
  listaTraders();
    function listaTraders(){
      $http.get('/api/trader').success(function(response){
        $scope.listaTraders = response;
      });
    }

  $scope.crearTrader = function(trader){
    var nuevo = {nombreTrader: trader};
    $http.post('/api/trader/', nuevo).success(function(respuesta){
      if (respuesta === '1') {
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.error('Notificacion', 'Proveedor ya existe');
        $scope.nombreTrader = '';
      }else {
        $scope.listaTraders = respuesta;
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.success('Notificacion', 'Proveedor creado');
        $scope.nombreTrader = '';
      }
    });
  }

  $scope.modificaTrader = function (seleccion, trader){
    var id_trader = seleccion.id_trader;
    var nuevo = {'id_trader': id_trader, 'nombreTrader': trader};
    $http.post('/api/modificaTrader', nuevo).success(function(response){
      if (response === '1') {
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.error('Notificacion', 'Proveedor ya existe');
        $scope.nombreTrader = '';
      }else {
        $scope.listaTraders = response;
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.info('Notificacion', 'Proveedor modificado');
        $scope.nombreTrader = '';
      }
    });
  }

  $scope.eliminaTrader = function(seleccion){
    var id_trader = {'id_trader': seleccion.id_trader};
    $http.post('/api/eliminaTrader', id_trader).success(function(response){
      if (response !== '') {
        $scope.listaTraders = response;
      }
    });
    $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
    $notify.setPosition('bottom-left');
    $notify.error('Notificacion', 'Proveedor eliminado');
  }
  //-------------------------------------------------------------------------------------------------------//


  //Materia Prima
  //-------------------------------------------------------------------------------------------------------//

 $scope.listarMateriaPrima =  function(id_materia){
    var id_materia = Number(id_materia);
    $http.get('/api/materiaPrima/' + id_materia).success(function(response){
      $scope.listarMateriaPrima = response;
    });
  }
  $scope.crearMateria = function(id_materia, materia){
    var nuevo = {'materia': id_materia, 'nombreMateriaPrima': materia};
    $http.post('/api/materiaPrima', nuevo).success(function(respuesta){
      if (respuesta === '1') {
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.error('Notificacion', 'Materia prima ya existe');
        $scope.nombreMateriaPrima = '';
      }else{
        $scope.listarMateriaPrima = respuesta;
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.success('Notificacion', 'Materia prima creada');
        $scope.nombreMateriaPrima = '';
      }
    });
  }
  $scope.modificaMateriaPrima = function (materiaPrimaSeleccion, nombreMateriaPrima){
    var id_materiaPrima = materiaPrimaSeleccion.id_materiaPrima;
    var nuevo = {'nombreMateriaPrima': nombreMateriaPrima, 'id_materiaPrima': id_materiaPrima};
    $http.post('/api/modificaMateriaPrima', nuevo).success(function(response){
      if (response === '1') {
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.error('Notificacion', 'Materia prima ya existe');
        $scope.nombreMateriaPrima = '';
      }else {
        $scope.listarMateriaPrima = response;
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.info('Notificacion', 'Materia prima modificada');
        $scope.nombreMateriaPrima = '';
      }
    });
  }

  $scope.eliminaMateriaPrima = function(materia){
    var id = {'id_materiaPrima': materia.id_materiaPrima};
    $http.post('/api/eliminaMateriaPrima', id ).success(function(response){
      if (response !== '') {
        $scope.listarMateriaPrima = response;
      }
    });
    $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
    $notify.setPosition('bottom-left');
    $notify.error('Notificacion', 'Materia prima eliminada');
  }
  //-------------------------------------------------------------------------------------------------------//


  //Bodegas
  //-------------------------------------------------------------------------------------------------------//
  //Funcion que trae todos las bodegas por id_usuario de la base de datos.
  function listarBodegas(){
    $http.get('/api/traerBodega').success(function(response){
      $scope.listarBodegas = response;
    });
  };
  // //Este metodo agrega una bodega a la base de datos
  $scope.crearBodega = function (bodega){
    var nuevo = {nombreBodega: bodega};
    $http.post('/api/bodega/', nuevo).success(function(respuesta){
      if (respuesta === '1') {
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.error('Notificacion', 'Bodega ya existe');
        $scope.nombreBodega = '';
      }else {
        $scope.listarBodegas = respuesta;
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.success('Notificacion', 'Bodega creada');
        $scope.nombreBodega = '';
      }
    });
  };
  //
  // //Este metodo modifica una bodega de la base de datos
  $scope.modificaBodega = function (bodega, nombreBodega){
    var id_bodega = bodega;
    var nuevo = {nombreBodega: nombreBodega};
    $http.put('/api/bodega/' + id_bodega, nuevo).success(function(response){
      if (response === '1') {
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.error('Notificacion', 'Bodega ya existe');
        $scope.nombreBodega = '';
      }else {
        $scope.listarBodegas = response;
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.info('Notificacion', 'Bodega modificada');
        $scope.nombreBodega = '';
      }
    });
  };
  // //Este metodo elimina una bodega de la base de datos
  $scope.eliminaBodega = function (bodega){
    var id_bodega = bodega;
    var usuario_bodega = {id_bodega: id_bodega};
    $http.post('/api/eliminaBodega', usuario_bodega).success(function(response){
      if (response[0] !== undefined) {
        $scope.listarBodegas = response;
      }
    });
    $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
    $notify.setPosition('bottom-left');
    $notify.error('Notificacion', 'Bodega eliminada');
  };
  //-------------------------------------------------------------------------------------------------------//


  //Metodos para mantenedores de Tipo de muestreo
  //-------------------------------------------------------------------------------------------------------//
  //Funcion que trae todos los documentos tipo muestreo de la mongodb
  function listarTipoMuestreo(){
    $http.get('/api/tipoMuestreo').success(function(response){
      $scope.listaTipoMuestreo = response;
    });
  };
  //Este metodo agrega un documento tipo de muestreo a la mongodb
  $scope.crearTipoMuestreo = function (muestreo){
    var nuevo = {tipoMuestreo: muestreo};
    $http.post('/api/tipoMuestreo/', nuevo).success(function(respuesta){
      if (respuesta === '1') {
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.error('Notificacion', 'Tipo Muestreo existente');
        $scope.muestreo = '';
      }else{
        $scope.listaTipoMuestreo = respuesta;
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.success('Notificacion', 'Tipo Muestreo creado');
        $scope.muestreo = '';
      }
    });
  };

  //Este metodo modifica un documento tipo de muestreo de la mongodb
  $scope.modificaTipoMuestreo = function (muestreoSeleccion, muestreo){
    var tipoMuestreo = muestreo;
    var nuevo = {id_tipoMuestreo: muestreoSeleccion, tipoMuestreo: tipoMuestreo};
    $http.put('/api/tipoMuestreo/' + muestreoSeleccion, nuevo).success(function(response){
      if (response === '1') {
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.error('Notificacion', 'Tipo Muestreo ya existe');
        $scope.muestreo = '';
      }else {
        $scope.listaTipoMuestreo = response;
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.info('Notificacion', 'Tipo Muestreo modificado');
        $scope.muestreo = '';
      }
    });
  };

  //Este metodo elimina un documento tipo muestreo de la mongodb
  $scope.eliminaTipoMuestreo = function (muestreoSeleccion){
    $http.delete('/api/tipoMuestreo/' + muestreoSeleccion ).success(function(response){
      $scope.listaTipoMuestreo = response;
    });
    $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
    $notify.setPosition('bottom-left');
    $notify.error('Notificacion', 'Tipo Muestreo eliminado');
  };

  //-------------------------------------------------------------------------------------------------------//


  // //Metodos para mantenedores de Tipo de analisis
  // //-------------------------------------------------------------------------------------------------------//
  // //Funcion que trae todos los documentos tipo analisis de la mongodb
  // function listarTipoAnalisis(){
  //   $http.get('/api/tipoAnalisis').success(function(response){
  //     $scope.listaTipoAnalisis = response;
  //   });
  // };
  // //Este metodo agrega un documento tipo de analisis a la mongodb
  // $scope.crearTipoAnalisis = function (analisis){
  //   var nuevo = {tipoAnalisis: analisis};
  //   $http.post('/api/tipoAnalisis/', nuevo).success(function(respuesta){
  //     $scope.listaTipoAnalisis = respuesta;
  //   });
  //   $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
  //   $notify.setPosition('bottom-left');
  //   $notify.success('Notificacion', 'Tipo analisis creado');
  //   $scope.analisis = '';
  // };
  //
  // //Este metodo modifica un documento tipo de analisis de la mongodb
  // $scope.modificaTipoAnalisis = function (analisisSeleccion, analisis){
  //   var tipoAnalisis = analisis;
  //   var nuevo = {id_tipoAnalisis: analisisSeleccion, tipoAnalisis: tipoAnalisis};
  //   $http.put('/api/tipoAnalisis/' + analisisSeleccion, nuevo).success(function(response){
  //     $scope.listaTipoAnalisis = response;
  //   });
  //   $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
  //   $notify.setPosition('bottom-left');
  //   $notify.info('Notificacion', 'Tipo analisis modificado');
  //   $scope.analisis = '';
  // };
  //
  // //Este metodo elimina un documento tipo muestreo de la mongodb
  // $scope.eliminaTipoAnalisis = function (analisisSeleccion){
  //   $http.delete('/api/tipoAnalisis/' + analisisSeleccion ).success(function(response){
  //     $scope.listaTipoAnalisis = response;
  //   });
  //   $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
  //   $notify.setPosition('bottom-left');
  //   $notify.error('Notificacion', 'Tipo analisis eliminado');
  // };
  // //-------------------------------------------------------------------------------------------------------//
  //
  //
  // //Metodos para mantenedores de Tipo de envase
  // //-------------------------------------------------------------------------------------------------------//
  // //Funcion que trae todos los documentos tipo envase de la mongodb
  // function listarTipoEnvases(){
  //   $http.get('/api/tipoEnvase').success(function(response){
  //     $scope.listaTipoEnvase = response;
  //   });
  // };
  // //Este metodo agrega un documento tipo de envase a la mongodb
  // $scope.crearTipoEnvase = function (tipoEnvase){
  //   var nuevo = {tipoEnvase: tipoEnvase};
  //   $http.post('/api/tipoEnvase/', nuevo).success(function(respuesta){
  //     $scope.listaTipoEnvase = respuesta;
  //   });
  //   $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
  //   $notify.setPosition('bottom-left');
  //   $notify.success('Notificacion', 'Tipo Envase creado');
  //   $scope.tipoEnvase = '';
  // };
  //
  // //Este metodo modifica un documento tipo de envase de la mongodb
  // $scope.modificaTipoEnvase = function (tipoEnvaseSeleccion, tipoEnvase){
  //   var tipoEnvase = tipoEnvase;
  //   var nuevo = {id_tipoEnvase: tipoEnvaseSeleccion, tipoEnvase: tipoEnvase};
  //   $http.put('/api/tipoEnvase/' + tipoEnvaseSeleccion, nuevo).success(function(response){
  //     $scope.listaTipoEnvase = response;
  //   });
  //   $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
  //   $notify.setPosition('bottom-left');
  //   $notify.info('Notificacion', 'Tipo Envase modificado');
  //   $scope.tipoEnvase = '';
  // };
  //
  // //Este metodo elimina un documento tipo envase de la mongodb
  // $scope.eliminaTipoEnvase = function (tipoEnvaseSeleccion){
  //   $http.delete('/api/tipoEnvase/' + tipoEnvaseSeleccion ).success(function(response){
  //     $scope.listaTipoEnvase = response;
  //   });
  //   $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
  //   $notify.setPosition('bottom-left');
  //   $notify.error('Notificacion', 'Tipo Envase eliminado');
  // };
  // //-------------------------------------------------------------------------------------------------------//
  //
  //
  // //Metodos para mantenedores de envase
  // //-------------------------------------------------------------------------------------------------------//
  // //Funcion que trae todos los documentos envase de la mongodb acorde a un id
  // $scope.listarEnvasesFiltro = function(tipoEnvaseSeleccion){
  //   var id = tipoEnvaseSeleccion.id_tipoEnvase;
  //   $http.get('/api/envase/' + id ).success(function(response){
  //     $scope.listaEnvases = response;
  //   });
  // };
  // //Este metodo agrega un documento envase a la mongodb
  // $scope.crearEnvase = function (tipoEnvaseSeleccion ,envase){
  //   var id = tipoEnvaseSeleccion.id_tipoEnvase;
  //   var nuevo = {id_tipoEnvase: id ,envase: envase};
  //   $http.post('/api/envase/', nuevo).success(function(respuesta){
  //     $scope.listarEnvasesFiltro(tipoEnvaseSeleccion);
  //   });
  //   $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
  //   $notify.setPosition('bottom-left');
  //   $notify.success('Notificacion', 'Envase creado');
  //   $scope.envase = '';
  // };
  //
  // //Este metodo modifica un documento envase de la mongodb
  // $scope.modificaEnvase = function (envaseSeleccion, envase){
  //   var envase = envase;
  //   var nuevo = {id_envase: envaseSeleccion, envase: envase};
  //   $http.put('/api/envase/' + envaseSeleccion, nuevo).success(function(response){
  //     $scope.listaEnvases = response;
  //   });
  //   $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
  //   $notify.setPosition('bottom-left');
  //   $notify.info('Notificacion', 'Envase modificado');
  //   $scope.envase = '';
  // };
  //
  // //Este metodo elimina un documento envase de la mongodb
  // $scope.eliminaEnvase = function (envaseSeleccion){
  //   $http.delete('/api/envase/' + envaseSeleccion ).success(function(response){
  //     $scope.listaEnvases = response;
  //   });
  //   $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
  //   $notify.setPosition('bottom-left');
  //   $notify.error('Notificacion', 'Envase eliminado');
  // };
  // //-------------------------------------------------------------------------------------------------------//


  //Paises
  //-------------------------------------------------------------------------------------------------------//
  //Funcion que trae todos los paises de la base de datos.
  function listarPaises(){
    $http.get('/api/pais/').success(function(response){
      $scope.listarPaises = response;
    });
  };
  //Este metodo agrega un pais a la base de datos
  $scope.crearPais = function (pais){
    var pais = {nombrePais: pais};
    $http.post('/api/pais/', pais).success(function(respuesta){
      if (respuesta === '1') {
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.error('Notificacion', 'Pais ya existe');
        $scope.nombrePais = '';
      }else{
        $scope.listarPaises = respuesta;
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.success('Notificacion', 'Pais creado');
        $scope.nombrePais = '';
      }
    });
  };
  //Este metodo elimina un trader de la base de datos
  $scope.eliminaPais = function(id_pais){
    $http.delete('/api/pais/' + id_pais).success(function(response){
      $scope.listarPaises = response;
    });
    $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
    $notify.setPosition('bottom-left');
    $notify.error('Notificacion', 'Pais eliminado');
  };
  //Este metodo modifica un trader de la base de datos
  $scope.modificaPais = function(id_pais, nombrePais){
    $http.put('/api/pais/' + id_pais, {nombrePais: nombrePais}).success(function(response){
      if (response === '1') {
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.error('Notificacion', 'Pais ya existe');
        $scope.nombrePais = '';
      }else {
        $scope.listarPaises = response;
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.info('Notificacion', 'Pais modificado');
        $scope.nombrePais = '';
      }
    });
  }
  //-------------------------------------------------------------------------------------------------------//


  // //Productos
  // //-------------------------------------------------------------------------------------------------------//
  // //Funcion que trae todos los paises de la base de datos.
  // function listarProductos(){
  //   $http.get('/api/producto/').success(function(response){
  //     $scope.listarProductos = response;
  //   });
  // };
  // //Este metodo agrega un pais a la base de datos
  // $scope.crearProducto = function (producto){
  //   console.log(producto);
  //   var producto = {nombreProducto: producto};
  //   $http.post('/api/producto/', producto).success(function(err, respuesta){
  //   });
  //   listarProductos();
  //   $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
  //   $notify.setPosition('bottom-left');
  //   $notify.success('Notificacion', 'Producto creado');
  //   $scope.nombreProducto = '';
  // };
  // //Este metodo elimina un trader de la base de datos
  // $scope.eliminaProducto = function(id_producto){
  //   $http.delete('/api/producto/' + id_producto).success(function(response){
  //   });
  //   listarProductos();
  //   $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
  //   $notify.setPosition('bottom-left');
  //   $notify.error('Notificacion', 'Producto eliminado');
  // };
  // //Este metodo modifica un trader de la base de datos
  // $scope.modificaProducto = function(id_producto, nombreProducto){
  //   $http.put('/api/producto/' + id_producto, {nombreProducto: nombreProducto}).success(function(response){
  //   });
  //   listarProductos();
  //   $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
  //   $notify.setPosition('bottom-left');
  //   $notify.info('Notificacion', 'Producto modificado');
  //   $scope.nombreProducto = '';
  // }
  // //-------------------------------------------------------------------------------------------------------//

});
