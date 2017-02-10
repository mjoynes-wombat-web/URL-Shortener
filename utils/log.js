require('dotenv').config();
const fs = require('fs');
const time = new Date().toISOString();

module.exports.debug = (logMsg, msgType, method, url, ip) => {
  if (process.env.DEBUG === 'true') {
    const debugLog = './logs/debug.log';

    if (method) {
      if (method === 'GET') {
        const debugLogMsg = `${time} ${ip} ${method} ${url} ${logMsg}`;
        fs.appendFile(debugLog, `${debugLogMsg}\n`, (err) => {
          if (err) throw err;
        });
      }
    }
  }
};
