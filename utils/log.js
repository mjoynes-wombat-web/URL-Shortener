require('dotenv').config();
const fs = require('fs');
const chalk = require('chalk');

const time = new Date().toISOString();

module.exports.debug = (info) => {

  class debugMsg {
    constructor(object) {
      this.logMsg = object.logMsg;
      this.method = object.method;
      this.url = object.url;
      this.ip = object.ip;
      this.level = object.level;
    }
  }

  let msg = new debugMsg(info);

  // INFO OBJECT VALUES
    // {
    //   logMsg: '',
    //   method: '',
    //   url: '',
    //   ip: '',
    //   level: '',
    // }
  Object.keys(msg).forEach((key) => {
    if (msg[key] === undefined) {
      msg[key] = '';
    }
    if (msg.url === '') {
      msg.url = '\t';
    }
  });

  const errorLog = './logs/error.log';
  const debugLogMsg = `${time}\t${msg.ip}\t${msg.method}\t${msg.url} \t${msg.logMsg}`;

  fs.stat(errorLog, (err) => {
    if (err === null) {
      fs.appendFile(errorLog, `${debugLogMsg}\n`, (writeErr) => {
        if (writeErr) throw writeErr;
      });
    } else if (err.code === 'ENOENT') {
      fs.appendFile(errorLog, `TIME\t\tIP\tMETHOD\tURL\t\tMESSAGE\n${debugLogMsg}\n`, (writeErr) => {
        if (writeErr) throw writeErr;
      });
    }
  });

  if (process.env.DEBUG === 'true') {
    const debugConsoleMsg = '';
  }
};
