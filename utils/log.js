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

  // LEVELS
  //   INFO
  //   DEBUG
  //   ERROR

  const msg = new debugMsg(info);

  Object.keys(msg).forEach((key) => {
    if (msg[key] === undefined) {
      msg[key] = '';
    }
  });

  const errorLog = './logs/error.log';
  let debugLogMsg = '';

  if (msg.url === '') {
    debugLogMsg = `${time}\t${msg.ip}\t${msg.method}\t${msg.url}\t\t${msg.level}\t${msg.logMsg}`;
  } else if (msg.url.length < 16) {
    debugLogMsg = `${time}\t${msg.ip}\t${msg.method}\t${msg.url}\t\t${msg.level}\t${msg.logMsg}`;
  } else {
    debugLogMsg = `${time}\t${msg.ip}\t${msg.method}\t${msg.url}\t${msg.level}\t${msg.logMsg}`;
  }

  fs.stat(errorLog, (err) => {
    if (err === null) {
      fs.appendFile(errorLog, `${debugLogMsg}\n`, (writeErr) => {
        if (writeErr) throw writeErr;
      });
    } else if (err.code === 'ENOENT') {
      fs.appendFile(errorLog, `TIME\t\tIP\tMETHOD\tURL\t\tLEVEL\tMESSAGE\n${debugLogMsg}\n`, (writeErr) => {
        if (writeErr) throw writeErr;
      });
    }
  });

  if (process.env.DEBUG) {
    const debugConsoleMsg = (t, m) => {
      const consoleMsg = m;
      consoleMsg.ip = chalk.cyan(consoleMsg.ip);
      if (consoleMsg.method !== '') {
        consoleMsg.method = chalk.bold.bgGreen.black(` ${consoleMsg.method} `);
        consoleMsg.url = chalk.underline.blue.bgWhite(` ${consoleMsg.url} `);
      } else {
        consoleMsg.url = chalk.underline.blue(consoleMsg.url);
      }

      switch (consoleMsg.level) {
        case 'INFO':
          consoleMsg.level = chalk.green(` ${consoleMsg.level} `);
          break;
        case 'DEBUG':
          consoleMsg.level = chalk.yellow(` ${consoleMsg.level} `);
          break;
        case 'ERROR':
          consoleMsg.level = chalk.black.bgRed(` ${consoleMsg.level} `);
          consoleMsg.logMsg = chalk.red(consoleMsg.logMsg);
          break;
        default:
          break;
      }

      return consoleMsg;
    };

    const consoleMsg = debugConsoleMsg(time, msg);
    const consoleOutput = `${time}\t${consoleMsg.ip}\t${consoleMsg.method}${consoleMsg.url}\t${consoleMsg.level}\t${consoleMsg.logMsg}`;

    switch (process.env.DEBUG) {
      case 'debug':
      case 'true':
        console.log(consoleOutput);
        break;
      case 'error':
        if (info.level === 'ERROR') {
          console.log(consoleOutput);
        }
        break;
      case 'info':
        if (info.level === 'INFO' || info.level === 'ERROR') {
          console.log(consoleOutput);
        }
        break;
      default:
        console.log(`The debug level ${process.env.DEBUG} is incorrect. Please choose true, error, debug or info.`);
        break;
    }
  }
};
