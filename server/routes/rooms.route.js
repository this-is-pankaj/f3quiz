const express = require('express'),
  roomRouter = express.Router(),
  roomController = require('../controllers/rooms.controller');

roomRouter.post('/', roomController.createRoom);
roomRouter.get('/', roomController.getRooms);
roomRouter.get('/games/active', roomController.getActiveGames);

module.exports = roomRouter;
