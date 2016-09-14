app.controller('administracionController', ['$scope', '$rootScope', '$notify', '$http',  function ($scope, $rootScope, $notify, $http) {

  //Carga de datos a la vista.
  listarLlaves();
  listarPerfiles();
  listarUsuarios();
  listarSeleccionMuestreo();
  $scope.tipo = 'password';
  $scope.listaCorreos = undefined;
  //Metodos Usuario.
  //-------------------------------------------------------------------------------------------------------------------//

  $scope.colorAnimal = "warning";
  $scope.colorAlimento = "warning";
  $scope.colorAgua = "warning";
  $scope.valorAnimal = false;
  $scope.valorAlimento = false;
  $scope.valorAgua = false;

  $scope.seleccionarAnimal = function(){
    if ($scope.valorAlimento === true || $scope.valorAgua === true) {
      $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
      $notify.setPosition('bottom-left');
      $notify.error('Notificacion', 'No se puede seleccionar animal junto a alimento o agua');
    }else {
      if ($scope.colorAnimal === "success") {
        $scope.colorAnimal = "warning";
        $scope.valorAnimal = false;
      }else {
        $scope.colorAnimal = "success";
        $scope.valorAnimal = true;
      }
    }
  }


  $scope.seleccionarAlimento = function(){
    if ($scope.valorAnimal === true) {
      $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
      $notify.setPosition('bottom-left');
      $notify.error('Notificacion', 'No se puede seleccionar alimento con animal');
    }else {
      if ($scope.colorAlimento === "success") {
        $scope.colorAlimento = "warning";
        $scope.valorAlimento = false;
      }else {
        $scope.colorAlimento = "success"
        $scope.valorAlimento = true;
      }
    }
  }

  $scope.seleccionarAgua = function(){
    if ($scope.valorAnimal === true) {
      $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
      $notify.setPosition('bottom-left');
      $notify.error('Notificacion', 'No se puede seleccionar agua con animal');
    }else {
      if ($scope.colorAgua === "success") {
        $scope.colorAgua = "warning";
        $scope.valorAgua = false;
      }else {
        $scope.colorAgua = "success"
        $scope.valorAgua = true;
      }
    }
  }

  function listarSeleccionMuestreo(){
    $http.get('/api/seleccionMuestreo').success(function(response){
    })
  }


  $scope.validacion = false;
  $scope.validarUsuario = function(username){

    $http.get('/api/usuariosUsername/' + username).success(function(response){
      if (response[0] === undefined) {
        $scope.validacion = true;
      }else {
        $scope.validacion = false;
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.info('Notificacion', 'Username ya existe');
      }
    })
  }


  //Metodo que guarda un usuario en base de datos con sus perfiles asignados.
  //-------------------------------------------------------------------------------------------------------------------//
  $scope.crearUsuario = function(username, nombre, pass, correo, perfiles, trader, habilitaTrader, rut, giro, direccion){

    if (habilitaTrader === true) {
      if (trader === undefined) {
        var trader = false;
      }else {
        var trader = trader;
      }
    }else {
      var trader = undefined;
    }

    var alimento = $scope.valorAlimento;
    var animal = $scope.valorAnimal;
    var agua = $scope.valorAgua;

    var identificador = {id: 'id_usuario'};
    $http.post('/api/contador2', identificador).success(function(response){
      var usuario = {'id_usuario': response.seq, 'nombre': nombre, 'username': username, 'correo': correo, 'password': pass, 'trader': trader, 'alimento': alimento, 'animal': animal, 'agua': agua, 'perfil': perfiles, 'rut': rut, 'giro': giro, 'direccion': direccion};
      $http.post('/api/usuarios', usuario).success(function(respuesta){
        if (respuesta === '1') {
          $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
          $notify.setPosition('bottom-left');
          $notify.error('Notificacion', 'Usuario existente');
        }else{
          $scope.usuarios = respuesta;
          $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
          $notify.setPosition('bottom-left');
          $notify.success('Notificacion', 'Usuario Creado');
        }
      });
    });
    $scope.habilitaTrader = false;
  }
  //-------------------------------------------------------------------------------------------------------------------//
  $scope.habilitaTrader = false;
  $scope.habilitaTipoMuestreo = false;
  $scope.seleccionPerfil = function(perfiles){

    if (perfiles[0].id_perfil === 2) {
      $scope.habilitaTrader = true;
      $scope.habilitaTipoMuestreo = true;
    }else if (perfiles[0].id_perfil === 1) {
      $scope.habilitaTrader = false;
      $scope.habilitaTipoMuestreo = true;
    }else if (perfiles[0].id_perfil === 3) {
      $scope.habilitaTrader = false;
      $scope.habilitaTipoMuestreo = true;
    }else{
      $scope.habilitaTrader = false;
      $scope.habilitaTipoMuestreo = false;
    }

  }

  $scope.agregarCorreo = function(nuevo, listaCorreos){

    var lista = [];
    var cont = 0;
    var cont1 = 0;

    for(i=0; i< nuevo.length; i++){
      if (nuevo[i] === '@'){
        cont1++;
      }
    }
    if (cont1 < 1) {
      $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
      $notify.setPosition('bottom-left');
      $notify.info('Notificacion', 'Debe ingresar un correo valido');
    }else {
      if (listaCorreos.length === 0) {
        lista.push(nuevo);
        $scope.listaCorreos = lista;
      }else {
        lista = listaCorreos;
        for (var i = 0; i < lista.length; i++) {
          if (lista[i] === nuevo) {
            $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
            $notify.setPosition('bottom-left');
            $notify.info('Notificacion', 'Correo ya existe');
            cont++;
          }
        }
        if (cont > 0) {
          $scope.listaCorreos = lista;
          $scope.correo = '';
        }else {
          lista.push(nuevo);
          $scope.listaCorreos = lista;
          $scope.correo = '';
        }
      }
    }
  }

  $scope.eliminarCorreo = function(correoEliminar, listaCorreos){
    if (correoEliminar === undefined) {
      $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
      $notify.setPosition('bottom-left');
      $notify.info('Notificacion', 'Debe seleccionar un correo');
    }else {
      var lista = listaCorreos;
      for (var i = 0; i < lista.length; i++) {
        if (correoEliminar === lista[i]) {
          lista.splice(i, 1)
        }
      }
      $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
      $notify.setPosition('bottom-left');
      $notify.error('Notificacion', 'Correo Eliminado');
      $scope.listaCorreos = lista;
    }
  }


  //Metodo que elimina un usuario de la base de datos.
  //-------------------------------------------------------------------------------------------------------------------//
  $scope.eliminarUsuario = function(usuario){
    for (var i = 0; i < usuario.length; i++) {
      var id_usuario = usuario[i].id_usuario;
      $http.delete('/api/usuarios/' + id_usuario).success(function(response){
        if (response !== '') {
          $scope.usuarios = response;
          $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
          $notify.setPosition('bottom-left');
          $notify.error('Notificacion', 'Usuario Eliminado');
        }
      });
    }
  }
  //-------------------------------------------------------------------------------------------------------------------//


  //Metodo que actualiza un usuario en base de datos.
  //-------------------------------------------------------------------------------------------------------------------//
  $scope.actualizarUsuario = function(id , username, nombre, pass, correo, perfiles, trader, habilitaTrader){


    if (habilitaTrader === true) {
      if (trader === undefined) {
        var trader = false;
      }else {
        var trader = trader;
      }
    }else {
      var trader = undefined;
    }


    var id_perfil = perfiles[0];
    $http.get('/api/perfiles/' + id_perfil).success(function(response){
      var perfil = response;
      var usuario = {nombre: nombre, username: username, correo: correo, password: pass, trader: trader, perfil: perfil};
      $http.put('/api/usuarios/' + id, usuario).success(function(response){
        $scope.usuarios = response;
      });
      $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
      $notify.setPosition('bottom-left');
      $notify.info('Notificacion', 'Usuario Modificado');

    });

  }
  //-------------------------------------------------------------------------------------------------------------------//


  //Metodo que lista los usuarios de la base de datos.
  //-------------------------------------------------------------------------------------------------------------------//
  function listarUsuarios(){
    $http.get('/api/usuarios').success(function(response){
      $scope.usuarios = response;
    });
  }
  //-------------------------------------------------------------------------------------------------------------------//

  $scope.habilitarModalPerfil = false;

  $scope.habilitarModal = function(perfiles){
    if (perfiles.length > 1) {
      $scope.habilitarModalPerfil = false;
    }else{
      $scope.habilitarModalPerfil = true;
    }
  };


  //Metodos de Perfil.
  //-------------------------------------------------------------------------------------------------------------------//


  //Metodo que lista los perfiles de la base de datos.
  //-------------------------------------------------------------------------------------------------------------------//
  function listarPerfiles(){
    $http.get('/api/perfiles').success(function(response){
      $scope.perfiles = response;
    });
  }
  //-------------------------------------------------------------------------------------------------------------------//


  //Metodo que guarda un perfil en base de datos con sus llaves asignadas.
  //-------------------------------------------------------------------------------------------------------------------//
  $scope.crearPerfil = function(nombre, llaves){
    var identificador = {id: 'id_perfil'};
    $http.post('/api/contador2', identificador).success(function(response){
      var perfil = {id_perfil: response.seq, nombre_perfil: nombre, llave: llaves};
      $http.post('/api/perfiles', perfil).success(function(respuesta){
        $scope.perfiles = respuesta;
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.success('Notificacion', 'Perfil Creado');
      });
    });
  }
  //-------------------------------------------------------------------------------------------------------------------//


  //Metodo que actualiza un perfil en base de datos.
  //-------------------------------------------------------------------------------------------------------------------//
  $scope.actualizarPerfil = function(id, nombre, llaves){
    var busquedaLlaves = [];
    for (var i = 0; i < llaves.length; i++) {
      var id_llave = llaves[i];
      $http.get('/api/llaves/' + id_llave).success(function(response){
        busquedaLlaves.push(response)
        $rootScope.$emit("listarLlaves", busquedaLlaves);
      });
    }
    $rootScope.$on("listarLlaves", function(event, llavesNuevas){
      var perfil = {nombre_perfil: nombre, llave: llavesNuevas};
      $http.put('/api/perfiles/' + id, perfil).success(function(response){
        if (response !== '') {
          $scope.perfiles = response;
        }
      });
    });
    $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
    $notify.setPosition('bottom-left');
    $notify.info('Notificacion', 'Perfil Modificado');
    this.cerrar();
  }
  //-------------------------------------------------------------------------------------------------------------------//

  //Metodo que elimina un perfil de la base de datos.
  //-------------------------------------------------------------------------------------------------------------------//
  $scope.eliminarPerfil = function(perfil){
    for (var i = 0; i < perfil.length; i++) {
      var id_perfil = perfil[i].id_perfil;
      $http.delete('/api/perfiles/' + id_perfil).success(function(response){
        if (response !== '') {
          $scope.perfiles = response;
          $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
          $notify.setPosition('bottom-left');
          $notify.error('Notificacion', 'Perfil Eliminado');
        }
      });
    }
  }
  //-------------------------------------------------------------------------------------------------------------------//


  //Metodos de Llave.
  //-------------------------------------------------------------------------------------------------------------------//


  //Metodo que lista las llaves de la base de datos.
  //-------------------------------------------------------------------------------------------------------------------//
  function listarLlaves(){
    $http.get('/api/llaves').success(function(response){
      $scope.llavesCombo = response;
    });
  }
  //-------------------------------------------------------------------------------------------------------------------//


  //Metodos Auxiliares
  //-------------------------------------------------------------------------------------------------------------------//
  //Metodo que envia datos seleccionados a modal de eliminacion
  //-------------------------------------------------------------------------------------------------------------------//
  $scope.enviarEliminarUsuario = function(seleccion){

    $scope.modalEliminarUsuario = seleccion;
  }
  //-------------------------------------------------------------------------------------------------------------------//


  //Metodo que envia datos seleccionados a modal de eliminacion
  //-------------------------------------------------------------------------------------------------------------------//
  $scope.eliminacionModalPerfil = function(seleccion){
    $scope.modalEliminaPerfil = seleccion;
  }
  //-------------------------------------------------------------------------------------------------------------------//


  //Metodo que cambia el type del campo password
  //-------------------------------------------------------------------------------------------------------------------//
  $scope.cambiarTipo = function(){
    if ($scope.tipo === 'password') {
      $scope.tipo = 'text';
    }else{
      $scope.tipo = 'password';
    }
  }
  //-------------------------------------------------------------------------------------------------------------------//


  //Metodo que envia datos de usuario al modal
  //-------------------------------------------------------------------------------------------------------------------//
  $scope.perfilesAsignados = [];
  $scope.enviarDatosModUsuario = function(usuario){
    $scope.usernameMod = usuario[0].username;
    $scope.nombreUsuarioMod = usuario[0].nombre;
    $scope.passwordMod = usuario[0].password;
    $scope.listaCorreos = usuario[0].correo;
    $scope.trader = usuario[0].trader;
    for (var i = 0; i < usuario[0].perfil.length; i++) {
      $scope.perfilesAsignados.push(usuario[0].perfil[i].id_perfil);
      if (usuario[0].perfil[i].id_perfil === 2) {
        $scope.habilitaTrader = true;
      }
    }
    $scope.perfilesUsuariosMod = $scope.perfilesAsignados;
    $scope.id_usuario = usuario[0].id_usuario;
  }
  //-------------------------------------------------------------------------------------------------------------------//


  //Metodo que envia datos de perfil al modal.
  //-------------------------------------------------------------------------------------------------------------------//
  $scope.llavesAsignadas = [];
  $scope.enviarDatosModPerfil = function(perfil){
    $scope.nombrePerfilMod = perfil[0].nombre_perfil;
    for (var i = 0; i < perfil[0].llave.length; i++) {
      $scope.llavesAsignadas.push(perfil[0].llave[i].id_llave);
    }
    $scope.seleccionLlavesMod = $scope.llavesAsignadas;
    $scope.id_perfil = perfil[0].id_perfil;
  }
  //-------------------------------------------------------------------------------------------------------------------//


  $scope.enviarCreacionUsuario = function(){
    $scope.habilitaTrader = false;
    $scope.trader = false;
    $scope.listaCorreos = '';
  }


  //Metodo que limpia los perfilesAsignados del modal modificar
  //-------------------------------------------------------------------------------------------------------------------//
  $scope.cerrar = function(){
    $scope.perfilesAsignados = [];
    $scope.llavesAsignadas = [];
  }
  $scope.TraerValor = function(valor){
    $scope.valor = valor;
  };
  //-------------------------------------------------------------------------------------------------------------------//


}]);
