var Producto = require('../modelo/producto');

//Metodo que guarda en base de datos los traders.
//----------------------------------------------------------------------------------//
exports.crearProducto = function(req, resp){
    var nombreProducto = req.body.nombreProducto;
    Producto.find(function(err, producto){
      if (producto === null) {
          var id_producto = 1;
      }else {
            var id_producto = producto.length + 1;
      }
      Producto.create({id_producto: id_producto, nombreProducto: nombreProducto}, function(err, resp){
        if (err) {
        }else{
        }
      });
    });
}
//----------------------------------------------------------------------------------//


//Metodo que trae de base de datostodos los traders.
//----------------------------------------------------------------------------------//
exports.listarProductos = function(req, resp){
  Producto.find(function(err, productos){
    if (productos === null) {
        resp.send(null);
    }else{
      resp.send(productos);
    }
  })
}
//----------------------------------------------------------------------------------//


//Metodo para eliminar un trader.
//----------------------------------------------------------------------------------//
exports.eliminaProducto = function(req, resp){
  Producto.remove({id_producto: req.params.id_producto},function(err, respuesta){
      if (err !== null) {
            if (err !== null) {
            }
          }
  });
}
//----------------------------------------------------------------------------------//


// Modificamos un objeto trader
//----------------------------------------------------------------------------------//
exports.modificaProducto = function(req, res){
	Producto.update( {id_producto: req.params.id_producto},
					{$set:{nombreProducto : req.body.nombreProducto}},
					function(err, pais) {
						if (err)
							res.send(err);
			});
	}
//----------------------------------------------------------------------------------//
