var app = angular.module('qualifiedApp', [
  'ngRoute',
  'mobile-angular-ui',
  'mobile-angular-ui.gestures',
  'highcharts-ng',
  'ngNotify',
  'ui.bootstrap',
  'ngFileUpload'
]);

app.run(function ($rootScope, $location, $transform) {

  window.$transform = $transform;
  // register listener to watch route changes
  $rootScope.$on("$routeChangeStart", function (event, next, current) {
    if ($rootScope.loggedUser == null) {
      // no logged user, we should be going to #login
      if (next.templateUrl == "login/login.html") {
        // already going to #login, no redirect needed
      } else {
        // not going to #login, we should redirect now
        $location.path("/login");
      }
    }
  });
})

//
// You can configure ngRoute as always, but to take advantage of SharedState location
// feature (i.e. close sidebar on backbutton) you should setup 'reloadOnSearch: false'
// in order to avoid unwanted routing.
//
app.config(function ($routeProvider) {

  $routeProvider.when('/', {templateUrl: 'login/login.html', controller: 'LoginCtrl',reloadOnSearch: false});
  $routeProvider.when('/dashboard', {templateUrl: 'dashboard/dashboard.html', reloadOnSearch: false});
  $routeProvider.when('/crearSolicitud', {templateUrl: 'solicitud/crearSolicitud/crearSolicitud.html', controller: 'crearSolicitudController', reloadOnSearch: false});
  $routeProvider.when('/busquedaSolicitudCliente', {templateUrl: 'solicitud/busquedaSolicitud/ingresoSolicitud.html', controller: 'busquedaClienteController', reloadOnSearch: false});
  $routeProvider.when('/lotesUsuario', {templateUrl: 'solicitud/lotesUsuario/lotesUsuario.html', controller: 'loteUsuarioController', reloadOnSearch: false});
  $routeProvider.when('/solDespacho', {templateUrl: 'solicitud/solicitudDespacho/solicitudDespacho.html', controller: 'solDespachoController', reloadOnSearch: false});
  $routeProvider.when('/busquedaSolicitudAdministrador', {templateUrl: 'administracion/busquedaSolicitud/busquedaSolicitud.html', controller: 'busquedaController', reloadOnSearch: false});
  $routeProvider.when('/solDespachoAdmin', {templateUrl: 'administracion/solicitudDespacho/solicitudDespacho.html', controller: 'solDespachoAdminController', reloadOnSearch: false});
  $routeProvider.when('/inspector', {templateUrl: 'inspector/inspector.html', controller: 'inspectorController', reloadOnSearch: false});
  $routeProvider.when('/solDespachoInpector', {templateUrl: 'inspector/solicitudDespacho/solicitudDespacho.html', controller: 'solDespachoInspecController', reloadOnSearch: false});
  $routeProvider.when('/administracion', {templateUrl: 'administracion/perfilamiento/administracion.html', controller: 'administracionController', reloadOnSearch: false});
  $routeProvider.when('/laboratorio', {templateUrl: 'laboratorio/laboratorio.html', controller: 'laboratorioController', reloadOnSearch: false});
  $routeProvider.when('/parametros', {templateUrl: 'administracion/parametros/parametros.html', controller: 'parametrosController', reloadOnSearch: false});
  $routeProvider.when('/otadmin', {templateUrl: 'administracion/busquedaSolicitud/busquedaOt.html', controller: 'busquedaController', reloadOnSearch: false});
  $routeProvider.when('/workflow', {templateUrl: 'gestionWf/gestorWf.html', controller: 'workController', reloadOnSearch: false});
  $routeProvider.when('/sellos', {templateUrl: 'sellos/sellos.html', controller: 'sellosController', reloadOnSearch: false});
  $routeProvider.when('/creacionSolicitudHarina', {templateUrl: 'solicitud/crearSolicitud/crearSolicitud.html', controller: 'crearSolicitudController', reloadOnSearch: false});
  $routeProvider.when('/creacionSolicitudAlimento', {templateUrl: 'solicitud/SolicitudAlimento/crearSolicitud.html', controller: 'SolicitudAlimentoController', reloadOnSearch: false});
  $routeProvider.when('/creacionMuestreo', {templateUrl: 'solicitud/creacionMuestreo/crearSolicitud.html', controller: 'muestreoController', reloadOnSearch: false});
  $routeProvider.when('/crearSolicitudInspector', {templateUrl: 'inspector/crearSolicitud/crearSolicitud.html', controller: 'crearSolicitudInspectorController', reloadOnSearch: false});
  $routeProvider.when('/linea', {templateUrl: 'lineaTiempo/lineaTiempo.html', controller: 'lineaController', reloadOnSearch: false});
  $routeProvider.when('/toggle', {templateUrl: 'toggle.html', reloadOnSearch: false});
  $routeProvider.when('/tabs', {templateUrl: 'tabs.html', reloadOnSearch: false});
  $routeProvider.when('/accordion', {templateUrl: 'accordion.html', reloadOnSearch: false});
  $routeProvider.when('/overlay', {templateUrl: 'overlay.html', reloadOnSearch: false});
  $routeProvider.when('/forms', {templateUrl: 'forms.html', reloadOnSearch: false});
  $routeProvider.when('/dropdown', {templateUrl: 'dropdown.html', reloadOnSearch: false});
  $routeProvider.when('/touch', {templateUrl: 'touch.html', reloadOnSearch: false});
  $routeProvider.when('/swipe', {templateUrl: 'swipe.html', reloadOnSearch: false});
  $routeProvider.when('/drag', {templateUrl: 'drag.html', reloadOnSearch: false});
  $routeProvider.when('/drag2', {templateUrl: 'drag2.html', reloadOnSearch: false});
  $routeProvider.when('/carousel', {templateUrl: 'carousel.html', reloadOnSearch: false});
  $routeProvider.when('/cierre', {templateUrl: 'login/login.html',controller: 'LoginCtrl', reloadOnSearch: false});
  $routeProvider.when('/login', {templateUrl: 'login/login.html', controller: 'LoginCtrl',reloadOnSearch: false});
  $routeProvider.otherwise({redirectTo: '/login'});

});

