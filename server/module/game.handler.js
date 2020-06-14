const appStatic = require('./utils/appstatic.constant'),
  utils = require('./utils/utils'),
  getQuestion = require('./components/getQuestion.component'),
  Game = require('./Game.class'),
  LOG =  require('../utils/logger'),
  User  = require('./components/users.component'),
  participantHandler = require('./components/participants.component'),
  roomHandler = require('./components/rooms.component'),
  component = 'game.handler';

const gameStats = {};
// gameStats[appStatic.defaultRoom] = {
//   status: 1,  //0: ended,  1:started
//   qBank: {

//   }
// }

let createParticpantObject  =  (list)=>{
  let obj = {};
  for(let i=0; i< list.length;i++) {
    if(list[i]._id) {
      obj[list[i]._id] = list[i];
    }
  }
  return obj;
}
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
        currentQues: {  // Hold the details of the ongoing question and options
          num: 0,
          question: {
            text: '',
            submittedBy: '',
            level: 0
          },
          options: [],
          answers: {},
          reference: '', // Reference URL for the  answer
          displayedOptions: [],  // Options sent to be displayed in shuffled order.
          timer: 30,
          startTime: '', // Time when the options were  posted.
          roundResult: [] // result of this  round.
        },
        participants: createParticpantObject(currentGameInfo.participants), //  List of participants  alongwith their socket details
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
};

methods.getGameInfo = (roomId)=>{
  return  gameStats[roomId];
}

methods.getParticipants = (roomId)=>{
  let gameInfo = gameStats[roomId];
  let participants =  [];
  if(gameInfo){
    for(let id in gameInfo.participants) {
      let obj = {
        id: id,
        name: `${gameInfo.participants[id].name.firstName} ${gameInfo.participants[id].name.middleName} ${gameInfo.participants[id].name.lastName}`,
        points: gameInfo.participants[id].points
      }
      participants.push(obj);
    }
  }
  return {
    gameId: gameInfo.gameId,
    participants: participants
  }
}

