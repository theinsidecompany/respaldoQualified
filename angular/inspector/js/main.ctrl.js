app.controller('inspectorController', ['$scope', '$http', '$rootScope', '$notify', '$timeout', 'Upload', '$sce', function($scope, $http, $rootScope, $notify, $timeout, Upload, $sce, $modal) {

    //Carga de datos.
    //-----------------------------------------------------------------------------------//
    traerSolicitudesFiltro();
    listarProcesosInspector();
    traerAvisosFiltro();
    $scope.habilitaEnvioLab = false;
    //Funcion que trae los laboratorios de la base de datos.
    //-----------------------------------------------------------------------------------//
    listarUsuarios();

    function listarUsuarios() {
        var id_perfil = 4;
        $http.get('/api/usuarios/' + id_perfil).success(function(response) {
            $scope.listarLaboratorios = response;
        });
    };
    //-----------------------------------------------------------------------------------//


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
        })
    }
    //-----------------------------------------------------------------------------------//

    // Metodo que trae las solicitudes filtradas por usuario.
    function traerSolicitudesFiltro() {
        var id_usuario = $rootScope.loggedUser.id_usuario;
        var listaEstados = [];
        fechaActual = new Date();
        $http.get('/api/inspector/' + id_usuario).success(function(response) {
            for (var i = 0; i < response.length; i++) {
                var fechaPlanificacion = new Date(response[i].fecha_planificacion);
                if (fechaPlanificacion >= fechaActual) {
                    listaEstados.push({
                        solicitud: response[i],
                        estado: 'En proceso'
                    });
                }
                if (fechaPlanificacion < fechaActual) {
                    listaEstados.push({
                        solicitud: response[i],
                        estado: 'Atrasada'
                    });
                }
            }
            $scope.solicitudes = listaEstados;
        });
    };
    //-----------------------------------------------------------------------------------//


    //Metodo que trae las observaciones por solicitud
    //----------------------------------------------------------------------------------//
    function listarObservacion(sol) {
        var id_solicitud = sol.id_solicitud;
        $http.get('/api/observacion/' + id_solicitud).success(function(response) {
            if (response[0] !== undefined) {
                var nuevo = response[0];
                $scope.observacion = nuevo.observacion;
                $scope.muestraObservacion = true;
                $scope.muestraDatos = false;
            } else {
                $scope.muestraObservacion = false;
                $scope.muestraDatos = true;
            }
        })

    }
    //----------------------------------------------------------------------------------//


    //Metodo para desplegar accesos rapidos en modal vista
    //-----------------------------------------------------------------------------------//
    $scope.muestraAcepta = false;
    $scope.muestraRechaza = false;
    $scope.muestraAprueba = false;
    $scope.muestraDesaprueba = false;
    $scope.muestraApruebaTransporte = false;
    $scope.muestraDesapruebaTransporte = false;
    $scope.seleccionFlujo = function(seleccion) {
            if (seleccion === 4) {
                $scope.muestraAcepta = true;
                $scope.muestraRechaza = false;
                $scope.muestraAprueba = false;
                $scope.muestraDesaprueba = false;
                $scope.muestraApruebaTransporte = false;
                $scope.muestraDesapruebaTransporte = false;
            } else if (seleccion === 5) {
                $scope.muestraRechaza = true;
                $scope.muestraAcepta = false;
                $scope.muestraAprueba = false;
                $scope.muestraDesaprueba = false;
                $scope.muestraApruebaTransporte = false;
                $scope.muestraDesapruebaTransporte = false;
            } else if (seleccion === 6) {
                $scope.muestraRechaza = false;
                $scope.muestraAcepta = false;
                $scope.muestraAprueba = true;
                $scope.muestraDesaprueba = false;
                $scope.muestraApruebaTransporte = false;
                $scope.muestraDesapruebaTransporte = false;
            } else if (seleccion === 7) {
                $scope.muestraRechaza = false;
                $scope.muestraAcepta = false;
                $scope.muestraAprueba = false;
                $scope.muestraDesaprueba = true;
                $scope.muestraApruebaTransporte = false;
                $scope.muestraDesapruebaTransporte = false;
            } else if (seleccion === 12) {
                $scope.muestraRechaza = false;
                $scope.muestraAcepta = false;
                $scope.muestraAprueba = false;
                $scope.muestraDesaprueba = false;
                $scope.muestraApruebaTransporte = true;
                $scope.muestraDesapruebaTransporte = false;
            } else if (seleccion === 13) {
                $scope.muestraRechaza = false;
                $scope.muestraAcepta = false;
                $scope.muestraAprueba = false;
                $scope.muestraDesaprueba = false;
                $scope.muestraApruebaTransporte = false;
                $scope.muestraDesapruebaTransporte = true;
            }
        }
        //-----------------------------------------------------------------------------------//

    //Envio de solicitudes de harina a laboratorio
    $scope.enviaLaboratorio = function(sol, lote, lotes) {

        var nroLote = Number(lote);
        var fecha = new Date();
        var nuevo = {
            id_solicitud: sol,
            id_lote: nroLote,
            fecha_inspector_envia: fecha
        };
        $scope.listaLotesModal = lotes;
        $http.post('/api/inspectorLote', nuevo).success(function(response) {
            $scope.listaLotesModal = response[0].lote;
        })
        $timeout(function() {
            traerSolicitudesFiltro();
            cambiaEstado(sol, lotes);
        }, 300);
    }

    //Envio de muestras a laboratorio
    $scope.enviaMuestraLaboratorio = function(sol, id_lote, lotes) {


        for (var i = 0; i < lotes.length; i++) {
            if (lotes[i].id_lote === id_lote) {
                lotes[i].inspectorEnvia = true;
                lotes[i].fecha_inspector_envia = new Date();
            }
        }
        var nuevo = {
            id_solicitud: sol,
            lote: lotes
        };

        $http.post('/api/loteCertificado', nuevo).success(function(response) {
            $scope.listaLotesModal = response[0].lote;
        })

        $timeout(function() {
            traerSolicitudesFiltro();
            cambiaEstado(sol, lotes);
        }, 300);

    }

    $scope.alerta = function() {
        $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.error('Notificacion', 'Debe asignar sellos');
    }

    function cambiaEstado(solicitud, lotes) {
        var cont = 1;
        for (var i = 0; i < lotes.length; i++) {
            if (lotes[i].inspectorEnvia != undefined) {
                cont++;
            }
        }
        if (cont === lotes.length) {
            $scope.habilitaEnvioLab = true;
        }
    }

    function cambiaEstadoMuestreo(solicitud, lotes) {
        var cont = 0;
        for (var i = 0; i < lotes.length; i++) {
            if (lotes[i].inspectorEnvia != undefined) {
                cont++;
            }
        }

        if (cont === lotes.length) {
            $scope.habilitaEnvioLab = true;
        }
    }


    $scope.liberarSolicitud = function(modalSol) {
        var solicitud = modalSol.id_solicitud;
        var pro = [{
            "id_proceso": 8,
            "descripcion": "Laboratorio",
            "color": "2E64FE",
            "icono": "flask",
            "visible": true
        }];
        var nuevo = {
            id_solicitud: solicitud,
            proceso: pro
        };
        $http.post('/api/procesos', nuevo).success(function(response) {})

        $timeout(function() {
            traerSolicitudesFiltro();
        }, 300);
    }




    //Metodo para aprovar solicitud cambia el proceso y restaura valores
    //-----------------------------------------------------------------------------------//
    $scope.aprobarInspeccion = function(modalSol) {

            var validacion = modalSol.lote;
            var cont = 0;

            if (validacion[0].sellos === undefined) {
                $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
                $notify.setPosition('bottom-left');
                $notify.info('Notificacion', 'Debe asignar sellos a los bultos');
            } else {
                for (var i = 0; i < validacion.length; i++) {
                    if (Number(validacion[i].bultos) === validacion[i].sellos.length) {
                        cont++;
                    }
                }
                if (cont === validacion.length) {
                    var nuevo = [{
                        "id_proceso": 8,
                        "descripcion": "Laboratorio",
                        "color": "2E64FE",
                        "icono": "flask",
                        "visible": true
                    }];
                    $http.put('/api/solicitud/' + modalSol.id_solicitud, {
                        id_orden_trabajo: modalSol.id_orden_trabajo,
                        estado: modalSol.estado,
                        proceso: nuevo,
                        inspector: modalSol.inspector,
                        laboratorio: modalSol.laboratorio,
                        fecha_planificacion: modalSol.fecha_planificacion
                    }).success(function(response) {});
                    $http.put('/api/solicitudEncargado/' + modalSol.id_solicitud, {
                        encargado: modalSol.laboratorio.nombre
                    }).success(function(resultado) {});

                    var aviso = {
                        usuario: $rootScope.loggedUser.id_usuario,
                        name: 'Orden de Trabajo',
                        id: modalSol.id_orden_trabajo,
                        online: 'ApruebaInspeccion',
                        status: 'fa-search ',
                        id_solicitud: modalSol.id_solicitud
                    };
                    $http.post('/api/avisos', aviso).success(function(resultado) {})

                    var aviso1 = {
                        usuario: 1,
                        name: 'Orden de Trabajo',
                        id: modalSol.id_orden_trabajo,
                        online: 'ApruebaInspeccion',
                        status: 'fa-search ',
                        id_solicitud: modalSol.id_solicitud
                    };
                    $http.post('/api/avisos', aviso1).success(function(resultado) {})

                    var aviso2 = {
                        usuario: modalSol.laboratorio,
                        name: 'Orden de Trabajo',
                        id: modalSol.id_orden_trabajo,
                        online: 'AsignaLaboratorio',
                        status: 'fa-flask ',
                        id_solicitud: modalSol.id_solicitud
                    };
                    $http.post('/api/avisos', aviso2).success(function(resultado) {})

                    $http.get('/api/usuarioId/' + 1).success(function(respu) {
                        var mail = {
                            nombre: 'Qualified',
                            para: respu[0].correo,
                            asunto: 'Alerta Qualified',
                            contenido: 'Inspeccion aprobada por ' + $rootScope.loggedUser.nombre + ' para la orden de trabajo: ' + modalSol.id_orden_trabajo
                        };
                        $http.post('/api/mail', mail).success(function(respuesta) {});
                    });
                    $http.get('/api/usuarioId/' + laboratorio).success(function(respu) {
                        var mail = {
                            nombre: 'Qualified',
                            para: respu[0].correo,
                            asunto: 'Alerta Qualified',
                            contenido: 'Envio de muestras por ' + $rootScope.loggedUser.nombre + ' para la orden de trabajo: ' + modalSol.id_orden_trabajo
                        };
                        $http.post('/api/mail', mail).success(function(respuesta) {});
                    });

                    $timeout(function() {
                        traerSolicitudesFiltro();
                    }, 300);
                    $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
                    $notify.setPosition('bottom-left');
                    $notify.success('Notificacion', 'Inspeccion aceptada');
                } else {
                    $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
                    $notify.setPosition('bottom-left');
                    $notify.info('Notificacion', 'Debe asignar sellos a los bultos');
                }
            }
            $timeout(function() {
                traerSolicitudesFiltro();
            }, 300);
        }
        //-----------------------------------------------------------------------------------//


    //Metodo que modifica el campo mensaje de solicitud para agregar y listar la lista de este
    //------------------------------------------------------------------------------------------------------------------------------//
    $scope.modalMensaje = function(modalSol, msj) {

        var lista = [];
        var id;
        if (modalSol.mensaje.length === 0) {
            id_mensaje = 1;
        } else {
            id_mensaje = modalSol.mensaje.length + 1;
        }
        lista = modalSol.mensaje;
        var fecha = new Date();
        var nuevo = {
            id_mensaje: id_mensaje,
            fecha: fecha,
            contenido: msj,
            emisor: $rootScope.loggedUser.nombre,
            cargo: $rootScope.loggedUser.perfil[0].nombre_perfil
        };
        lista.push(nuevo);
        $http.put('/api/solicitudMensaje/' + modalSol.id_solicitud, {
            mensaje: lista
        }).success(function(response) {});
        $scope.mensajesModal = lista;
        $scope.mensajeArea = '';

        if (modalSol.laboratorio !== undefined) {
            var aviso2 = {
                usuario: modalSol.laboratorio,
                name: 'Orden de Trabajo',
                id: modalSol.id_orden_trabajo,
                online: 'mensajeNuevo',
                status: 'fa-envelope ',
                id_solicitud: modalSol.id_solicitud
            };
            $http.post('/api/avisos', aviso2).success(function(respu) {})
            $http.get('/api/usuarioId/' + modalSol.laboratorio).success(function(respu) {
                var mail = {
                    nombre: 'Qualified',
                    para: respu[0].correo,
                    asunto: 'Alerta Qualified',
                    contenido: 'Mensaje enviado por ' + $rootScope.loggedUser.nombre + ' Mensaje: ' + msj
                };
                $http.post('/api/mail', mail).success(function(respuesta) {});
            });
        }

        var aviso = {
            usuario: $rootScope.loggedUser.id_usuario,
            name: 'Orden de Trabajo',
            id: modalSol.id_orden_trabajo,
            online: 'mensajeEnviado',
            status: 'fa-envelope ',
            id_solicitud: modalSol.id_solicitud
        };
        $http.post('/api/avisos', aviso).success(function(resultado) {})
        var aviso1 = {
            usuario: 1,
            name: 'Orden de Trabajo',
            id: modalSol.id_orden_trabajo,
            online: 'mensajeNuevo',
            status: 'fa-envelope ',
            id_solicitud: modalSol.id_solicitud
        };
        $http.post('/api/avisos', aviso1).success(function(respu) {})
        var aviso3 = {
            usuario: modalSol.cliente.id_usuario,
            name: 'Solicitud',
            id: modalSol.id_solicitud_cliente,
            online: 'mensajeNuevo',
            status: 'fa-envelope ',
            id_solicitud: modalSol.id_solicitud
        };
        $http.post('/api/avisos', aviso3).success(function(respu) {})
        var mail = {
            nombre: 'Qualified',
            para: $rootScope.loggedUser.correo,
            asunto: 'Alerta Qualified',
            contenido: 'Mensaje enviado por ' + $rootScope.loggedUser.nombre + ' Mensaje: ' + msj
        };
        $http.post('/api/mail', mail).success(function(respuesta) {});
        $http.get('/api/usuarioId/' + 1).success(function(respu) {
            var mail = {
                nombre: 'Qualified',
                para: respu[0].correo,
                asunto: 'Alerta Qualified',
                contenido: 'Mensaje enviado por ' + $rootScope.loggedUser.nombre + ' Mensaje: ' + msj
            };
            $http.post('/api/mail', mail).success(function(respuesta) {});
        });
        var mail = {
            nombre: 'Qualified',
            para: modalSol.cliente.correo,
            asunto: 'Alerta Qualified',
            contenido: 'Mensaje enviado por ' + $rootScope.loggedUser.nombre + ' Mensaje: ' + msj
        };
        $http.post('/api/mail', mail).success(function(respuesta) {});

        traerAvisosFiltro();
        $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.info('Notificacion', 'Mensaje Enviado');
    };
    //------------------------------------------------------------------------------------------------------------------------------//


    //------------------------------------------------------------------------------------------------------------------------------//
    $scope.desapruebaSoliciud = function(modalSol, observacion) {
        var nuevo = [{
            "id_proceso": 7,
            "descripcion": "Desaprueba Inspeccion",
            "color": "FF0000",
            "icono": "exclamation-triangle",
            "visible": true
        }];
        $http.put('/api/solicitud/' + modalSol.id_solicitud, {
            id_orden_trabajo: modalSol.id_orden_trabajo,
            estado: modalSol.estado,
            proceso: nuevo,
            inspector: '',
            laboratorio: '',
            fecha_planificacion: ''
        }).success(function(response) {
            var id_usuario = $rootScope.loggedUser.id_usuario;
            var listaEstados = [];
            fechaActual = new Date();
            $http.get('/api/inspector/' + id_usuario).success(function(response) {
                for (var i = 0; i < response.length; i++) {
                    var fechaPlanificacion = new Date(response[i].fecha_planificacion);
                    if (fechaPlanificacion >= fechaActual) {
                        listaEstados.push({
                            solicitud: response[i],
                            estado: 'En proceso'
                        });
                    }
                    if (fechaPlanificacion < fechaActual) {
                        listaEstados.push({
                            solicitud: response[i],
                            estado: 'Atrasada'
                        });
                    }
                }
                $scope.solicitudes = listaEstados;
            });
        });
        var observaciones = {
            id_solicitud: modalSol.id_solicitud,
            observacion: observacion
        };
        $http.post('/api/observacion', observaciones).success(function(respuesta) {})

        var aviso = {
            usuario: $rootScope.loggedUser.id_usuario,
            name: 'Orden de Trabajo',
            id: modalSol.id_orden_trabajo,
            online: 'DesapruebaInspeccion',
            status: 'fa-search ',
            id_solicitud: modalSol.id_solicitud
        };
        $http.post('/api/avisos', aviso).success(function(resultado) {})

        var aviso1 = {
            usuario: 1,
            name: 'Orden de Trabajo',
            id: modalSol.id_orden_trabajo,
            online: 'DesapruebaInspeccion',
            status: 'fa-search ',
            id_solicitud: modalSol.id_solicitud
        };
        $http.post('/api/avisos', aviso1).success(function(resultado) {})

        $http.get('/api/usuarioId/' + 1).success(function(respu) {
            var mail = {
                nombre: 'Qualified',
                para: respu[0].correo,
                asunto: 'Alerta Qualified',
                contenido: 'Inspeccion desaprobada por ' + $rootScope.loggedUser.nombre + ' para la orden de trabajo: ' + modalSol.id_orden_trabajo
            };
            $http.post('/api/mail', mail).success(function(respuesta) {});
        });

        $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.error('Notificacion', 'Desaprueba inspeccion');
        $timeout(function() {
            traerSolicitudesFiltro();
        }, 500);
    }

    $scope.uploadPic = function(file, modalSol) {
        file.upload = Upload.upload({
            url: '/evidencias',
            data: {
                file: file
            },
        });

        file.upload.then(function(response) {
            $timeout(function() {
                file.result = response.data;
            });
        }, function(response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        }, function(evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });

        $http.get('/api/solicitudUnica/' + modalSol.id_solicitud).success(function(respuesta) {
            var lista = respuesta[0].evidencia;
            var fecha = new Date();
            lista.push({
                nombre: file.name,
                fecha: fecha
            })
            $http.put('/api/solicitudEvidencia/' + modalSol.id_solicitud, {
                evidencia: lista
            }).success(function(resultado) {})
        })

    }

    //------------------------------------------------------------------------------------------------------------------------------//


    $scope.desaprovarTransporte = function(modalSol, observacion) {
        var nuevo = [{
            "id_proceso": 13,
            "descripcion": "Rechaza Transporte",
            "color": "FF0000",
            "icono": "truck",
            "visible": true
        }];
        $http.put('/api/solicitud/' + modalSol.id_solicitud, {
            id_orden_trabajo: modalSol.id_orden_trabajo,
            estado: modalSol.estado,
            proceso: nuevo,
            inspector: modalSol.inspector,
            laboratorio: modalSol.laboratorio,
            fecha_planificacion: modalSol.fecha_planificacion
        }).success(function(response) {});
        var observaciones = {
            id_solicitud: modalSol.id_solicitud,
            observacion: observacion
        };
        $http.post('/api/observacion', observaciones).success(function(respuesta) {})

        var aviso = {
            usuario: $rootScope.loggedUser.id_usuario,
            name: 'Orden de Trabajo',
            id: modalSol.id_orden_trabajo,
            online: 'DesapruebaTransporte',
            status: 'fa-truck ',
            id_solicitud: modalSol.id_solicitud
        };
        $http.post('/api/avisos', aviso).success(function(resultado) {})

        var aviso1 = {
            usuario: 1,
            name: 'Orden de Trabajo',
            id: modalSol.id_orden_trabajo,
            online: 'DesapruebaTransporte',
            status: 'fa-truck ',
            id_solicitud: modalSol.id_solicitud
        };
        $http.post('/api/avisos', aviso1).success(function(resultado) {})

        $http.get('/api/usuarioId/' + 1).success(function(respu) {
            var mail = {
                nombre: 'Qualified',
                para: respu[0].correo,
                asunto: 'Alerta Qualified',
                contenido: 'Transporte desaprobado por ' + $rootScope.loggedUser.nombre + ' para la orden de trabajo: ' + modalSol.id_orden_trabajo
            };
            $http.post('/api/mail', mail).success(function(respuesta) {});
        });
        var mail = {
            nombre: 'Qualified',
            para: modalSol.cliente.correo,
            asunto: 'Alerta Qualified',
            contenido: 'Carga del vehiculo desaprobada por ' + $rootScope.loggedUser.nombre + ' para la solicitud: ' + modalSol.id_solicitud_cliente
        };
        $http.post('/api/mail', mail).success(function(respuesta) {});

        $timeout(function() {
            traerSolicitudesFiltro();
        }, 500);
        $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.error('Notificacion', 'Desaprueba Transporte');
    }

    $scope.aprovarTransporte = function(modalSol) {
        var nuevo = [{
            "id_proceso": 12,
            "descripcion": "Aprueba Transporte",
            "color": "2E2EFE",
            "icono": "truck",
            "visible": true
        }];
        $http.put('/api/solicitud/' + modalSol.id_solicitud, {
            id_orden_trabajo: modalSol.id_orden_trabajo,
            estado: modalSol.estado,
            proceso: nuevo,
            inspector: modalSol.inspector,
            laboratorio: modalSol.laboratorio,
            fecha_planificacion: modalSol.fecha_planificacion
        }).success(function(response) {});

        $http.put('/api/solicitudEncargado/' + modalSol.id_solicitud, {
            encargado: modalSol.cliente.nombre
        }).success(function(resultado) {});

        var aviso = {
            usuario: $rootScope.loggedUser.id_usuario,
            name: 'Orden de Trabajo',
            id: modalSol.id_orden_trabajo,
            online: 'ApruebaTransporte',
            status: 'fa-truck ',
            id_solicitud: modalSol.id_solicitud
        };
        $http.post('/api/avisos', aviso).success(function(resultado) {})

        var aviso1 = {
            usuario: 1,
            name: 'Orden de Trabajo',
            id: modalSol.id_orden_trabajo,
            online: 'ApruebaTransporte',
            status: 'fa-truck ',
            id_solicitud: modalSol.id_solicitud
        };
        $http.post('/api/avisos', aviso1).success(function(resultado) {})

        $http.get('/api/usuarioId/' + 1).success(function(respu) {
            var mail = {
                nombre: 'Qualified',
                para: respu[0].correo,
                asunto: 'Alerta Qualified',
                contenido: 'Transporte aprobado por ' + $rootScope.loggedUser.nombre + ' para la orden de trabajo: ' + modalSol.id_orden_trabajo
            };
            $http.post('/api/mail', mail).success(function(respuesta) {});
        });
        var mail = {
            nombre: 'Qualified',
            para: modalSol.cliente.correo,
            asunto: 'Alerta Qualified',
            contenido: 'Carga del vehiculo aprobada por ' + $rootScope.loggedUser.nombre + ' para la solicitud: ' + modalSol.id_solicitud_cliente
        };
        $http.post('/api/mail', mail).success(function(respuesta) {});

        $timeout(function() {
            traerSolicitudesFiltro();
        }, 300);
        $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
        $notify.setPosition('bottom-left');
        $notify.success('Notificacion', 'Transporte aceptado');
    }



    //Metodo para enviar datos a modal de rechazo de solicitud
    //------------------------------------------------------------------//
    $scope.enviarRechazaModal = function(sol) {
        $scope.modalSol = sol;
    };
    //-----------------------------------------------------------------//


    //Metodo para enviar datos a modal (mensaje)
    //------------------------------------------------------------------//
    $scope.enviarMensajeModal = function(sol) {
        $scope.modalSol = sol;
        $scope.mensajesModal = sol.mensaje;
    };
    //-----------------------------------------------------------------//

    //Metodo para enviar datos a modal (Aceptacion)
    //------------------------------------------------------------------//
    $scope.enviarAceptar = function(sol) {
        $scope.modalSol = sol;
    };
    //-----------------------------------------------------------------//
    //Metodo para enviar datos a modal (Aceptacion)
    //------------------------------------------------------------------//
    $scope.enviarAprobarInspeccion = function(sol) {
        $scope.modalSol = sol;
    };
    //-----------------------------------------------------------------//

    //Metodo para enviar datos a modal (Desaprovacion)
    //------------------------------------------------------------------//
    $scope.enviarNoAprueba = function(sol) {
        $scope.modalSol = sol;
    };
    //-----------------------------------------------------------------//

    //Metodo para enviar datos a modal (Aceptacion)
    //------------------------------------------------------------------//
    $scope.enviarNoApruebaTransporte = function(sol) {
        $scope.modalSol = sol;
    };
    //-----------------------------------------------------------------//

    //Metodo para enviar datos a modal (Aprovacion)
    //------------------------------------------------------------------//
    $scope.enviarApruebaTransporte = function(sol) {
        $scope.modalSol = sol;
    };
    //-----------------------------------------------------------------//


    //Metodo para enviar datos a modal (Vista)
    //------------------------------------------------------------------//
    $scope.enviarVistaModal = function(sol) {
        $scope.modalSolicitud = sol;
        $scope.modalSol = sol.id_solicitud;
        $scope.modalFecha = sol.fecha_creacion;
        $scope.modalFechaMuestreo = sol.fecha_muestreo;
        $scope.modalCliente = sol.cliente.nombre;
        $scope.listaLotesModal = sol.lote;
        $scope.modalFechaPlanificacion = sol.fecha_planificacion;

        if (sol.proceso[0].id_proceso === 4) {
            $scope.imprime = true;
        } else {
            $scope.imprime = false;
        }

        $scope.muestraAcepta = false;
        $scope.muestraRechaza = false;
        $scope.muestraAprueba = false;
        $scope.muestraDesaprueba = false;
        $scope.muestraApruebaTransporte = false;
        $scope.muestraDesapruebaTransporte = false;
        listarObservacion(sol);
        if (sol.tipoMuestreo.id_muestreo === 1) {
            cambiaEstado(sol, sol.lote);
        } else {
            cambiaEstadoMuestreo(sol, sol.lote);
        }




    };
    //-----------------------------------------------------------------//


    //Metodos para datepicker
    //-----------------------------------------------------------------------------------------------------------------//
    $scope.today = function() {
        $scope.fecha_muestreo = new Date();
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
    $scope.events = [{
        date: tomorrow,
        status: 'full'
    }, {
        date: afterTomorrow,
        status: 'partially'
    }];

    function getDayClass(data) {
        var date = data.date,
            mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }
    //-----------------------------------------------------------------------------------------------------------------//

    $scope.filtroEstados = function(estado) {

        var id_usuario = $rootScope.loggedUser.id_usuario;
        var listaEstadoAtrasada = [];
        var listaEstadoProceso = [];
        fechaActual = new Date();
        $http.get('/api/inspector/' + id_usuario).success(function(response) {
            for (var i = 0; i < response.length; i++) {
                var fechaPlanificacion = new Date(response[i].fecha_planificacion);
                if (fechaPlanificacion >= fechaActual) {
                    listaEstadoProceso.push({
                        solicitud: response[i],
                        estado: 'En proceso'
                    });
                }
                if (fechaPlanificacion < fechaActual) {
                    listaEstadoAtrasada.push({
                        solicitud: response[i],
                        estado: 'Atrasada'
                    });
                }
            }
            if (estado === 'En proceso') {
                $scope.solicitudes = listaEstadoProceso;
            }
            if (estado === 'Atrasada') {
                $scope.solicitudes = listaEstadoAtrasada;
            }
            if (estado === 'Todas') {
                traerSolicitudesFiltro();
            }
        });
    }

    function listarProcesosInspector() {

        // var id_perfil = $rootScope.loggedUser.perfil[0].id_perfil;
        // console.log(id_perfil);
        // $http.get('/api/workFlow/' + id_perfil).success(function(response){
        //   // var workFlow = response[0].workFlow;
        //   // var lista = [];
        //   // for (var i = 0; i < workFlow.length; i++) {
        //   //   if (workFlow[i].check) {
        //   //     lista.push(workFlow[i]);
        //   //   }
        //   // }
        //   console.log(response);
        // });

        $http.get('/api/procesos').success(function(respuesta) {
            $scope.pasos = respuesta;
        });

    }


    $scope.filtrarProceso = function(id_proceso) {
        var lista = [];
        var inspector = {
            id_inspector: $rootScope.loggedUser.id_usuario
        };
        fechaActual = new Date();
        if (id_proceso === null) {
            traerSolicitudesFiltro();
        } else {
            $http.post('/api/filtro/' + id_proceso, inspector).success(function(response) {

                for (var i = 0; i < response.length; i++) {
                    var fechaPlanificacion = new Date(response[i].fecha_planificacion);
                    if (fechaPlanificacion >= fechaActual) {
                        lista.push({
                            solicitud: response[i],
                            estado: 'En proceso'
                        });
                    }
                    if (fechaPlanificacion < fechaActual) {
                        lista.push({
                            solicitud: response[i],
                            estado: 'Atrasada'
                        });
                    }
                }
                $scope.solicitudes = lista;
            });
        }
    }

    // // Metodo que redirecciona a la vista del pdf
    // $scope.mostrarPdf = function(id_solicitud, id_lote){
    //
    //   $http.get('/api/solicitudUnica/' + id_solicitud).success(function(response){
    //
    //     for (var i = 0; i < response[0].lote.length; i++) {
    //       if (response[0].lote[i].id_lote === id_lote) {
    //
    //         var nombreCertificado = response[0].lote[i].certificado;
    //         $http.get('/traerCertificado/' + nombreCertificado).success(function(certificado){
    //           var contentType = 'application/pdf';
    //           var b64Data = certificado;
    //
    //           var blob = b64toBlob(b64Data, contentType);
    //           var blobUrl = URL.createObjectURL(blob);
    //           $scope.content = $sce.trustAsResourceUrl(blobUrl);
    //           $timeout(function() {
    //             printPdf();
    //           }, 300);
    //         });
    //       }
    //     };
    //   });
    //
    // }

    // // Metodo que habre una nueva vista con el pdf
    // function printPdf() {
    //
    //   var divName  = 'pdfDiv';
    //   var printContents = document.getElementById(divName).innerHTML;
    //   var popupWin = window.open('', 'Certificados' ,'_blank', 'width=100%,height=100%');
    //   popupWin.document.open();
    //   popupWin.document.write('<html><head></head><body style="width=100%,height=100%">' + printContents + '</body></html>');
    //   popupWin.document.close();
    //
    // }


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

        var blob = new Blob(byteArrays, {
            type: contentType
        });
        return blob;
    }

    function printEvidencia() {
        var divName = 'evidenciaVer';
        var printContents = document.getElementById(divName).innerHTML;
        var popupWin = window.open('', 'Evidencias', '_blank', 'width=100%,height=100%');
        popupWin.document.open();
        popupWin.document.write('<html><head></head><body style: width:100%; height:100%;>' + printContents + '</body></html>');
        popupWin.document.close();
    }

    $scope.eliminarImg = function(nombre, solicitud) {


        $http.delete('/eliminarImg/' + nombre).success(function(response) {});

        var archivo = {
            nombreArchivo: nombre
        };
        $http.put('/api/solicitudArchivo/' + solicitud.id_solicitud, archivo).success(function(respuesta) {
            $scope.modalSolicitud.evidencia = respuesta.evidencia;
        });
        $timeout(function() {
            traerSolicitudesFiltro();
        }, 300);

    }

    $scope.habilitaCheck = false;

    $scope.enviarModalSellos = function(item, solicitud) {

        var id_usuario = $rootScope.loggedUser.id_usuario;
        $http.get('/api/solicitudUnica/' + solicitud.id_solicitud).success(function(respuesta) {
            $scope.modalSol = respuesta[0];
            var aux = respuesta[0].lote;
            for (var i = 0; i < aux.length; i++) {
                if (aux[i].id_lote === item.id_lote) {
                    $scope.lote = aux[i];
                    if (aux[i].asignados < aux[i].bultos) {
                        $scope.colorAsignado = "danger";
                        $scope.habilitaCheck = false;
                        $scope.asignados = aux[i].asignados;
                    } else if (aux[i].asignados === undefined) {
                        $scope.colorAsignado = "danger";
                        $scope.asignados = 0;
                        $scope.habilitaCheck = false;
                    } else {
                        $scope.colorAsignado = "success";
                        $scope.habilitaCheck = true;
                        $scope.asignados = aux[i].asignados;
                    }
                    if (aux[i].sellos !== undefined) {
                        $scope.sellosUtilizados = aux[i].sellos;
                    } else {
                        $scope.sellosUtilizados = [];
                    }
                }
            }
        });
        $http.get('/api/traerSellosFiltro/' + id_usuario).success(function(response) {
            if (response[0] !== undefined) {
                $scope.sellosInspector = response[0].numero;
            } else {
                $scope.sellosInspector = [];
            }
        });
    }

    // $scope.reiniciarModal = function(solicitud){
    //
    //
    //     $scope.sellosUtilizados = [];
    //
    //   });
    //
    // }


    listarsellosFiltroUsuario();

    function listarsellosFiltroUsuario() {
        var id_usuario = $rootScope.loggedUser.id_usuario;
        $http.get('/api/traerSellosFiltro/' + id_usuario).success(function(response) {
            if (response[0] !== undefined) {
                $scope.sellosInspector = response[0].numero;
            }
        });
    };

    // $scope.reiniciarValores = function(sellosUtilizado){
    //
    //   var id_usuario = $rootScope.loggedUser.id_usuario;
    //   $http.get('/api/traerSellosFiltro/' + id_usuario ).success(function(response){
    //     if (response[0] !== undefined) {
    //       $scope.sellosInspector = response[0].numero;
    //       $scope.desde = '';
    //     }
    //   });
    //   $scope.sellosUtilizados = [];
    //
    // }


    $scope.usarSellos = function(modalSol, id_lote, sellosInspector, sellos, desde, bultos, asignados, selloslote, check, utilizados) {


        var id_usuario = $rootScope.loggedUser.id_usuario;

        if (desde !== undefined && check) {

            var lotes = modalSol.lote;
            var listaSellosSalida = [];
            var listaSellosRestantes = [];
            // var sellosMongo = response[0].numero;
            var sellosMongo = sellosInspector;

            if (asignados != 0) {

                for (var i = 0; i < sellosMongo.length; i++) {
                    if (Number(desde) !== listaSellosSalida.length) {
                        listaSellosSalida.push(sellosMongo[i]);
                    } else {
                        listaSellosRestantes.push(sellosMongo[i]);
                    }
                }

                $scope.sellosInspector = listaSellosRestantes;
                $scope.sellosUtilizados = utilizados.concat(listaSellosSalida);

                for (var i = 0; i < lotes.length; i++) {
                    if (id_lote === lotes[i].id_lote) {

                        if ($scope.sellosUtilizados.length === Number(lotes[i].bultos)) {
                            $scope.colorAsignado = "success";
                            $scope.asignados = $scope.sellosUtilizados.length;
                        } else {
                            $scope.colorAsignado = "danger";
                            $scope.asignados = $scope.sellosUtilizados.length;
                        }

                    }
                }

            } else {

                for (var i = 0; i < sellosMongo.length; i++) {
                    if (Number(desde) !== listaSellosSalida.length) {
                        listaSellosSalida.push(sellosMongo[i]);
                    } else {
                        listaSellosRestantes.push(sellosMongo[i]);
                    }
                }

                $scope.sellosInspector = listaSellosRestantes;
                $scope.sellosUtilizados = listaSellosSalida;

                for (var i = 0; i < lotes.length; i++) {
                    if (id_lote === lotes[i].id_lote) {

                        if (listaSellosSalida.length === Number(lotes[i].bultos)) {
                            $scope.colorAsignado = "success";
                            $scope.asignados = listaSellosSalida.length;
                        } else {
                            $scope.colorAsignado = "danger";
                            $scope.asignados = listaSellosSalida.length;
                        }

                    }
                }

            }

        } else {

            $http.get('/api/traerSellosFiltro/' + id_usuario).success(function(response) {

                var lotes = modalSol.lote;
                var listaSellosSalida = [];
                var listaSellosRestantes = [];
                var sellosMongo = sellosInspector;
                // var sellosMongo = response[0].numero;
                var listaAux = [];


                if (asignados != 0) {

                    for (var i = 0; i < sellos.length; i++) {
                        for (var j = 0; j < sellosMongo.length; j++) {
                            if (sellos[i] === sellosMongo[j]) {
                                sellosMongo.splice(j, 1);
                                j = sellosMongo.length;
                            }
                        }
                    }

                    $scope.sellosInspector = sellosMongo;
                    $scope.sellosUtilizados = utilizados.concat(sellos);

                    for (var i = 0; i < lotes.length; i++) {
                        if (id_lote === lotes[i].id_lote) {

                            if ($scope.sellosUtilizados.length === Number(lotes[i].bultos)) {
                                $scope.colorAsignado = "success";
                                $scope.asignados = $scope.sellosUtilizados.length;
                            } else {
                                $scope.colorAsignado = "danger";
                                $scope.asignados = $scope.sellosUtilizados.length;
                            }

                        }
                    }

                } else {

                    for (var i = 0; i < sellos.length; i++) {
                        for (var j = 0; j < sellosMongo.length; j++) {
                            if (sellos[i] === sellosMongo[j]) {
                                sellosMongo.splice(j, 1);
                                j = sellosMongo.length;
                            }
                        }
                    }

                    $scope.sellosInspector = sellosMongo;
                    $scope.sellosUtilizados = sellos;

                    for (var i = 0; i < lotes.length; i++) {
                        if (id_lote === lotes[i].id_lote) {

                            if (sellos.length === Number(lotes[i].bultos)) {
                                $scope.colorAsignado = "success";
                                $scope.asignados = sellos.length;
                            } else {
                                $scope.colorAsignado = "danger";
                                $scope.asignados = sellos.length;
                            }

                        }
                    }

                }

            });

        }

    }

    $scope.restarSellos = function(sellosInspector, sellosSeleccionados, sellosAsignados, asignados, id_lote, bultos) {

        var listaSalida = sellosInspector;
        var lista = [];

        if (sellosSeleccionados.length === 0) {

            $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
            $notify.setPosition('bottom-left');
            $notify.info('Notificacion', 'Debe seleccionar un sello');

        } else {

            for (var i = 0; i < sellosSeleccionados.length; i++) {
                for (var j = 0; j < sellosAsignados.length; j++) {

                    if (sellosSeleccionados[i] === sellosAsignados[j]) {
                        sellosAsignados.splice(j, 1);
                    }
                }
            }

            $scope.sellosInspector = listaSalida.concat(sellosSeleccionados);
            $scope.sellosUtilizados = sellosAsignados;


            if (sellosAsignados.length === Number(bultos)) {
                $scope.colorAsignado = "success";
                $scope.asignados = $scope.sellosUtilizados.length;
            } else {
                $scope.colorAsignado = "danger";
                $scope.asignados = $scope.sellosUtilizados.length;
            }

        }

    }


    $scope.guardarCambios = function(lote, lista, asignados, modalSol, sellosInspector) {

        if (asignados === 0) {

            $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
            $notify.setPosition('bottom-left');
            $notify.info('Notificacion', 'No asigno sellos');

        } else {

            if (lote.sellos === undefined) {
                if (lista.length === Number(lote.bultos)) {
                    var nuevoSellos = lista;
                    var lote = {
                        id_solicitud: modalSol.id_solicitud,
                        id_lote: lote.id_lote,
                        sellos: nuevoSellos,
                        asignados: asignados
                    };
                    $http.post('/api/loteSellos', lote).success(function(respu) {
                        $scope.listaLotesModal = respu[0].lote;
                    })
                    var nuevo = {
                        usados: lista,
                        numero: sellosInspector,
                        usuario: $rootScope.loggedUser.id_usuario
                    };
                    $http.post('/api/modificarSellosInspector/' + $rootScope.loggedUser.id_usuario, nuevo).success(function(response) {});
                    $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
                    $notify.setPosition('bottom-left');
                    $notify.success('Notificacion', 'Asignacion realizada con exito');
                } else {
                    if (asignados > Number(lote.bultos)) {
                        $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
                        $notify.setPosition('bottom-left');
                        $notify.info('Notificacion', 'Sellos superan los bultos');
                    } else {
                        $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
                        $notify.setPosition('bottom-left');
                        $notify.info('Notificacion', 'Sellos insuficientes');
                    }
                }
            } else {
                if (lista.length === Number(lote.bultos)) {
                    var nuevoSellos = lista;
                    var lote = {
                        id_solicitud: modalSol.id_solicitud,
                        id_lote: lote.id_lote,
                        sellos: nuevoSellos,
                        asignados: asignados
                    };
                    $http.post('/api/loteSellos', lote).success(function(respu) {
                        $scope.listaLotesModal = respu[0].lote;
                    });
                    var nuevo = {
                        usados: lista,
                        numero: sellosInspector,
                        usuario: $rootScope.loggedUser.id_usuario
                    };
                    $http.post('/api/modificarSellosInspector/' + $rootScope.loggedUser.id_usuario, nuevo).success(function(response) {});
                    $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
                    $notify.setPosition('bottom-left');
                    $notify.success('Notificacion', 'Asignacion realizada con exito');
                } else {
                    if (asignados > Number(lote.bultos)) {
                        $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
                        $notify.setPosition('bottom-left');
                        $notify.info('Notificacion', 'Sellos superan los bultos');
                    } else {
                        $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
                        $notify.setPosition('bottom-left');
                        $notify.info('Notificacion', 'Sellos insuficientes');
                    }
                }
            }
        }
        $timeout(function() {
            traerSolicitudesFiltro();
        }, 300);
        $timeout(function() {
            $scope.enviarModalSellos(lote, modalSol);
        }, 300);
    }


    $scope.enviarModalImpresion = function(modalSol, item) {

        $scope.modalSolicitud = modalSol;
        $http.get('/api/usuarioId/' + modalSol.laboratorio).success(function(response) {
            var laboratorio = response[0].nombre;
            var lista = [];

            if (item.traders === '' || item.traders === undefined) {
                var traders = "-";
            } else {
                var traders = item.traders.nombre;
            }

            var nuevo = {
                'asignados': item.asignados,
                'sellos': item.sellos,
                'id_lote': item.id_lote,
                'materiaPrima': item.materiaPrima,
                'trader': item.trader.nombreTrader,
                'paisTrader': item.paisTrader,
                'lote': item.lote,
                'bultos': item.bultos,
                'cantidad': item.cantidad,
                'contenedor': item.contenedor,
                'bodega': item.bodega,
                'estadoLab': item.estadoLab,
                'muestreo': modalSol.tipoMuestreo.descripcion,
                'bodega': item.bodega,
                'traders': traders,
                'laboratorio': laboratorio
            };
            lista.push(nuevo);

            $scope.listaImpresion = lista;
        })
    }


    $scope.imprimirSellos = function() {

        var divName = 'divSellos';
        var printContents = document.getElementById(divName).innerHTML;
        var popupWin = window.open('', 'Sellos', '_blank', 'width=100%,height=100%');
        popupWin.document.open();
        popupWin.document.write('<html><head><link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet"></head><body onload="window.print()" style: width:100%; height:100%;>' + printContents + '</body></html>');
        popupWin.document.close();
    }

    // $scope.validarSalida = function(lista){
    //
    //
    //
    // };

    $scope.agregarObservacion = function(solicitud, observacion, id_lote, listaEvidencias) {

        var archivos = listaEvidencias;
        var fecha = new Date();

        var nuevo = {
            observacion: [{
                fecha: fecha,
                contenido: observacion,
                emisor: $rootScope.loggedUser.nombre,
                cargo: $rootScope.loggedUser.perfil[0].nombre_perfil,
                evidencias: archivos
            }],
            id_solicitud: solicitud.id_solicitud,
            id_lote: id_lote,
            id_solicitud_cliente: solicitud.id_solicitud_cliente,
            id_orden_trabajo: solicitud.id_solicitud_cliente
        };
        var observacion_lote = {
            observacion: nuevo
        };
        var id = {
            id_solicitud: solicitud.id_solicitud,
            id_lote: id_lote
        };

        $http.post('/api/traerObservacion', id).success(function(respuesta) {

            if (respuesta !== '0') {

                var obs = {
                    fecha: fecha,
                    contenido: observacion,
                    emisor: $rootScope.loggedUser.nombre,
                    cargo: $rootScope.loggedUser.perfil[0].nombre_perfil,
                    evidencias: archivos
                };
                var lista = respuesta.observacion;
                lista.push(obs);
                var nuevo = {
                    observacion: lista,
                    id_solicitud: respuesta.id_solicitud,
                    id_lote: respuesta.id_lote,
                    id_solicitud_cliente: respuesta.id_solicitud_cliente,
                    id_orden_trabajo: respuesta.id_solicitud_cliente
                };

                $http.post('/api/actualizarObservacion', nuevo).success(function(respu) {
                    $scope.ObservacionesModal = respu[0].observacion;
                    $scope.observacion = '';
                    $scope.numeros = 0;
                });


            } else {

                $http.post('/api/agregarObservacion', observacion_lote).success(function(response) {
                    $scope.ObservacionesModal = response[0].observacion;
                    $scope.observacion = '';
                    $scope.numeros = 0;
                });

                $http.get('/api/solicitudUnica/' + solicitud.id_solicitud).success(function(sol) {
                    var lotes = sol[0].lote;
                    var lista = [];
                    var lote = {};
                    for (var i = 0; i < lotes.length; i++) {
                        if (lotes[i].id_lote === id_lote) {
                            lote = {
                                'bodega': lotes[i].bodega,
                                'id_lote': lotes[i].id_lote,
                                'materiaPrima': lotes[i].materiaPrima,
                                'trader': lotes[i].trader,
                                'paisTrader': lotes[i].paisTrader,
                                'lote': lotes[i].lote,
                                'bultos': lotes[i].bultos,
                                'cantidad': lotes[i].cantidad,
                                'contenedor': lotes[i].contenedor,
                                'tipoMuestreo': lotes[i].tipoMuestreo,
                                'estadoLab': lotes[i].estadoLab,
                                'observaciones': true
                            };
                            lista.push(lote);
                        } else {
                            lista.push(lotes[i]);
                        }
                    }
                    var post = {
                        lotes: lista,
                        id_solicitud: solicitud.id_solicitud
                    };
                    $http.put('/api/modificarLotes/' + solicitud.id_solicitud, post).success(function(respuesta) {
                        $scope.listaLotesModal = respuesta;
                    });
                });
            }
        });
        $timeout(function() {
            traerSolicitudesFiltro();
            $scope.vaciarListaEvidencias();
        }, 500);
    }

    $scope.enviarObservacionModal = function(sol, id_lote) {

        $scope.modalSol = sol;

        id = {
            id_solicitud: sol.id_solicitud,
            id_lote: id_lote
        };

        $http.post('/api/traerObservacion', id).success(function(respuesta) {
            $scope.ObservacionesModal = respuesta.observacion;
        });
        $scope.id_loteObservacion = id_lote;

    };

    $scope.listaEvidencias = [];
    $scope.numeros = 0;

    $scope.vaciarListaEvidencias = function() {
        $scope.listaEvidencias = [];
    }

    $scope.uploadPic = function(file, modalSol, id_lote, listaEvidencias) {

        var nombre = file.name;
        var cadena = nombre.substr(-3).toLowerCase();

        if (cadena !== 'jpg' && cadena !== 'peg' && cadena !== 'png') {
            $notify.setTime(3).setPosition('bottom-right').showCloseButton(true).showProgressBar(true);
            $notify.setPosition('bottom-left');
            $notify.info('Notificacion', 'Archivo no valido');
        } else {
            var lista = [];

            if (listaEvidencias.length !== 0) {
                var lista = listaEvidencias;

            }

            file.upload = Upload.upload({
                url: '/evidencias',
                data: {
                    file: file
                },
            });

            file.upload.then(function(response) {
                $timeout(function() {
                    file.result = response.data;
                });
            }, function(response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {
                // Math.min is to fix IE which reports 200% sometimes
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.picFile = null;
            lista.push({
                nombreArchivo: file.name
            });

            $scope.listaEvidencias = lista;

            $scope.numeros = lista.length;
        }

    }

    $scope.mostrarEvidencia = function(evidencia) {

        $http.get('/traerCertificado/' + evidencia).success(function(evidencias) {
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


    $scope.habilitaImpresion = true;
    $scope.generarArray = function(nro) {
        var lista = [];
        var n = Number(nro);
        for (var i = 0; i < n; i++) {
            lista.push(i + 1);
        }
        $scope.nroImpresiones = lista;
        $scope.habilitaImpresion = false;

    }

    // ------------------------------------------------------------------------------------------------------




    $scope.arreglo = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];



    $scope.setearValoresActa = function(fecha, id_solicitud, valor) {
        if (valor === 1) {
            $scope.habilitaHarina = true;
            $scope.habilitaMuestra = false;
            $scope.habilitaCasino = false;

            var fechaAux = new Date(fecha);
            var fechaAuxMes = fechaAux.getUTCMonth() + 1;
            var fechaAuxDia = fechaAux.getUTCDate();
            var fechaAuxAnio = fechaAux.getUTCFullYear();
            var fechaAux2 = fechaAuxDia + '' + fechaAuxMes + '' + fechaAuxAnio + '';

            var listaEnvia = [];
            var listaModal = [];



            $http.get('/api/solicitudUnica/' + id_solicitud).success(function(solicitud) {

                var laboratorioDestino = solicitud[0].laboratorio;
                var lotes = solicitud[0].lote;

                for (var i = 0; i < lotes.length; i++) {
                    if (lotes[i].inspectorEnvia === true) {
                        listaEnvia.push(lotes[i]);
                    }
                }

                for (var i = 0; i < listaEnvia.length; i++) {

                    var fechaLote = new Date(listaEnvia[i].fechaLab);
                    var fechaLoteMes = fechaLote.getUTCMonth() + 1;
                    var fechaLoteDia = fechaLote.getUTCDate();
                    var fechaLoteAnio = fechaLote.getUTCFullYear();
                    var fechaAux3 = fechaLoteDia + '' + fechaLoteMes + '' + fechaLoteAnio + '';
                    if (fechaAux3 === fechaAux2) {
                        listaModal.push(listaEnvia[i]);
                    }

                }

                $http.get('/api/usuarioId/' + laboratorioDestino).success(function(lab) {
                    $scope.destinoAnalisis = lab[0].nombre;
                });

                $scope.listaImpresion = listaModal;

            });

        } else if (valor === true) {
            console.log('else if');
            $scope.habilitaHarina = false;
            $scope.habilitaMuestra = false;
            $scope.habilitaCasino = true;


        } else {
            console.log('else');
            $scope.habilitaHarina = false;
            $scope.habilitaMuestra = true;
            $scope.habilitaCasino = false;

            $http.get('/api/solicitudUnica/' + id_solicitud).success(function(solicitud) {
                $scope.solicitud = solicitud[0];
                var listaNueva = [];
                for (var i = 0; i < solicitud[0].lote.length; i++) {
                    if (solicitud[0].lote[i].inspectorEnvia === true) {
                        listaNueva.push(solicitud[0].lote[i]);
                    }
                }

                var listaCorreo = solicitud[0].cliente.correo;
                var descripcionCorreo = '';
                for (var i = 0; i < listaCorreo.length; i++) {
                    if (descripcionCorreo === '') {
                        descripcionCorreo += listaCorreo[i];
                    } else {
                        descripcionCorreo += ', ' + listaCorreo[i];
                    }
                }


                $scope.correoCliente = descripcionCorreo;

                $scope.listaLotesMuestra = listaNueva;
                $scope.fecha_actual = new Date();
            });

        }

    }

    $scope.imprimirActa = function() {

        var divName = 'acta';
        var printContents = document.getElementById(divName).innerHTML;
        var popupWin = window.open('', 'Sellos', '_blank', 'width=100%,height=100%');
        popupWin.document.open();
        popupWin.document.write('<html><head><link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet"></head><body onload="window.print()" style: width:100%; height:100%;>' + printContents + '</body></html>');
        popupWin.document.close();
    }


}]);
