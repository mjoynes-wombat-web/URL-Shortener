require('dotenv').config();
const fs = require('fs');
const chalk = require('chalk');

const time = new Date().toISOString();

module.exports.debug = (info) => {
  if (process.env.DEBUG === 'true') {
    const errorLog = './logs/error.log';

    // INFO OBJECT VALUES
    // {
    //   logMsg: '',
    //   method: '',
    //   url: '',
    //   ip: '',
    //   level: '',
    // }

    const debugLogMsg = `${time}\t${info.ip}\t${info.method}\t${info.url} \t${info.logMsg}`;

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
  }
};
