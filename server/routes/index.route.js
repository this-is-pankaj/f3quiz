const authenticationRoute = require('./authenticate.route'),
  questionsRoute = require('./questions.route'),
  roomsRoute = require('./rooms.route'),
  quizManager = require('../module/gameplay.socket');

const getUserId = require('../utils/getUserId');

module.exports = function(app){
  quizManager(app);

  app.use('/api/authenticate', getUserId, authenticationRoute);
  app.use('/api/questions', getUserId, questionsRoute);
  app.use('/api/rooms', getUserId, roomsRoute);
}