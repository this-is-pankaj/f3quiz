const handler = require('./game.handler'),
  utils = require('../utils/utils'),
  LOG = require('../utils/logger'),
  Game = require('./Game.class'),
  component = 'gameplay.socket';

let transformInfo = (msg)=>{
  return {
    userId : utils.crypto.decrypt(msg.id),
    roomId : msg.grp,
    role : msg.role
  }
}

module.exports = (app)=>{
  let io = app.get('socketio');

  io.on('connection', (socket)=>{
    let token = socket.handshake.query.token;
    console.log(`${socket.id} connected ${token}`);
    
    // The listener from admin console only. This will start a fresh round.
    socket.on("startRound", async (msg)=>{
      let info = transformInfo(msg);
      let res =  await handler.start(info)
        .catch((err)=>{
          LOG.error(`${component}.startRound`, "testId", err);
          socket.emit('gameCreated', {success: false});
        })

      if(res) {
        LOG.info(`${component}.startRound`, res.reqId, `${res}`);
        socket.join(res.gameId);  // Create a room with the roomId
        res.hostedBy.socketID = socket.id;  // Assign the socket ID to the host object
        socket.emit('gameCreated', {success: true, gameId: res});
        // If there is any question displayed or in progress, share the  details
        if(res.currentQues && res.currentQues.question.text.length) {
          let ques = Object.assign({}, res.currentQues.question, {num: res.currentQues.num});
          socket.emit('question', {success: true, ques: ques});
          // If the options has been displayed show that as well, alongwoth timer
          if(res.currentQues.displayedOptions && res.currentQues.displayedOptions.length){
            socket.emit('options', {success: true, options: res.currentQues.displayedOptions});
            socket.emit('setTimer', {success: true, timer: res.currentQues.timer});
          }
        }
      }
    });

    socket.on('endRound', async(msg)=>{
      let info = transformInfo(msg),
        endGame = await handler.close(info)
          .catch((err)=>{
            LOG.error(`${component}.endRound`, "testId", err);
          })

        if(endGame) {
          io.in(endGame.gameId).emit('gameOver', {success: true, gameId: endGame});
        }
    })

    socket.on('userConnected', async(msg)=>{
      let info = transformInfo(msg);
      info.uid = socket.id;

      // On successful User Connection, add them to the relevant group participant list
      let res = await handler.addParticipant(info)
        .catch((err)=>{
          socket.emit("Connect  Failed", { message: "Unable to Add"});
        })

      if(res)  {
        socket.join(res.gameId);
        socket.emit('Connected', {success: true, user: res.participants[info.userId].name});
        // If there is any question displayed or in progress, share the  details
        if(res.currentQues && res.currentQues.question.text.length) {
          let ques = Object.assign({}, res.currentQues.question, {num: res.currentQues.num});
          socket.emit('question', {success: true, ques: ques});
          // If the options has been displayed show that as well, alongwoth timer
          if(res.currentQues.displayedOptions && res.currentQues.displayedOptions.length){
            socket.emit('options', {success: true, options: res.currentQues.displayedOptions});
            socket.emit('setTimer', {success: true, timer: res.currentQues.timer});
            socket.emit('updatePoints', res.participants[info.userId])
          }
        }
      }
      else{
        socket.emit('Connected', {success: false, message: "The Game is not active yet or has been closed. Check back later.."});
      }
    });

    socket.on('getNextQues', async(msg)=>{
      let info = transformInfo(msg),
        gameInfo = handler.getNextQuestion(info.roomId);

      let ques = Object.assign({}, gameInfo.ques.question, {num: gameInfo.ques.num});
      io.in(gameInfo.gameId).emit('question', {success: true, ques: ques});
    });

    socket.on('getOptions', (msg)=>{
      let info =  transformInfo(msg),
        gameInfo =  handler.getOptions(info.roomId);

      if(gameInfo.gameId) {
        io.in(gameInfo.gameId).emit('options', {success: true, options: gameInfo.options, timer: gameInfo.timer});
        startTimer(gameInfo.timer, gameInfo.gameId, info);
      }
      else{
        LOG.error(`${component}.getOptions`, "testId", `No options received. No gameId.`);
      }
    })

    let startTimer =  (time, gameId, info)=>{
      let timeLeft = time;
      let interval = setInterval(()=>{
        if(timeLeft>0){
          timeLeft = timeLeft-1;  
          handler.setTimer(info.roomId, timeLeft); 
          io.in(gameId).emit('setTimer', {success: true, timer: timeLeft});
        }
        else{
          clearInterval(interval);
        }
      }, 1000);
    }

    socket.on("submitAnswer", (msg)=>{
      let info = transformInfo(msg.info),
        answerRecvd = msg.myAnswer;
      console.log(answerRecvd);
      let isSubmitted = handler.submitAnswer(info.roomId, info.userId, answerRecvd);
      socket.emit('submittedAnswer', {success: isSubmitted});
    });

    socket.on('getAnswer', (msg)=>{
      let info = transformInfo(msg),
        correctAns = handler.getCorrectAnswer(info.roomId);
        console.log(correctAns);
      io.in(correctAns.gameId).emit('displayAnswer', {success: true, correctAns: correctAns});
    });

    socket.on('getWinner', (msg)=>{
      let info = transformInfo(msg),
        res = handler.getRoundWinners(info.roomId);
      
        if(res.gameId){
          io.in(res.gameId).emit('displayRoundResult', {success: true, result: res.getUserAnsList});
        }
    });

    socket.on('changeResultPopUpState', (msg)=>{
      let info = transformInfo(msg.info),
        gameInfo = handler.getGameInfo(info.roomId);
      io.in(gameInfo.gameId).emit('displayResultPopup', msg.state);
    });

    socket.on('changeScoreBoardPopUpState', (msg)=>{
      let info = transformInfo(msg.info),
        gameInfo = handler.getGameInfo(info.roomId);
      io.in(gameInfo.gameId).emit('displayScoreBoardPopup', msg.state);
    });

    socket.on('getParticipants', (msg)=>{
      let info = transformInfo(msg),
        participants = handler.getParticipants(info.roomId);

      io.in(participants.gameId).emit('showParticipants', {success: true, participants: participants.participants});
    });

    socket.on('getFastestAnswer', (msg)=>{
      let info = transformInfo(msg),
        game = handler.getGameInfo(info.roomId);
      // if(fastest.gameId){
        io.in(game.gameId).emit('showFastest');
      // }
    });

    socket.on('addPointsForRoundWinner', (msg)=>{
      let info  = transformInfo(msg),
        assignPoints = handler.assignPoints(info.roomId);
      // If gameId exiists, means the game was found and we can emit the points.
      if(assignPoints.gameId && assignPoints.winner && assignPoints.winner.uid) {
        socket.broadcast.to(assignPoints.winner.uid).emit('updatePoints', assignPoints.winner);
      }
    });

    socket.on('getScores', (msg)=>{
      let info  = transformInfo(msg),
        participants = handler.getParticipants(info.roomId);

      // sort the partiicipants in order of their scores:
      participants.participants.sort((a,b)=>{
        return b.points - a.points;
      });
      io.in(participants.gameId).emit('showScoreBoard', {success: true, participants: participants.participants});  
    });

    socket.on('streamAudio', (msg)=>{
      let info = transformInfo(msg.info),
        gameInfo = handler.getGameInfo(info.roomId);

      if(gameInfo){
        console.log('============', msg.blob)
        socket.broadcast.to(gameInfo.gameId).emit('adminSpeaks', {audio: msg.blob});
      }
    })

    // socket.on('start game', () => gameManager.start());
    socket.on('disconnect',  (reason)=>{
      console.log('user discoinnected', reason);
    })
  })
}