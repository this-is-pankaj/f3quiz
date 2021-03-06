const LOG = require('../../utils/logger'),
  component = 'gameplay.rooms',
  RoomSchema = require('../../models/room.model');

const methods = {};

let getActiveGame  = (room)=>{
  let games  = room.games;
  let activeGame = games.filter((game)=>{
    return game.isActive;
  })

  if(activeGame && activeGame.length) {
    return activeGame;
  }
  return false;
}

let addNewGame = (room, adminId) => {
  let gamesDefaultObj  = {
    participants: [],
    createdBy: adminId,
    isActive: true,
    allowNewJoins: true
  };

  room.games.push(gamesDefaultObj);
  room.modifiedAt = new Date();
  room.modifiedBy = adminId;
}

let findRoomId = (roomId)=>{
  return new Promise((resolve, reject)=>{
    try{
      let q =  {
        _id : roomId
      };

      RoomSchema.findOne(q)
        .then((doc)=>{
          resolve(doc);
        })
        .catch((err)=>{
          reject(err);
        })
    }
    catch(exc){
      reject(exc);
    }
  })
}

methods.createGameInRoom = (id, adminId) => {
  return new Promise((resolve, reject)=>{
    try{
      let q =  {
        _id : id
      };
        
      RoomSchema.findOne(q).exec(function(err, doc){
        console.log(doc);
        let activeGame = getActiveGame(doc);
        if(activeGame) {
          resolve(doc);
        }
        else{
          addNewGame(doc, adminId);
          doc.save()
            .then((data)=>{
              resolve(data);
            })
            .catch((err)=>{
              reject(err);
            })
        }
      })
    }
    catch(exc){
      reject(exc);
    }
  })
}


methods.addParticipantToGame = (participant, gameId, roomId)=>{
  return new Promise((resolve, reject)=>{
    try{
      // Find the Room
      findRoomId(roomId)
        .then((doc)=>{
          //  Find the Game and chec if its active
          let games = doc.games;
          let game = games.filter((g)=>{
            return (g._id.toString() ==  gameId) && g.isActive;
          });
          // Add the participant to the list
          if(game && game.length) {
            if(game[0].allowNewJoins) {
              let alreadyAdded = game[0].participants.filter((p)=>{
                return p._id.toString() == participant._id.toString();
              });
              // Add the  participant only if he wasnt added already.
              if(!alreadyAdded || !alreadyAdded.length) {
                game[0].participants.push(participant);
              }
              else{
                reject('Participant was existing already.')
              }
            }
            else{
              reject('No More Joinees  allowed ')
            }
          }
          doc.save()
            .then((data)=>{
              resolve(data);
            })
            .catch((err)=>{
              reject(err);
            })
        })
    }
    catch(exc){
      reject(exc);
    }
  })
};

methods.closeAccessForNewJoinees = (roomId, gameId)=> {
  return new Promise((resolve, reject)=>{
    try {
      findRoomId(roomId)
        .then((doc)=>{
          //  Find the Game and change the status of allowNewJoins to false
          let games = doc.games;
          let game = games.filter((g)=>{
            return (g._id.toString() ==  gameId);
          });
          // Add the participant to the list
          if(game && game.length) {
            game[0].allowNewJoins = false;
          }
          doc.save()
            .then((data)=>{
              resolve(data);
            })
            .catch((err)=>{
              reject(err);
            })
        })
    }
    catch(exc) {
      reject(exc);
    }
  })
}

methods.endGame = (roomId, gameId)=>{
  return new Promise((resolve, reject)=>{
    try{
      // Find the Room
      findRoomId(roomId)
        .then((doc)=>{
          //  Find the Game and chec if its active
          let games = doc.games;
          let game = games.filter((g)=>{
            return (g._id.toString() ==  gameId);
          });
          console.log(gameId);
          console.log(games);
          // Add the participant to the list
          if(game && game.length) {
            game[0].isActive = false;
            game[0].allowNewJoins = false;
          }
          doc.save()
            .then((data)=>{
              resolve(data);
            })
            .catch((err)=>{
              reject(err);
            })
        })
    }
    catch(exc){
      reject(exc);
    }
  })
}

methods.udpateRoundInfo = (roomId, gameId, info)=>{
  return new Promise((resolve, reject)=>{
    try{
      findRoomId(roomId)
        .then((doc)=>{
          //  Find the Game and chec if its active
          let games = doc.games;
          let game = games.filter((g)=>{
            return (g._id.toString() ==  gameId);
          });
          // Add the participant to the list
          if(game && game.length) {
            game[0].isActive = true;
            game[0].allowNewJoins = false;
            // update participants array.
            for(let p=0;p<game[0].participants.length; p++){
              console.log("points", game[0].participants[p].points);
              console.log("id", game[0].participants[p]._id.toString(), info);

              game[0].participants[p].points=info[game[0].participants[p]._id.toString()] || game[0].participants[p].points;
            }
          }
          doc.save()
            .then((data)=>{
              resolve(data);
            })
            .catch((err)=>{
              reject(err);
            })
        })
        .catch((err)=>{
          reject(err);
        })
    }
    catch(exc){
      reject(exc);
    }
  })
}
module.exports  = methods;
