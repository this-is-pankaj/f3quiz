const  nameSchema = require('./name.model');

module.exports = {
  "name": nameSchema,
  "phone": {
    type: String,
    required: true
  },
  "email": {
    type:  String,
    required: true
  },
  "points": {
    type: Number,
    default: 0
  },
  "attemptedQues": [{
    
  }]
}