//
// `$touch example`
//

app.directive('toucharea', ['$touch', function ($touch) {
  // Runs during compile
  return {
    restrict: 'C',
    link: function ($scope, elem) {
      $scope.touch = null;
      $touch.bind(elem, {
        start: function (touch) {
          $scope.touch = touch;
          $scope.$apply();
        },
        cancel: function (touch) {
          $scope.touch = touch;
          $scope.$apply();
        },
        move: function (touch) {
          $scope.touch = touch;
          $scope.$apply();
        },
        end: function (touch) {
          $scope.touch = touch;
          $scope.$apply();
        }
      });
    }
  };
}]);

//
// `$drag` example: drag to dismiss
//
app.directive('dragToDismiss', function ($drag, $parse, $timeout) {
  return {
    restrict: 'A',
    compile: function (elem, attrs) {
      var dismissFn = $parse(attrs.dragToDismiss);
      return function (scope, elem) {
        var dismiss = false;

        $drag.bind(elem, {
          transform: $drag.TRANSLATE_RIGHT,
          move: function (drag) {
            if (drag.distanceX >= drag.rect.width / 4) {
              dismiss = true;
              elem.addClass('dismiss');
            } else {
              dismiss = false;
              elem.removeClass('dismiss');
            }
          },
          cancel: function () {
            elem.removeClass('dismiss');
          },
          end: function (drag) {
            if (dismiss) {
              elem.addClass('dismitted');
              $timeout(function () {
                scope.$apply(function () {
                  dismissFn(scope);
                });
              }, 300);
            } else {
              drag.reset();
            }
          }
        });
      };
    }
  };
});

//
// Another `$drag` usage example: this is how you could create
// a touch enabled "deck of cards" carousel. See `carousel.html` for markup.
//
app.directive('carousel', function () {
  return {
    restrict: 'C',
    scope: {},
    controller: function () {
      this.itemCount = 0;
      this.activeItem = null;

      this.addItem = function () {
        var newId = this.itemCount++;
        this.activeItem = this.itemCount === 1 ? newId : this.activeItem;
        return newId;
      };

      this.next = function () {
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === this.itemCount - 1 ? 0 : this.activeItem + 1;
      };

      this.prev = function () {
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === 0 ? this.itemCount - 1 : this.activeItem - 1;
      };
    }
  };
});

