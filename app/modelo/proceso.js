var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var ProcesoSchema = new Schema({

  id_proceso: Number,
  descripcion: String,
  color: String,
  icono: String,
  visible: Boolean

});

module.exports = mongoose.model('Proceso', ProcesoSchema, 'procesos');
