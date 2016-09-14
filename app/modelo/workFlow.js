var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var workFlowSchema = new Schema({

  id_perfil: Number,
  workFlow:[{
  paso_actual: Number,
  id_paso: Number,
  check: Boolean
  }]

});

module.exports = mongoose.model('WorkFlow', workFlowSchema, 'workFlows');
