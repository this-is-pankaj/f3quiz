module.exports = {
  info: (component, reqId, message) => {
    let logObj = createObject(component, reqId, message, 'INFO');
    console.log(JSON.stringify(logObj));
  },
  error: (component, reqId, message) => {
    let logObj = createObject(component, reqId, message, 'ERROR');
    console.log(JSON.stringify(logObj));
  },
  alert: (component, reqId, message) => {
    let logObj = createObject(component, reqId, message, 'ALERT');
    console.log(`++++++++++++++++++++++++++++`);
    console.log(JSON.stringify(logObj));
    console.log(`-------------------------`);
  }
}

let createObject = (component, reqId, message, logType)=>{
  let logObj  = {
    logType,
    component,
    reqId
  };
  try{
    logObj.msg = JSON.stringify(message);
  }
  catch(exc){
    logObj.msg = message;
  }
  return logObj;
}