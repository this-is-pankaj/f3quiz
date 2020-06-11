const axios = require('axios'),
  utils = {};

utils.makeCalls = (config)=>{
  return  new Promise((resolve, reject)=>{
    try{
      axios(config)
      .then((res)=>{
        resolve(res.data);
      })
      .catch((err)=>{
        reject(err.response.request);
      })
    }
    catch(exc){
      reject(exc);
    }
  })
};

utils.generateRand = (min, max)=>{
  return Math.floor((Math.random()*(max-min+1)+min));
}

module.exports = utils;