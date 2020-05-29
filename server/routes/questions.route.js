const express= require('express'),
  questionRouter  = express.Router(),
  questionController = require('../controllers/questions.component');

questionRouter.post('/add', questionController.addQuestion);
questionRouter.get('/:level', questionController.fetchQuestion);

module.exports = questionRouter;
