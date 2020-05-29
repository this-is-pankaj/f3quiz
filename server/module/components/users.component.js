const LOG = require('../../utils/logger'),
  component = 'gameplay.users',
  UserSchema = require('../../models/user.model');

const methods = {};

methods.getUserInfo = function(id) {
  return new Promise((resolve, reject)=>{
    try{
      let fieldsToReturn = ["_id", "name", "email", "role", "phone"];
      UserSchema.findOne({ _id: id},fieldsToReturn, {lean: true})
        .then((data)=>{
          resolve(data);
        })
    }
    catch(exc){
      reject(exc);
    }
  })
}

module.exports  = methods;
