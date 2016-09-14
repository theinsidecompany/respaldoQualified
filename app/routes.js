var Usuario = require('./modelo/usuario');
var Perfil = require('./modelo/perfil');
var Llave = require('./modelo/llave');
var Solicitud = require('./modelo/solicitud');
var ControllerSolicitud = require('./controladores/controllerSolicitud');
var ControllerLlave = require('./controladores/controllerLlave');
var ControllerPerfil = require('./controladores/controllerPerfil');
var ControllerUsuario = require('./controladores/controllerUsuario');
var ControllerTrader = require('./controladores/controllerTrader');
var ControllerPais = require('./controladores/controllerPais');
var ControllerMateriaPrima = require('./controladores/controllerMateriaPrima');
var ControllerProducto = require('./controladores/controllerProducto');
var ControllerBodega = require('./controladores/controllerBodega');
var ControllerMail = require('./controladores/controllerMail');
var ControllerLogin = require('./controladores/controllerLogin');
var ControllerProceso = require('./controladores/controllerProceso');
var ControllerLote = require('./controladores/controllerLote');
var ControllerRegion = require('./controladores/controllerRegion');
var ControllerComuna = require('./controladores/controllerComuna');
// var ControllerTipoMuestreo = require('./controladores/controllerTipoMuestreo');
var ControllerTipoAnalisis = require('./controladores/controllerTipoAnalisis');
var ControllerTipoEnvase = require('./controladores/controllerTipoEnvase');
var ControllerEnvase = require('./controladores/controllerEnvase');
var ControllerContador = require('./controladores/controllerContador');
var ControllerAviso = require('./controladores/controllerAviso');
var ControllerWorkFlow = require('./controladores/controllerWorkFlow');
var ControllerPasoWf = require('./controladores/controllerPasoWf');
var ControllerObservacion = require('./controladores/controllerObservacion');
var ControllerSello = require('./controladores/controllerSello');
var ControllerLotesUsuario = require('./controladores/controllerLotesUsuario');
var ControllerSolicitudDespacho = require('./controladores/controllerSolicitudDespacho');
var ControllerArchivos = require('./controladores/controllerArchivos');
var ControllerSeleccionMuestreo = require('./controladores/controllerSeleccionMuestreo');
var ControllerDashboard = require('./controladores/controllerDashboard');
var ControllerNCH409 = require('./controladores/controllerAnalisisNCH409');
var ControllerNCH1333 = require('./controladores/controllerAnalisisNCH1333');
var ControllerMicrobiologicoAgua = require('./controladores/controllerMicrobiologicoAgua');

