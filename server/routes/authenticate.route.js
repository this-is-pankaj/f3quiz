const express = require('express'),
  authenticationRouter = express.Router(),
  authenticationController = require('../controllers/authenticate.controller');

authenticationRouter.post('/signup', authenticationController.signup);
authenticationRouter.post('/login', authenticationController.login);

module.exports = authenticationRouter;