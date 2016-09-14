var Contador = require('../modelo/contador');

exports.modificaContador = function(req, resp){
  Contador.find({'id': req.body.id_solicitud},function(err, contadores){

    if (contadores !== null){
      var cont = contadores[0].id;
      var num1 = contadores[0].seq + 1;
      Contador.update( {id: cont}, {$set:{id: cont , seq : num1 }}, function(err, conter) {

        Contador.find({'id_cliente': req.body.id_cliente},function(err, contadorCliente){
          if (contadorCliente[0]=== undefined) {
            var nuevo = {id: 'cliente', id_cliente: req.body.id_cliente , seq: 1};

            Contador.create(nuevo, function(err, respuesta){
                if (respuesta !== null){
                  var envio = {id_solicitud: num1, id_solicitud_cliente: nuevo.seq};
                  resp.send(envio);
                }
              });
          }else{
            var cont = contadorCliente[0].id_cliente;
            var num2 = contadorCliente[0].seq + 1;
            Contador.update( {id_cliente: cont},
                    {$set:{id_cliente: cont , seq : num2 }},
                    function(err, conter2) {
                      var envio = {id_solicitud: num1, id_solicitud_cliente: num2};
                      resp.send(envio);
                });
              }
            });
      });
    }
  });
	}


  exports.modificaContadorMultiple = function(req, resp){
    Contador.find({'id': req.body.id},function(err, contadores){

      if (contadores !== null){
        var cont = contadores[0].id;
        var num1 = contadores[0].seq + 1;
        Contador.update( {id: cont}, {$set:{id: cont , seq : num1 }}, function(err, conter) {
            var envio = {id: cont, seq: num1};
            resp.send(envio);
    })
  }
  })
}


exports.crearContadorDespacho = function(req, resp){

   Contador.find({'id': 'solicitud_despacho'},function(err, contadores){

     if (contadores !== null){

       var cont = contadores[0].id;
       var num1 = contadores[0].seq + 1;
       Contador.update( {id: cont}, {$set:{id: cont , seq : num1 }}, function(err, conter) {

         Contador.find({'id_cliente': req.body.id_cliente},function(err, contadorCliente){

            if (contadorCliente[0]=== undefined) {

               var nuevo = {id: 'cliente', id_cliente: req.body.id_cliente , seq: 1};

               Contador.create(nuevo, function(err, respuesta){

                 if (respuesta !== null){
                   var envio = {id_solicitud_despacho: num1, id_solicitud_despacho_cliente: nuevo.seq};
                   resp.send(envio);
                 }

               });

            }else{

              var cont = contadorCliente[0].id_cliente;
              var num2 = contadorCliente[0].seq + 1;
              Contador.update( {id_cliente: cont}, {$set:{id_cliente: cont , seq : num2 }},  function(err, conter2){

                var envio = {id_solicitud_despacho: num1, id_solicitud_despacho_cliente: num2};
                resp.send(envio);

              });

            }

         });

       });

     }

   });
}
