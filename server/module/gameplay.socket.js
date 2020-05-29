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
      }
    });

    socket.on('userConnected', async(msg)=>{
      let info = transformInfo(msg);
      info.uid = socket.id;

      // On successful User Connection, add them to the relevant group participant list
      let res = await handler.addParticipant(info)
        .catch((err)=>{
          socket.emit("Connect  Failed", { message: "Unable to Add"})
        })

      if(res)  {
        socket.join(res.gameId);
        io.in(res.gameId).emit('Connected', {success: true, gameId: res})
      }
    })
    // socket.on('start game', () => gameManager.start());
    socket.on('disconnect',  (reason)=>{
      console.log('user discoinnected', reason)
    })
  })
}