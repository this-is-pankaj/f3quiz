'use strict';
const mongoose = require('mongoose'),
  Rooms = require('./components/rooms.component'),
  Users = require('./components/users.component');

class Game {
  constructor(details) {
    this.initiator = details.userId;
    this.roomId = details.roomId;
    this.createdAt = new Date();
    this.reqId = this.roomId;
  }

  init() {
    return new Promise((resolve, reject)=>{
      Promise.all([this.getAdminDetails(), this.addGameToRoom()])
        .then((res)=>{
          this.admin = res[0];
          this.roomDetails = res[1];
          this.gameId = this.roomDetails.games[this.roomDetails.games.length - 1]._id.toString();
          resolve(true);
        })
        .catch((err)=>{
          console.log(`Promises not resolved ${err}`);
          reject(err)
        })
    })
  }

  addGameToRoom() {
    return new Promise((resolve, reject)=>{
      try{
        Rooms.createGameInRoom(this.roomId, this.initiator)
          .then((data)=>{
            resolve((data))
          })
          .catch((err)=>{
            reject(err);
          })
      }
      catch(exc) {
        console.log(exc);
        reject(exc);
      }
    })
  }

  getAdminDetails() {
    return new Promise((resolve, reject)=>{
      try{
        Users.getUserInfo(this.initiator)
          .then((data)=>{
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      }
      catch(exc) {
        reject(exc);
      }
    })
  }
}

module.exports = Game;