app.controller('sellosController', function ($scope, $http , $notify, $timeout, $rootScope) {

  ListarSellos();
  listarUsuariosFiltro();
  listarsellosBaja();


  function ListarSellos(){
    $http.get('/api/traerSellos').success(function(response){
      if (response[0] !== undefined) {
        $scope.listaSellos = response[0].numero;
      }
    })
  }


  //Funcion que trae todos los Inpectores de la base de datos acorde al tipo de administrador.
  //-----------------------------------------------------------------------------------//
  function listarUsuariosFiltro(){
      $http.get('/api/inspectoresAnimal').success(function(response){
        $scope.inspectores = response;
      });
  };
  //-----------------------------------------------------------------------------------//


  $scope.listarsellosFiltroUsuario = function(usuario){
    var id_usuario = usuario;
    $http.get('/api/traerSellosFiltro/' + id_usuario ).success(function(response){
      if (response[0] !== undefined) {
        $scope.sellosInspector = response[0].numero;
      }
    });
    $timeout(function() {
      listarsellosUsadosUsuario(usuario);
    }, 300);
  };

  function listarsellosUsadosUsuario(usuario){
    var id_usuario = usuario;
    $http.get('/api/traerSellosUsados/' + id_usuario ).success(function(response){
      if (response[0] !== undefined) {
        $scope.sellosUsados = response[0].numero;
      }
    });
  };

  function listarsellosBaja(){
    $http.get('/api/traerSellosBaja').success(function(response){
      if (response[0] !== undefined) {
        $scope.sellosBaja = response[0].numero;
      }
    });
  };


  $scope.GenerarSellos = function(desde, hasta){

      var lista = [];
        for (var i = desde; i <= hasta; i++) {
          lista.push(i);
        }
        $http.post('/api/sellos', {numero: lista}).success(function(response){
        })
        $scope.desde = '';
        $scope.hasta = '';
        $timeout(function() {
          ListarSellos();
        }, 300);
        $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.success('Notificacion', 'Sellos Ingresados');

  }


  $scope.sellosUsuario = function(sellos, inspector){
    var nuevo = {numero: sellos, usuario: inspector};
    $http.post('/api/sellosUsuario', nuevo ).success(function(response){
    })
    $timeout(function() {
      ListarSellos();
      $scope.listarsellosFiltroUsuario(inspector);
    }, 300);
  }


  $scope.darBaja = function(sellos){
    var nuevo = {numero: sellos};
    $http.post('/api/sellosBaja', nuevo).success(function(response){
    })
    $timeout(function() {
      ListarSellos();
      listarsellosBaja();
    }, 300);
  }


  $scope.darBajaUsuario = function(sellos, usuario){
    var nuevo = {numero: sellos, usuario: usuario};
    $http.post('/api/sellosBajaUsuario', nuevo).success(function(response){
    })
    $timeout(function() {
      listarsellosBaja();
      $scope.listarsellosFiltroUsuario(usuario);
    }, 300);
  }

})