methods.addParticipant = (info)=>{
  let gameInfo = gameStats[info.roomId];
  return new Promise(async (resolve, reject)=>{
    try{
      // Check if the participant was already playing the game.
      if(gameInfo){
        let participants = gameInfo.participants;
        let alreadyPlaying = participants[info.userId];
        // let alreadyPlaying = participants.filter((player)=>{
        //   return (info.userId  == player._id) && !player.isDropped;
        // });
        if(alreadyPlaying){
          alreadyPlaying.isConnected = true;
          alreadyPlaying.uid = info.uid;
        }
        else{
          // Get the user Details and save it in the list
          let userDetails = await User.getUserInfo(info.userId)
            .catch((err)=>{
              reject(err);
            });

          if(userDetails) {
            participants[info.userId] = participantHandler.generateParticipant(userDetails, gameInfo.gameId, gameInfo.roomId, info.uid);
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

methods.close = (info) => {
  return new Promise(async(resolve, reject)=>{
    try{
      let gameInfo = gameStats[info.roomId];
      if(gameInfo){
        let endRes = await roomHandler.endGame(info.roomId,gameInfo.gameId)
          .catch((err)=>{
            reject(err);
          })

        if(endRes) {
          gameStats[info.roomId].status =0;
          resolve(gameStats[info.roomId]);
        }
      }
    }
    catch(exc) {
      reject(exc);
    }
  })
}

methods.getStats = (roomId) =>{
  return  gameStats[roomId];
}

methods.getNextQuestion = (roomId) => {
  let gameInfo = gameStats[roomId],
    levels= appStatic.game.levels,
    currQuesNum = gameInfo.currentQues.num;
  // Select the next question to be displayed
  let totalQues = 0;
  for(let lvl in levels) {
    let numOfQuesInThisLvl = levels[lvl].numOfQuestion;
    totalQues += numOfQuesInThisLvl;
    // If questionNum is less than the total so far, it means this level  question needs to be delivered
    if(currQuesNum < totalQues){
      let qListLen = gameInfo.qBank[lvl].qList.length;
      let getQuesIdx  = utils.generateRand(0, qListLen-1);
      let ques = gameInfo.qBank[lvl].qList[getQuesIdx];
      gameInfo.currentQues.num += 1;
      gameInfo.currentQues.id = ques._id;
      gameInfo.currentQues.question = {
        text: ques.question,
        level: ques.level,
        submittedBy: ques.createdBy
      };
      gameInfo.currentQues.options = ques.options;
      gameInfo.currentQues.reference = ques.reference;
      gameInfo.currentQues.roundResult = [];
      gameInfo.currentQues.answers = {};
      break;
    }
  }
  
  return {
    gameId: gameInfo.gameId,
    ques: gameInfo.currentQues
  }
}

methods.getOptions = (roomId)=>{
  let gameInfo = gameStats[roomId];
  if(gameInfo){
    let currQues = gameInfo.currentQues;

    let options = Array.from(currQues.options), // Clone the array
      finalOptions = [];
    if(options.length>4) {
      // Randomly choose 4 options and send them
      for(i=0;i<4;i++) {
        let idx = utils.generateRand(0, (options.length-1));
        if(options[idx]) {
          finalOptions.push(options[idx]);
          options.splice(idx, 1);
        }
      }
    }
    else{
      finalOptions = options;
    }
    finalOptions = shuffleOptions(finalOptions);
    currQues.displayedOptions  = finalOptions;
    currQues.startTime = Date.now();
    return {
      gameId: gameInfo.gameId,
      options: finalOptions,
      timer: appStatic.game.timePerQues
    }
  }
  else{
    return {}
  }
}

let shuffleOptions = (options)=> {
  let shuffled = [],
    numOfOptions = options.length;
  for(let i=0; i<4; i++) {
    let idx = utils.generateRand(0, options.length-1),
      opt = options[idx];
    if(opt) {
      shuffled.push(opt);
      options.splice(idx, 1); // Remove it from the array so that  duplicates are not  produced.
    }
  }
  return shuffled;
}

methods.setTimer = (roomId, time) => {
  let gameInfo = gameStats[roomId];
  if(gameInfo){
    gameInfo.currentQues.timer = time;
  }
}

methods.submitAnswer =  (roomId, userId, answer)  => {
  let gameInfo = gameStats[roomId];
  if(gameInfo && gameInfo.participants[userId]){
    let currQues = gameInfo.currentQues;
    if(!currQues.answers){
      currQues.answers= {};
    }
    if(!currQues.answers[userId]){
      currQues.answers[userId] = {
        answer,
        time: Date.now()
      };
      return true;
    }
    console.log("Already answered once");
  }
  return false;
}

let calculateCorrectOrder = (options, displayedOptions) => {
  let orderedOptions = [];
  let optionsWithValues = options.map((o)=>{
    return o.value;
  });

  let displayedOptionsWithValues = displayedOptions.map((o)=>{
    return o.value;
  });

  for(let i=0; i<optionsWithValues.length; i++) {
    let obj = {
      value: optionsWithValues[i],
      text: options[i].text
    };

    obj.num = displayedOptionsWithValues.indexOf(obj.value);
    // Only if the value existed in the displayed options, push it in the correct answer array.
    if(obj.num>-1){
      orderedOptions.push(obj);
    }
  }
  
  return orderedOptions;
}

methods.getCorrectAnswer = (roomId)=>{
  let gameInfo = gameStats[roomId];
  if(gameInfo){
    let currQues = gameInfo.currentQues;
    let answer = {
      gameId: gameInfo.gameId,
      referenceURL: currQues.reference,
      answer: calculateCorrectOrder(currQues.options, currQues.displayedOptions)
    };
    return answer;
  }
  else{
    return {};
  }
}

let validateAnswer = (correctAns, answered) => {
  let isCorrect = 'incorrect';
  if(answered.length && (correctAns.length === answered.length)) {
    isCorrect = 'correct';
    for(let i=0;i<answered.length; i++) {
      if(answered[i] !== correctAns[i].value){
        isCorrect = 'incorrect';
      }
    }
  }
  return isCorrect;
}

let getUserTimeAndStatus = (gameInfo)=>{
  let list  = [];
  if(gameInfo) {
    let currQues = gameInfo.currentQues,
      correctAns = calculateCorrectOrder(currQues.options, currQues.displayedOptions);
    // loop over all the participants and assign time and answer status to them
    for(let id in gameInfo.participants){
      let  obj = {
        name: `${gameInfo.participants[id].name.firstName} ${gameInfo.participants[id].name.middleName} ${gameInfo.participants[id].name.lastName}`,
        status: 'notAnswered',
        points: gameInfo.participants[id].points,
        id
      }

      if(currQues.answers[id] && currQues.answers[id].answer.length) {
        obj.status = validateAnswer(correctAns, currQues.answers[id].answer);
        obj.time = (currQues.answers[id].time - currQues.startTime)/1000 ;  // Convert time difference to seconds.
      }
      list.push(obj);
    }
    return list;
  }
  else {
    return false;
  }
}

methods.getRoundWinners =  (roomId) => {
  let gameInfo = gameStats[roomId],
    getUserAnsList = getUserTimeAndStatus(gameInfo);
  if(getUserAnsList){
    let finalRes = getFastest(getUserAnsList, gameInfo);
    gameInfo.currentQues.roundResult = finalRes;
    return {gameId: gameInfo.gameId, getUserAnsList: gameInfo.currentQues.roundResult};
  }
  else{
    return {};
  }
}

let getFastest = (roundResult, gameInfo)=>{
  if(roundResult  &&  roundResult.length) {
    // Get list of correct answers
    let correctAnsList = roundResult.filter((r)=>{
      return r.status === 'correct';
    });
    if(correctAnsList && correctAnsList.length)  {
      // Sort the time on the correct answers
      correctAnsList.sort((a,b)=>{
        return  a.time - b.time;
      });

      roundResult = roundResult.map((r)=>{
        if(r.id === correctAnsList[0].id) {
          r.isWinner = true;
        }
        else{
          r.isWinner = false;
        }
        return Object.assign({},r, {points: 0});
      });
    }
    return roundResult;
  }
  return [];
}

let calculatePoints = (qInfo) => {
  let quesIdx = qInfo.currentQues.num,
    players = Object.keys(qInfo.participants),
    answers = Object.keys(qInfo.currentQues.answers),
    numOfWrongAns = 0;
    let numOfPlayers = players.length,
      numOfAnswers = answers.length;

  if(qInfo.roundResult && qInfo.roundResult.length) {
    let wrongAnswers = qInfo.roundResult.filter((r)=>{
      return r.status==='incorrect';
    });
    numOfWrongAns = wrongAnswers.length;
  }
  console.log("scoring  criiteria: ", quesIdx, numOfPlayers, numOfAnswers, numOfWrongAns);
  return quesIdx*100*(numOfPlayers  - numOfAnswers + 1 + (0.5*numOfWrongAns));
}

methods.assignPoints = (roomId)=>{
  let gameInfo  = gameStats[roomId];
  if(gameInfo) {
    // Get the winner id and assign it to the participant object.
    let currQues = gameInfo.currentQues;
    let  winner = currQues.roundResult.find((r)=>{
      return r.isWinner
    });

    if(winner){
      if(!winner.points) {
        winner.points = calculatePoints(gameInfo);
        gameInfo.participants[winner.id].points += winner.points;
      }

      //  Save the round points in the DB for the round ended.
      // let  valuesToBeSaved = {
      //   ques: currQues.question,
      //   answers: currQues.answers,
      //   roundResult
      // };
      let obj = {};
      for(let p in gameInfo.participants) {
        obj[p] = gameInfo.participants[p].points;
      }
      participantHandler.updateParticipantRoundInfo(obj,gameInfo.gameId, roomId);
      return {gameId: gameInfo.gameId, winner: gameInfo.participants[winner.id]};
    }
    return {gameId: gameInfo.gameId, winner: {}}
  }

  return {};
}

module.exports  = methods;