module.exports = function(app) {


	//Metodos para listar sub tipos de analisis de agua
	//-----------------------------------------------------------------------------------------------------------------//
	app.get('/api/microAgua', ControllerMicrobiologicoAgua.listarMicrobiologicoAgua);
	app.get('/api/traerNCH409', ControllerNCH409.listarNCH409);
	app.get('/api/traerNCH1333', ControllerNCH1333.listarNCH1333);
	//-----------------------------------------------------------------------------------------------------------------//



	//Metodos Mejora Administradores por tipo (Animal Food)
	//-----------------------------------------------------------------------------------------------------------------//
	app.post('/api/modificaLoteCompleto', ControllerSolicitud.modificaLoteCompleto);
	app.get('/api/solicitudesAdminAnimal', ControllerSolicitud.traerSolicitudesFiltroTipoAnimal);
	app.get('/api/solicitudesAdminFood', ControllerSolicitud.traerSolicitudesFiltroTipoFood);
	app.get('/api/OTAdminAnimal', ControllerSolicitud.traerOTFiltroTipoAnimal);
	app.get('/api/OTAdminFood', ControllerSolicitud.traerOTFiltroTipoFood);
	app.post('/api/setearAceptacion', ControllerSolicitud.modificaLoteUnicoAceptacion);
	app.post('/api/setearListoTransporte', ControllerSolicitud.modificaLoteUnicoListoTransporte);
	app.post('/api/setearDespacho', ControllerSolicitud.modificaLoteUnicoDespacho);
	app.post('/api/setearRecepcion', ControllerSolicitud.modificaLoteUnicoRecepcion);
	app.post('/api/setearFinalizado', ControllerSolicitud.modificaLoteUnicoFinalizado);
	app.get('/api/inspectoresAnimal', ControllerUsuario.TraerInspectorFiltroAnimal);
	app.get('/api/inspectoresFood', ControllerUsuario.TraerInspectorFiltroFood);
	//-----------------------------------------------------------------------------------------------------------------//


	//Metodos dashboard
	//-----------------------------------------------------------------------------------------------------------------//
	app.get('/api/solicitudesDashboard', ControllerDashboard.trarSolicitudesDashboard);
	app.post('/api/solicitudesDashboard', ControllerDashboard.trarSolicitudesDashboardCliente);
	//-----------------------------------------------------------------------------------------------------------------//



	//Route SeleccionMuestreo
	//-----------------------------------------------------------------------------------------------------------------//
	app.get('/api/seleccionMuestreo', ControllerSeleccionMuestreo.listarSeleccion);
	//-----------------------------------------------------------------------------------------------------------------//


	//Routes Tipos De Analisis
	//-----------------------------------------------------------------------------------------------------------------//
	app.get('/api/listarTipoMuestreo', ControllerTipoAnalisis.listarTipoMuestreo);
	app.get('/api/listarTipoAnalisis/:id_tipoMuestreo', ControllerTipoAnalisis.listarTipoAnalisis);
	app.get('/api/listarSubAnalisis/:id_tipoAnalisis', ControllerTipoAnalisis.listarSubAnalisis);
	app.get('/api/listarAlimentosRsa', ControllerTipoAnalisis.listarAlimentosRsa);
	app.get('/api/listarSubAlimentoRsa/:id_tipoAlimento', ControllerTipoAnalisis.listarSubAlimentoRsa);
	app.get('/api/listarAnalisisSubAlimento/:id_subAlimento', ControllerTipoAnalisis.listarAnalisisSubAlimento);
	app.get('/api/listarConserva', ControllerTipoAnalisis.listarConserva);
	//-----------------------------------------------------------------------------------------------------------------//


	//Route Solicitud Despacho
	//----------------------------------------------------------------------------------//
	app.post('/api/solicitudDespacho', ControllerSolicitudDespacho.crearSolicitudDespacho);
	app.post('/api/asignaInpectorSD', ControllerSolicitudDespacho.asignaInpector);
	app.post('/api/asignaTranporte', ControllerSolicitudDespacho.asignaTransporte);
	app.post('/api/asignaTermino', ControllerSolicitudDespacho.asignaTermino);
	app.post('/api/asignaTerminoFalse', ControllerSolicitudDespacho.asignaTerminoFalse);
	app.post('/api/entregar', ControllerSolicitudDespacho.entregar);
	app.get('/api/listarSD', ControllerSolicitudDespacho.traerSolicitudesDespacho);
	app.get('/api/SDUnica/:id_solicitud_despacho', ControllerSolicitudDespacho.traerSDUnica);
	app.post('/api/actualizarSD', ControllerSolicitudDespacho.actualizarSD);
	app.get('/api/listarSDFiltro/:id_cliente', ControllerSolicitudDespacho.traerSolicitudesDespachoFiltro);
	app.get('/api/listarSDFiltroInspector/:id_inspector', ControllerSolicitudDespacho.traerSolicitudesDespachoFiltroInspector);
	app.post('/api/fin', ControllerSolicitudDespacho.finalizarProceso);
	//----------------------------------------------------------------------------------//

	//Routes LotesUsuarios
	//---------------------------------------------------------------------------------//
	app.post('/api/lotesUsuario', ControllerLotesUsuario.crearLoteUsuario);
	app.post('/api/modificaLotesUsuario', ControllerLotesUsuario.modificaLoteUsuario);
	app.get('/api/traerLotesUsuarios/:id_usuario', ControllerLotesUsuario.listarLoteUsuario);
	//---------------------------------------------------------------------------------//



	//Routes Sellos
	//---------------------------------------------------------------------------------//
	app.post('/api/sellos' , ControllerSello.crearSellos);
	app.post('/api/sellosUsuario' , ControllerSello.modificaSelloUsuario);
	app.post('/api/sellosBaja' , ControllerSello.modificaSelloBaja);
	app.post('/api/sellosBajaUsuario' , ControllerSello.modificaSelloBajaUsuario);
	app.post('/api/sellosUsado' , ControllerSello.modificaSelloUsado);
	app.get('/api/traerSellos', ControllerSello.listarSellos);
	app.get('/api/traerSellosFiltro/:id_usuario', ControllerSello.listarSellosFiltro);
	app.get('/api/traerSellosBaja', ControllerSello.listarSellosBaja);
	app.get('/api/traerSellosUsados/:id_usuario', ControllerSello.listarSellosUsados);
	app.post('/api/modificarSellosInspector/:id_usuario', ControllerSello.modificarSellosInspector);

	//---------------------------------------------------------------------------------//



	//Routes paso Workflow y Workflow
	//---------------------------------------------------------------------------------//
	app.post('/api/workFlow' , ControllerWorkFlow.crearWorkFlow);
	app.get('/api/workFlow/:id_perfil' , ControllerWorkFlow.listarWorkFlow);
	//---------------------------------------------------------------------------------//
	app.post('/api/paso', ControllerPasoWf.crearPasoWf);
	app.get('/api/paso', ControllerPasoWf.listarPasoWf);
	app.delete('/api/paso/:id', ControllerPasoWf.eliminaPasoWf);
	app.put('/api/paso/:id', ControllerPasoWf.modificaPasoWf);
	//---------------------------------------------------------------------------------//

	//route observaciones
	//---------------------------------------------------------------------------------//
	app.post('/api/observacion', ControllerObservacion.crearObservacion);
	app.get('/api/listarObservacion', ControllerObservacion.listarObservacionFiltro);
	app.post('/api/agregarObservacion', ControllerObservacion.agregarObservacion);
	app.post('/api/traerObservacion', ControllerObservacion.traerObservacion);
	app.post('/api/actualizarObservacion', ControllerObservacion.actualizarObservacion)
	//---------------------------------------------------------------------------------//

	//route validarCredenciales
	//---------------------------------------------------------------------------------//
	app.post('/api/validarUsuario', ControllerLogin.validarCredenciales);
	//---------------------------------------------------------------------------------//

	//route Contadores
	//---------------------------------------------------------------------------------//
	app.post('/api/contador', ControllerContador.modificaContador);
	app.post('/api/contador2', ControllerContador.modificaContadorMultiple);
	app.post('/api/contadorDespacho', ControllerContador.crearContadorDespacho);
	//---------------------------------------------------------------------------------//

	//route avisos
	//---------------------------------------------------------------------------------//
	app.post('/api/avisos', ControllerAviso.crearAvisos);
	app.get('/api/avisos/:id_usuario', ControllerAviso.listarAvisosFiltro);
	//---------------------------------------------------------------------------------//

	//route solicitud
	//---------------------------------------------------------------------------------//
	app.get('/api/solicitudClienteLote/:id_usuario', ControllerSolicitud.traerSolicitudesClienteLote);
	app.post('/api/solicitud', ControllerSolicitud.crearSolicitud);
	app.post('/api/procesos', ControllerSolicitud.modificaProceso);
	app.get('/api/solicitud/:id_usuario', ControllerSolicitud.traerSolicitudesFiltro);
	app.get('/api/solicitud', ControllerSolicitud.traerSolicitudes);
	app.get('/api/noasignada', ControllerSolicitud.traerSolicitudesSinOT);
	app.get('/api/asignada', ControllerSolicitud.traerSolicitudesOT);
	app.get('/api/filtro/:id_proceso', ControllerSolicitud.filtroListarAdministrador);
	app.get('/api/solicitudUnica/:id_solicitud', ControllerSolicitud.traerSolicitud);
	app.get('/api/solicitudLaboratorio/:id_usuario', ControllerSolicitud.traerSolicitudesFiltroLab);
	app.post('/api/filtro/:id_proceso', ControllerSolicitud.filtroListar);
	app.delete('/api/solicitud/:id_solicitud', ControllerSolicitud.eliminaSolicitudSinCliente);
	app.put('/api/solicitud/:id_solicitud', ControllerSolicitud.modificaSolicitud);
	app.put('/api/solicitudArchivo/:id_solicitud', ControllerSolicitud.modificaSolicitudArchivo);
	app.put('/api/solicitudLab/:id_solicitud', ControllerSolicitud.modificaSolicitudLab);
	app.put('/api/solicitudCliente/:id_solicitud', ControllerSolicitud.modificarFechaSolicitud);
	app.put('/api/solicitudMensaje/:id_solicitud', ControllerSolicitud.modificaMensajesSolicitud);
	app.put('/api/solicitudEvidencia/:id_solicitud', ControllerSolicitud.modificaSolicitudEvidencia);
	app.put('/api/solicitudCertificado/:id_solicitud', ControllerSolicitud.modificaSolicitudCertificado);
	app.put('/api/solicitudEncargado/:id_solicitud', ControllerSolicitud.modificaSolicitudEncargado);
	app.post('/api/solicitud/:id_solicitud', ControllerSolicitud.eliminaSolicitud);
	app.post('/api/eliminarPdf', ControllerSolicitud.eliminaPdfSolicitud);
	app.post('/api/aprobarTodosLote/:id_solicitud', ControllerSolicitud.aprobarLotes);
	//---------------------------------------------------------------------------------//

	//route Inspector
	//---------------------------------------------------------------------------------//
	app.get('/api/inspector/:id_usuario', ControllerSolicitud.traerSolicitudesFiltroInspector);
	app.get('/api/laboratorio', ControllerSolicitud.traerSolicitudesFiltroLaboratorio);
	//---------------------------------------------------------------------------------//

	//route Llaves.
	//---------------------------------------------------------------------------------//
	app.get('/api/llaves', ControllerLlave.traerLlaves);
	app.get('/api/llaves/:id_llave', ControllerLlave.traerLlave);
	//---------------------------------------------------------------------------------//


	//route Perfil.
	//---------------------------------------------------------------------------------//
	app.post('/api/perfiles', ControllerPerfil.crearPerfil);
	app.get('/api/perfiles', ControllerPerfil.traerPerfiles);
	app.get('/api/perfiles/:id_perfil', ControllerPerfil.traerPerfil);
	app.delete('/api/perfiles/:id_perfil', ControllerPerfil.eliminarPerfil);
	app.put('/api/perfiles/:id', ControllerPerfil.actualizarPerfil);
	//---------------------------------------------------------------------------------//


	//route Usuario.
	//---------------------------------------------------------------------------------//
	app.get('/api/traerUsuariosAnimal', ControllerUsuario.TraerUsuariosFiltroAnimal);
	app.post('/api/usuarios', ControllerUsuario.crearUsuario);
	app.get('/api/usuarios', ControllerUsuario.TraerUsuarios);
	app.get('/api/usuarioId/:id_usuario', ControllerUsuario.TraerUsuarioId);
	app.get('/api/usuarios/:id_perfil', ControllerUsuario.TraerUsuariosFiltro);
	app.get('/api/usuariosUsername/:username', ControllerUsuario.TraerUsuarioUsername);
	app.get('/api/traders', ControllerUsuario.TraerTraders);
	app.delete('/api/usuarios/:id_usuario', ControllerUsuario.eliminarUsuario);
	app.put('/api/usuarios/:id', ControllerUsuario.actualizarUsuario);
	//---------------------------------------------------------------------------------//


	//route Trader
	//---------------------------------------------------------------------------------//
	app.post('/api/trader', ControllerTrader.crearTrader);
	app.get('/api/trader', ControllerTrader.listarTraders);
	app.post('/api/eliminaTrader', ControllerTrader.eliminaTrader);
	app.post('/api/modificaTrader', ControllerTrader.modificaTrader);
	//---------------------------------------------------------------------------------//


	//route Tipo Envases
	//-------------------------------------------------------------------------//
	app.post('/api/tipoEnvase', ControllerTipoEnvase.crearTipoEnvase);
	app.get('/api/tipoEnvase', ControllerTipoEnvase.listarTipoEnvase);
	app.delete('/api/tipoEnvase/:id_tipoEnvase', ControllerTipoEnvase.eliminaTipoEnvase);
	app.put('/api/tipoEnvase/:id_tipoEnvase', ControllerTipoEnvase.modificaTipoEnvase);
	//-------------------------------------------------------------------------//


	//route envase
	//-------------------------------------------------------------------------//
	app.post('/api/envase', ControllerEnvase.crearEnvase);
	app.get('/api/envase', ControllerEnvase.listarEnvase);
	app.get('/api/envase/:id_tipoEnvase', ControllerEnvase.listarEnvaseFiltro);
	app.delete('/api/envase/:id_envase', ControllerEnvase.eliminaEnvase);
	app.put('/api/envase/:id_envase', ControllerEnvase.modificaEnvase);
	//-------------------------------------------------------------------------//


	//route Tipo muestreo
	//-------------------------------------------------------------------------//
	// app.post('/api/tipoMuestreo', ControllerTipoMuestreo.crearTipoMuestreo);
	// app.get('/api/tipoMuestreo', ControllerTipoMuestreo.listarTipoMuestreo);
	// app.delete('/api/tipoMuestreo/:id_tipoMuestreo', ControllerTipoMuestreo.eliminaTipoMuestreo);
	// app.put('/api/tipoMuestreo/:id_tipoMuestreo', ControllerTipoMuestreo.modificaTipoMuestreo);
	//-------------------------------------------------------------------------//


	//route Tipo Analisis
	//-------------------------------------------------------------------------//
	// app.post('/api/tipoAnalisis', ControllerTipoAnalisis.crearTipoAnalisis);
	// app.get('/api/tipoAnalisis', ControllerTipoAnalisis.listarTipoAnalisis);
	// app.delete('/api/tipoAnalisis/:id_tipoAnalisis', ControllerTipoAnalisis.eliminaTipoAnalisis);
	// app.put('/api/tipoAnalisis/:id_tipoAnalisis', ControllerTipoAnalisis.modificaTipoAnalisis);
	//-------------------------------------------------------------------------//


	//route Pais
	//---------------------------------------------------------------------------------//
	app.post('/api/pais', ControllerPais.crearPais);
	app.get('/api/pais', ControllerPais.listarPaises);
	app.delete('/api/pais/:id_pais', ControllerPais.eliminaPais);
	app.put('/api/pais/:id_pais', ControllerPais.modificaPais);
	//---------------------------------------------------------------------------------//


	//route materiaPrima
	//---------------------------------------------------------------------------------------------//
	app.post('/api/materiaPrima', ControllerMateriaPrima.crearMateriaPrima);
	app.get('/api/materiaPrima/:id_materia', ControllerMateriaPrima.listarMateriaPrima);
	app.post('/api/eliminaMateriaPrima', ControllerMateriaPrima.eliminaMateriaPrima);
	app.post('/api/modificaMateriaPrima', ControllerMateriaPrima.modificaMateriaPrima);
	//---------------------------------------------------------------------------------------------//


	//route Producto
	//---------------------------------------------------------------------------------//
	app.post('/api/producto', ControllerProducto.crearProducto);
	app.get('/api/producto', ControllerProducto.listarProductos);
	app.delete('/api/producto/:id_producto', ControllerProducto.eliminaProducto);
	app.put('/api/producto/:id_producto', ControllerProducto.modificaProducto);
	//---------------------------------------------------------------------------------//


	//route Bodega
	//---------------------------------------------------------------------------------//
	app.post('/api/bodega', ControllerBodega.crearBodega);
	app.get('/api/traerBodega', ControllerBodega.listarBodegas);
	app.post('/api/eliminaBodega/', ControllerBodega.eliminaBodega);
	app.put('/api/bodega/:id_bodega', ControllerBodega.modificaBodega);
	//---------------------------------------------------------------------------------//

	//Route Region
	//---------------------------------------------------------------------------------//
	app.get('/api/region', ControllerRegion.listarRegiones);
	//---------------------------------------------------------------------------------//

	//Route Comuna
	//---------------------------------------------------------------------------------//
	app.get('/api/comuna/:id_region', ControllerComuna.listarComunasFiltro);
	//---------------------------------------------------------------------------------//


	//Route Mail
	//---------------------------------------------------------------------------------//
	app.post('/api/mail', ControllerMail.enviarMail);
	//---------------------------------------------------------------------------------//

	//Route Procesos
	//---------------------------------------------------------------------------------//
	app.get('/api/procesos', ControllerProceso.listarProcesos);
	//---------------------------------------------------------------------------------//

	//Route Lote
	//---------------------------------------------------------------------------------//
	app.post('/api/lote', ControllerLote.eliminarLoteSolicitud);
	app.post('/api/loteSellos', ControllerLote.LoteSellos);
	app.post('/api/loteLaboratorio', ControllerLote.laboratorioLoteSolicitud);
	app.post('/api/loteDocumento', ControllerLote.laboratorioLoteDocumento);
	app.post('/api/loteCertificado', ControllerLote.laboratorioLoteCertificado);
	// app.put('/api/lote/:id_solicitud', ControllerLote.actualizarLoteSolicitud);
	app.post('/api/inspectorLote', ControllerLote.InspectorLote);
	app.put('/api/modificarLotes/:id_solicitud', ControllerLote.modificarLotes);
	//---------------------------------------------------------------------------------//

	// Route Archivos
	app.post('/archivoExcel', ControllerArchivos.AgregarLotesUpload);
	app.get('/api/traerExcel/:nombre_archivo', ControllerArchivos.traerLotesExcel);
	//---------------------------------------------------------------------------------//

	// Route materia Prima
	app.get('/api/materiaPrima:materiaPrima', ControllerMateriaPrima.buscarNombreMateriaPrima);

};
