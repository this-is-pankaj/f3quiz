const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  auditSchema = require('./components/audit.model'),
  gameSchema = require('./components/game.model');

let RoomSchema = {
  "name": {
    type: String,
    required: true,
    unique: true
  },
  "games": [gameSchema],
  "isActive": {
    type: Boolean,
    required: true,
    default: true
  },
  "owner": {
    type: String,
    required: true
  }
};

RoomSchema = Object.assign(RoomSchema, auditSchema);

module.exports = mongoose.model('rooms', new Schema(RoomSchema));