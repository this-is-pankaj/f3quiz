const participantSchema = require('./participant.model');

const GameSchema = {
  "participants": [participantSchema],
  "isActive": {
    type: Boolean,
    default: true
  },
  "allowNewJoins": {
    type: Boolean,
    default: true
  },
  "isLocked": {
    type: Boolean,
    default: false
  },
  "password": {
    type: String
  },
  "createdBy": {
    type: String,
    default: 'admin'  // empid of creator
  },
  "createdAt": {
    type: Date,
    default: Date.now
  }
};

module.exports = GameSchema;