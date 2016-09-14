app.controller('workController', function($scope, $http, $rootScope){

  listarPerfiles();
  listarPasoWf();

  function listarPasoWf(){
    $http.get('/api/paso').success(function(response){
      $scope.pasoWf = response;
    });
  }

  listaVacia();
  function listaVacia(){
    $http.get('/api/paso').success(function(response){
      var pasoWf = response;
      var lista = [];
      for (var i = 0; i < pasoWf.length; i++) {
        for (var j = 0; j <pasoWf.length; j++) {
          var nuevo = {paso_actual: pasoWf[j].id, id_paso: pasoWf[i].id , check: false};
          lista.push(nuevo);
        }
      }
      $scope.listaVacia = lista;
    });

  }

  function listarPerfiles(){
    $http.get('/api/perfiles').success(function(response){
      $scope.perfiles = response;
    });
  }

  var pw = []
  $scope.prueba = function(paso_actual, id_paso, check){
    if (check) {
      var nuevo = {paso_actual: paso_actual, id_paso: id_paso, check: check};
      pw.push(nuevo);
    }
    $scope.pw = pw;
  }

  $scope.guardar = function(seleccion, pw, lista){
    for (var i = 0; i < pw.length; i++) {
      for (var j = 0; j < lista.length; j++) {
        if (pw[i].id_paso === lista[j].id_paso && pw[i].paso_actual === lista[j].paso_actual) {
          lista.splice( j, 1, pw[i]);
        }
      }
    }
    $scope.listaVacia = lista;
    var nuevo = {id_perfil: seleccion, workFlow: lista};
    $http.post('/api/workFlow', nuevo).success(function(response){
    })
  }

  listarPasos();
  function listarPasos(){
    var id_perfil = $rootScope.loggedUser.perfil[0].id_perfil;
    $http.get('/api/workFlow/'+ id_perfil).success(function(response){
      var workFlow = response[0].workFlow;
      var lista = [];
      for (var i = 0; i < workFlow.length; i++) {
        if (workFlow[i].paso_actual === 3 && workFlow[i].check === true) {
          lista.push(workFlow[i]);
        }
      }
      $http.get('/api/paso').success(function(respuesta){
        var pasos = respuesta;
        var flujo = [];
        for (var i = 0; i < lista.length; i++) {
          for (var j = 0; j < pasos.length; j++) {
            if (lista[i].id_paso === pasos[j].id) {
              var nuevo = {id: lista[i].id_paso, nombre: pasos[j].paso};
              flujo.push(nuevo);
            }
          }
        }
        $scope.flujo = flujo;
      })
    })
  }

});
