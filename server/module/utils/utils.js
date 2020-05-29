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
}

module.exports = utils;