app.directive('carouselItem', function ($drag) {
  return {
    restrict: 'C',
    require: '^carousel',
    scope: {},
    transclude: true,
    template: '<div class="item"><div ng-transclude></div></div>',
    link: function (scope, elem, attrs, carousel) {
      scope.carousel = carousel;
      var id = carousel.addItem();

      var zIndex = function () {
        var res = 0;
        if (id === carousel.activeItem) {
          res = 2000;
        } else if (carousel.activeItem < id) {
          res = 2000 - (id - carousel.activeItem);
        } else {
          res = 2000 - (carousel.itemCount - 1 - carousel.activeItem + id);
        }
        return res;
      };

      scope.$watch(function () {
        return carousel.activeItem;
      }, function () {
        elem[0].style.zIndex = zIndex();
      });

      $drag.bind(elem, {
        //
        // This is an example of custom transform function
        //
        transform: function (element, transform, touch) {
          //
          // use translate both as basis for the new transform:
          //
          var t = $drag.TRANSLATE_BOTH(element, transform, touch);

          //
          // Add rotation:
          //
          var Dx = touch.distanceX,
          t0 = touch.startTransform,
          sign = Dx < 0 ? -1 : 1,
          angle = sign * Math.min((Math.abs(Dx) / 700) * 30, 30);

          t.rotateZ = angle + (Math.round(t0.rotateZ));

          return t;
        },
        move: function (drag) {
          if (Math.abs(drag.distanceX) >= drag.rect.width / 4) {
            elem.addClass('dismiss');
          } else {
            elem.removeClass('dismiss');
          }
        },
        cancel: function () {
          elem.removeClass('dismiss');
        },
        end: function (drag) {
          elem.removeClass('dismiss');
          if (Math.abs(drag.distanceX) >= drag.rect.width / 4) {
            scope.$apply(function () {
              carousel.next();
            });
          }
          drag.reset();
        }
      });
    }
  };
});

app.directive('dragMe', ['$drag', function ($drag) {
  return {
    controller: function ($scope, $element) {
      $drag.bind($element,
        {
          //
          // Here you can see how to limit movement
          // to an element
          //
          transform: $drag.TRANSLATE_INSIDE($element.parent()),
          end: function (drag) {
            // go back to initial position
            drag.reset();
          }
        },
        {// release touch when movement is outside bounduaries
          sensitiveArea: $element.parent()
        }
      );
    }
  };
}]);

//
// For this trivial demo we have just a unique MainController
// for everything
//
app.controller('MainController', function ($rootScope, $scope, $http) {

  $scope.avisosModal = function(user){
    $scope.vista = false;
    $scope.mensaje = false;
    if (user.online === 'mensajeNuevo' || user.online === 'mensajeEnviado') {
      $scope.mensaje = true;
      $http.get('/api/solicitudUnica/' + user.id_solicitud).success(function(response){
        $scope.datosAvisos = response[0];
      })
    }else {
      $scope.vista = true;
      $http.get('/api/solicitudUnica/' + user.id_solicitud).success(function(respuesta){
        $scope.datosAvisos = respuesta[0];
        $scope.datosAvisosNombre = respuesta[0].cliente.nombre;
      });
    }
  }



  $scope.swiped = function (direction) {
    alert('Swiped ' + direction);
  };

  // User agent displayed in home page
  $scope.userAgent = navigator.userAgent;

  // Needed for the loading screen
  $rootScope.$on('$routeChangeStart', function () {
    $rootScope.loading = true;
  });

  $rootScope.$on('$routeChangeSuccess', function () {
    $rootScope.loading = false;
  });

  // Fake text i used here and there.
  $scope.lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel explicabo, aliquid eaque soluta nihil eligendi adipisci error, illum corrupti nam fuga omnis quod quaerat mollitia expedita impedit dolores ipsam. Obcaecati.';

  //
  // 'Scroll' screen
  //
  var scrollItems = [];

  for (var i = 1; i <= 100; i++) {
    scrollItems.push('Item ' + i);
  }

  $scope.scrollItems = scrollItems;

  $scope.bottomReached = function () {
    /* global alert: false; */
    alert('Congrats you scrolled to the end of the list!');
  };
  //
  // 'Forms' screen
  //
  $scope.rememberMe = true;
  $scope.email = 'me@example.com';

  //
  // 'Drag' screen
  //
  $scope.notices = [];

  for (var j = 0; j < 10; j++) {
    $scope.notices.push({icon: 'envelope', message: 'Notice ' + (j + 1)});
  }

  $scope.deleteNotice = function (notice) {
    var index = $scope.notices.indexOf(notice);
    if (index > -1) {
      $scope.notices.splice(index, 1);
    }
  };



});
