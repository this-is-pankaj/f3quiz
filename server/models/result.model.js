const mongoose =  require('mongoose'),
  Schema = mongoose.Schema;

const ResultSchema = new  Schema({
  "gameId": {
    type: String,
    required:  true
  },
  "result": []
});

module.exports = mongoose.model('results', ResultSchema);