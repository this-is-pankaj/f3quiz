const roomsManager = require('./rooms.component'),
  methods  = {};
methods.generateParticipant = (userInfo, gameId, roomId, uid)=>{
  let participant = {
    "name": userInfo.name,
    "phone": userInfo.phone,
    "email": userInfo.email,
    "points": 0,
    "attemptedQues": [],
    "uid": uid,
    "isConnected": true
  };
  // Add the participant to the game in the background.
  roomsManager.addParticipantToGame(userInfo, gameId, roomId)
    .then((doc)=>{
      console.log(`Participant  added to  the Game ${gameId}`);
    })
    .catch((err)=>{
      console.log(`Failed to update DB with the participant in game ${gameId}. Reason ${err}`);
    })
  return participant;
}

module.exports = methods;