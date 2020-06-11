const mongoose = require('mongoose'),
  roomsModel = require('../models/room.model');

const collectionName = 'rooms',
  LOG = require('../utils/logger'),
  utils =  require('../utils/utils'),
  component = 'rooms.controller',
  methods = {};

methods.createRoom = (req, res) => {
  const reqId = req.reqId;
  try{
    let reqObj = {
      name: req.body.name,
      owner: req.userId
    }
    LOG.info(`${component}.createRoom`, reqId, reqObj);
    let room = new roomsModel(reqObj);
    room.save((err,data)=>{
      if(err){
        LOG.error(`${component}.createRoom.save`, reqId, err);
        utils.handleResponse(res, 500,err, data);
      } else{
        LOG.info(`${component}.createRoom.save`, reqId, data);
        utils.handleResponse(res, 200, null, data);
      }
    })
  }
  catch(exc){
    LOG.error(`${component}.createRoom`, reqId, exc);
    utils.handleResponse(res, 500, exc, null);
  }
}

methods.getRooms = async (req, res)=>{
  const reqId = req.reqId;
  try{
    let q={
      owner: req.userId
    };
    let resp  = await roomsModel.find(q)
      .catch((err)=>{
        LOG.error(`${component}.getRooms.find`, reqId, err);
        utils.handleResponse(res, 500, err, resp);
      })

    LOG.info(`${component}.getRooms.find`, reqId, resp);
    utils.handleResponse(res, 200, null, resp);
  }
  catch(exc){
    LOG.error(`${component}.getRooms`, reqId, exc);
    utils.handleResponse(res, 500, exc, null);
  }
}

methods.getActiveGames = async (req, res)=>{
  const reqId = req.reqId;
  try{
    let resp  = await roomsModel.find({})
      .catch((err)=>{
        LOG.error(`${component}.getRooms.find`, reqId, err);
        utils.handleResponse(res, 500, err, resp);
      })
    if(resp) {
      LOG.info(`${component}.getRooms.find`, reqId, resp);
      let activeGames = [];
      for(let i=0; i<resp.length; i++) {
        let obj = {
          roomId: resp[i]._id,
          roomName: resp[i].name,
          games: []
        };

        resp[i].games.filter((game)=>{
          if(game.isActive && game.allowNewJoins) {
            obj.games.push({
              id: game._id,
              isOpen: !game.isLocked,
              url: `/quiz/play/${obj.roomId}/game/${game._id}`
            })
          } 
        });
        activeGames.push(obj);
      }
      utils.handleResponse(res, 200, null, activeGames);
    }
  }
  catch(exc){
    LOG.error(`${component}.getRooms`, reqId, exc);
    utils.handleResponse(res, 500, exc, null);
  }
}

module.exports = methods;