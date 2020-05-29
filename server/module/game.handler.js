const appStatic = require('./utils/appstatic.constant'),
  getQuestion = require('./components/getQuestion.component'),
  Game = require('./Game.class'),
  LOG =  require('../utils/logger'),
  User  = require('./components/users.component'),
  participantHandler = require('./components/participants.component'),
  component = 'game.handler';

const gameStats = {};
// gameStats[appStatic.defaultRoom] = {
//   status: 1,  //0: ended,  1:started
//   qBank: {

//   }
// }
let initializeRoom  = (game)=>{
  return new Promise(async (resolve, reject)=>{
    try{
      let levels = appStatic.game.levels,
        questionList = [],
        currentGameInfo = game.roomDetails.games[game.roomDetails.games.length -1 ],
        roomId = game.roomId;

      gameStats[game.roomId] = {
        status: 1, //0: ended,  1:started
        roomName: game.roomDetails.name,  // name of the room
        roomId,
        qBank: {  // Question Bank Manager
          // level1: {  // Question  Bank  for level 1
          //   qList: [],  //List  of Level 1 Questions
          //   usedQues: []  //  Questions used in the game  from the list.
          // }  
        },
        participants: currentGameInfo.participants, //  List of participants  alongwith their socket details
        hostedBy: game.admin,  // Admin of the room info
        gameId: currentGameInfo._id,  // ID of the current game
        createdAt: currentGameInfo.createdAt,
        reqId: `${roomId}-${currentGameInfo._id}`
      }
      
      for(let level in levels) {
        let config = {
          roomId,
          level: levels[level].level
        };
        questionList.push(fetchQuestion(config));
      }

      let qList = await Promise.all(questionList)
        .catch((err)=>{
          reject(err);
        })

      if(qList){
        let idx = 0;
        for(let level in levels) {
          gameStats[roomId].qBank[level] = {
            qList: qList[idx],
            usedQues: []
          };
          idx++;
        }
        resolve(gameStats[roomId]);
      }
    }
    catch(exc){
      reject(exc);
    }
  })
}

let fetchQuestion  = (info)=>{
  return new Promise(async (resolve,  reject)=>{
    try{
      let config = {
        level : info.level
      };
      if(info.roomId) {
        config.params = {
          room: info.roomId
        };
      }

      let res = await getQuestion(info)
        .catch((err)=>{
          reject(err);
        });

      if(res) {
        resolve(res);
      }
    }
    catch(exc){
      reject(exc);
    }
  })
}

const methods = {};
methods.start  =  async(info)=>{
  return new Promise(async(resolve, reject)=>{
    // If the room was not existing or the game ended and  we need to restart.
    if(!gameStats[info.roomId] || !gameStats[info.roomId].status){
      let reqId  = info.roomId;
      let game = new Game(info);
      let resp = await game.init()
        .catch((err)=>{
          console.log(err);
          LOG.error(`${component}.start.gameInit`, reqId, err);
          reject(err);
        })
      if(resp) {
        LOG.info(`${component}.start.gameInit`, reqId, game);
        let res = await initializeRoom(game)
          .catch((err)=>{
            console.log(err);
            LOG.error(`${component}.start.initializeRoom`, reqId, err);
            reject(err);
          });

        if(res) {
          LOG.info(`${component}.start.initializeRoom`, reqId, res);
          resolve(res);
        }
      }
    }
    else {
      LOG.alert(`${component}.start`, gameStats[info.roomId].reqId, `A game is already in progress. Can't start a new one.`);
      resolve(gameStats[info.roomId]);
    }
  })
}

methods.addParticipant = (info)=>{
  let gameInfo = gameStats[info.roomId];
  return new Promise(async (resolve, reject)=>{
    try{
      // Check if the participant was already playing the game.
      if(gameInfo){
        let participants = gameInfo.participants;
        let alreadyPlaying = participants.filter((player)=>{
          return (info.userId  == player._id) && !player.isDropped;
        });
        if(alreadyPlaying && alreadyPlaying.length){
          alreadyPlaying[0].isConnected = true;
          alreadyPlaying[0].uid = info.uid;
        }
        else{
          // Get the user Details and save it in the list
          let userDetails = await User.getUserInfo(info.userId)
            .catch((err)=>{
              reject(err);
            });

          if(userDetails) {
            participants.push(participantHandler.generateParticipant(userDetails, gameInfo.gameId, gameInfo.roomId, info.uid));
          }
        }
        resolve(gameInfo);
      }
      else{
        LOG.alert(`${component}.addParticipant`, "testId", `The game is no longer active or has been closed`);
        reject(gameInfo)
      }
    }
    catch(exc) {
      console.log(exc);
      LOG.error(`${component}.addParticipant`, gameInfo.reqId, exc);
      reject(gameInfo)
    }
  })
}

methods.close = (roomId) => {
  gameStats[roomId].status = 0;
  return gameStats[roomId];
}

methods.getStats = (roomId) =>{
  return  gameStats[roomId];
}
module.exports  = methods;