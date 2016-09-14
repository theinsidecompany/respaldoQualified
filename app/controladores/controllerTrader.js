var Trader = require('../modelo/trader');

//Metodo que guarda en base de datos los traders.
//----------------------------------------------------------------------------------//
exports.crearTrader = function(req, resp){
  var nombreTrader = req.body.nombreTrader;
  Trader.find(function(err, trader){
    if (trader.length === 0) {
      var id_trader = 1;
    }else {
      for (var i = 0; i < trader.length; i++) {
        var id_trader = trader[i].id_trader + 1;
      }
    }

    Trader.find({'nombreTrader': nombreTrader},function(err, resultado){
      if (resultado[0] === undefined) {
        var nuevo = {'id_trader': id_trader, 'nombreTrader': nombreTrader};
        Trader.create(nuevo, function(err, respuesta){
          if (respuesta !== null) {
            Trader.find(function(err, traders){
              if (traders === null) {
                resp.send(null);
              }else{
                resp.send(traders);
              }
            })
          }
        });
      }else {
        resp.send('1');
      }
    })
  });
}
//----------------------------------------------------------------------------------//


//Metodo que trae de base de datostodos los traders.
//----------------------------------------------------------------------------------//
exports.listarTraders = function(req, resp){
  Trader.find(function(err, traders){
    if (traders === null) {
      resp.send(null);
    }else{
      resp.send(traders);
    }
  })
}
//----------------------------------------------------------------------------------//


//Metodo para eliminar un trader.
//----------------------------------------------------------------------------------//
exports.eliminaTrader = function(req, resp){
  var id_trader = req.body.id_trader;
  Trader.remove({'id_trader': id_trader},function(err, respuesta){
    if (respuesta === null) {
      resp.send(null);
    }else{
      Trader.find(function(err, traders){
        if (traders === null) {
          resp.send(null);
        }else{
          resp.send(traders);
        }
      })
    }
  });
}
//----------------------------------------------------------------------------------//


// Modificamos un objeto trader
//----------------------------------------------------------------------------------//
exports.modificaTrader = function(req, resp){
  var id_trader = req.body.id_trader;
  var nombreTrader = req.body.nombreTrader;

  Trader.find({'nombreTrader': nombreTrader},function(err, respuesta){
    if (respuesta[0] === undefined) {
      Trader.update({'id_trader': id_trader}, {$set:{'nombreTrader' : nombreTrader}},
        function(err, trader) {
          if (trader === null) {
            resp.send(null);
          }else{
            Trader.find(function(err, traders){
              if (traders === null) {
                resp.send(null);
              }else{
                resp.send(traders);
              }
            })
          }
        });
      }else {
        resp.send('1');
      }
    })
  }
  //----------------------------------------------------------------------------------//
