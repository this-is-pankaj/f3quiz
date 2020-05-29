const mongoose = require('mongoose'),
  QuestionModel = require('../models/question.model'),
  collectionName = 'questionBank';

const methods  = {},
  LOG = require('../utils/logger'),
  utils =  require('../utils/utils'),
  component = 'questions.controller';
let questionCollection = mongoose.model(collectionName);

methods.addQuestion =  (req, res)=>{
  const reqId = req.reqId;
  try{
    let ques = new QuestionModel(req.body);
    ques.save((err,data)=>{
      if(err){
        LOG.error(`${component}.addQuestion.save`, reqId, err);
        utils.handleResponse(res, 500,err, data);
      } else{
        LOG.info(`${component}.addQuestion.save`, reqId, data);
        utils.handleResponse(res, 200, null, data);
      }
    })
  }
  catch(exc){
    LOG.error(`${component}.addQuestion`, reqId, exc);
    utils.handleResponse(res, 500, exc, null);
  }
}

methods.fetchQuestion = async (req, res) => {
  const reqId = req.reqId,
    defaultRoom = 'qbank';
  try{
    let q={
      level: parseInt(req.params.level),
      forGroup: req.query.room  || defaultRoom
    };
    console.log(req.query);
    let resp  = await questionCollection.find(q)
      .catch((err)=>{
        LOG.error(`${component}.fetchQuestion.find`, reqId, err);
        utils.handleResponse(res, 500, err, resp);
      })

    LOG.info(`${component}.fetchQuestion.find`, reqId, resp);
    utils.handleResponse(res, 200, null, resp);
  }
  catch(exc){
    LOG.error(`${component}.fetchQuestion`, reqId, exc);
    utils.handleResponse(res, 500, exc, null);
  }
}

module.exports = methods;