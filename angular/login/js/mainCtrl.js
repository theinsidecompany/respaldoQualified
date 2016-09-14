app.controller('LoginCtrl', function($scope, $http, $rootScope, $location, $notify){


  $scope.reset = function(){
    contTree = 0;
  };
  //Metodo que valida el ingreso del usuario a la pagina
  $scope.validarCampos = function(user, pass){
    var credenciales = {username: user, password: pass};
    $http.post('/api/validarUsuario', credenciales).success(function(usuario){
      if (usuario === '') {
        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.error('Notificacion', 'Usuario no Existe');
      }else{
        $rootScope.loggedUser = usuario;

        for (var i = 0; i < usuario.perfil[0].llave.length; i++) {

          if (usuario.perfil[0].llave[i].nombre_llave === 'Llave Dashboard') {
            $rootScope.dash = true;
            $rootScope.dashAdmin = true;
            $rootScope.linea = true;
          }
          if (usuario.perfil[0].llave[i].nombre_llave === 'Crear Solicitud') {
            $rootScope.creaSol = true;
          }
          if (usuario.perfil[0].llave[i].nombre_llave === 'Busqueda Solicitud') {
            $rootScope.busSolCliente = true;
            $rootScope.busLoteCliente = true;
            $rootScope.busSolDesp = true;
          }
          if (usuario.perfil[0].llave[i].nombre_llave === 'Busqueda Administrador') {
            $rootScope.solOT = true;
            $rootScope.busSolDespAdmin = true;
          }
          if (usuario.perfil[0].llave[i].nombre_llave === 'Administracion') {
            $rootScope.admin = true;
            $rootScope.sellos = true;
          }
          if (usuario.perfil[0].llave[i].nombre_llave === 'Administracion Parametros') {
            $rootScope.admPar = true;
          }
          if (usuario.perfil[0].llave[i].nombre_llave === 'Ordenes de trabajo inspector') {
            $rootScope.otinspec = true;
            $rootScope.creaSol = true;
            $rootScope.solDespInsp = true;
          }
          if (usuario.perfil[0].llave[i].nombre_llave === 'Laboratorio') {
            $rootScope.lab = true;
          }
          $rootScope.cerrar = true;

        }


        if ($rootScope.loggedUser.perfil[0].nombre_perfil === 'Solicitante' && $rootScope.loggedUser.animal == true) {
          $location.path('dashboard');
        }else if ($rootScope.loggedUser.perfil[0].nombre_perfil === 'Solicitante' && $rootScope.loggedUser.animal == false) {
          $location.path('busquedaSolicitudCliente');
        }else if ($rootScope.loggedUser.perfil[0].nombre_perfil === 'Administrador' && $rootScope.loggedUser.animal == true) {
          $location.path('dashboard');
        }else if ($rootScope.loggedUser.perfil[0].nombre_perfil === 'Administrador' && $rootScope.loggedUser.animal == false){
          $location.path('busquedaSolicitudAdministrador');
        }else if ($rootScope.loggedUser.perfil[0].nombre_perfil === 'Inspector') {
          $location.path('inspector');
        }else if ($rootScope.loggedUser.perfil[0].nombre_perfil === 'Laboratorio') {
          $location.path('laboratorio');
        }



       if ($rootScope.loggedUser.animal === false && $rootScope.loggedUser.perfil[0].nombre_perfil === 'Inspector') {
          $rootScope.dash = null;
          $rootScope.dashAdmin = null;
          $rootScope.busSolDespAdmin = null;
          $rootScope.solDespInsp = null;
          $rootScope.busSolDesp = null;

        }else if ($rootScope.loggedUser.animal === true && $rootScope.loggedUser.perfil[0].nombre_perfil === 'Inspector') {
          $rootScope.dash = null;
          $rootScope.dashAdmin = null;
          $rootScope.busSolDespAdmin = null;
          $rootScope.solDespInsp = true;
          $rootScope.busSolDesp = null;

        }else if ($rootScope.loggedUser.animal) {
          $rootScope.sellos = false;
          $rootScope.admin = false;
          $rootScope.admPar = false;
          $rootScope.dash = true;
          $rootScope.dashAdmin = true;
          $rootScope.creaSol = false;

        }else if ($rootScope.loggedUser.animal === false) {
          $rootScope.sellos = false;
          $rootScope.admin = false;
          $rootScope.admPar = false;
          $rootScope.dash = false;
          $rootScope.linea = false;
          $rootScope.busLoteCliente = false;
          $rootScope.busSolDespAdmin = false;
          $rootScope.creaSol = false;
          $rootScope.busSolDesp = false;
        }


        // $rootScope.dash
        // $rootScope.linea
        // $rootScope.busSolCliente
        // $rootScope.busLoteCliente
        // $rootScope.busSolDesp
        // $rootScope.solOT
        // $rootScope.busSolDespAdmin
        // $rootScope.sellos
        // $rootScope.admin
        // $rootScope.admPar
        // $rootScope.otinspec
        // $rootScope.creaSol
        // $rootScope.solDespInsp
        // $rootScope.lab



        $notify.setTime(4).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.success('Notificacion', 'Bienvenido ' + usuario.nombre);
      }
    });
  };

  $scope.cerrarSesion = function(){

    var usuario = null;

    $rootScope.dash = null;
    $rootScope.linea = null;
    $rootScope.busSolCliente = null;
    $rootScope.busLoteCliente = null;
    $rootScope.busSolDesp = null;
    $rootScope.solOT = null;
    $rootScope.busSolDespAdmin = null;
    $rootScope.sellos = null;
    $rootScope.admin = null;
    $rootScope.admPar = null;
    $rootScope.otinspec = null;
    $rootScope.creaSol = null;
    $rootScope.solDespInsp = null;
    $rootScope.lab = null;
    $rootScope.cerrar = null;
    $rootScope.loggedUser = usuario;
    $rootScope.chatUsers = [];
  };

});
