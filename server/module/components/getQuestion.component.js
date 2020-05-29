const QuesSchema  = require('../../models/question.model'),
  appStatic = require('../utils/appstatic.constant');

module.exports = (info)=>{
  return new Promise((resolve, reject)=>{
    try{
      let q= {
        level: info.level,
        forGroup: info.forGroup || appStatic.questions.defaultGrp
      }
      
      QuesSchema.find(q)
        .then((res)=>{
          resolve(res);
        })
        .catch((err)=>{
          reject(err);
        })
    }
    catch(exc){
      reject(exc)
    }
  })
}