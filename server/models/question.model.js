const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  optionSchema =  require('./components/options.model'),
  auditSchema  = require('./components/audit.model');

let quesSchema = {
  "type": {
    type: String,
    required: true
  },
  "question": {
    type: String,
    required: true
  },
  "options": [optionSchema],
  "level": {
    type: Number,
    required: true
  },
  "category":{
    type: String,
    required: true
  },
  "forGroup": {
    type: String,
    required: true
  }
}

quesSchema = Object.assign({},quesSchema, auditSchema);

const QuesSchema =  new Schema(quesSchema); 

module.exports = mongoose.model('questionBank', QuesSchema);