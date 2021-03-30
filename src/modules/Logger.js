// MODIFIED FROM ALITA BOT BY KSJAAY (https://github.com/KSJaay/Alita/blob/master/modules/Logger.js)

const chalk = require("chalk");
const moment = require("moment");

exports.log = (content, type = "log") => {
  const timestamp = `[${moment().format("DD-MM-YY H:m:s")}]:`;
  switch (type) {
    case "log": {
      return console.log(`${timestamp} ${chalk.blue(type.toUpperCase())} ${content} `);
    }
    case 'warn': {
      return console.log(`${timestamp} ${chalk.yellow(type.toUpperCase())} ${content} `);
    }
    case 'error': {
      return console.log(`${timestamp} ${chalk.red(type.toUpperCase())} ${content} `);
    }
    case 'debug': {
      return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content} `);
    }
    case 'cmd': {
      return console.log(`${timestamp} ${chalk.gray(type.toUpperCase())} ${content}`);
    }
    case 'ready': {
      return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content}`);
    }
    case 'mongo': {
      return console.log(`${timestamp} ${chalk.yellow(type.toUpperCase())} ${content}`);
    }
    case 'load': {
      return console.log(`${timestamp} ${chalk.magenta(type.toUpperCase())} ${content} `);
    }
    case 'event': {
      return console.log(`${timestamp} ${chalk.cyan(type.toUpperCase())} ${content} `);
    }
    case 'command': {
      return console.log(`${timestamp} ${chalk.magentaBright(type.toUpperCase())} ${content} `);
    }
    case 'item': {
      return console.log(`${timestamp} ${chalk.blue(type.toUpperCase())} ${content} `);
    }
    case 'pet': {
      return console.log(`${timestamp} ${chalk.yellow(type.toUpperCase())} ${content} `);
    }
    case 'econ': {
      return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content} `);
    }
    case 'job': {
      return console.log(`${timestamp} ${chalk.blue(type.toUpperCase())} ${content} `);
    }
    case 'sick': {
      return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content} `);
    }
    default: throw new TypeError('Invalid logger type');
  }
};

exports.error = (...args) => this.log(...args, 'error');

exports.warn = (...args) => this.log(...args, 'warn');

exports.debug = (...args) => this.log(...args, 'debug');

exports.cmd = (...args) => this.log(...args, 'cmd');

exports.ready = (...args) => this.log(...args, 'ready');

exports.mongo = (...args) => this.log(...args, 'mongo');

exports.load = (...args) => this.log(...args, 'load');

exports.event = (...args) => this.log(...args, 'event');

exports.command = (...args) => this.log(...args, 'command');

exports.item = (...args) => this.log(...args, 'item');

exports.pet = (...args) => this.log(...args, 'pet');

exports.econ = (...args) => this.log(...args, 'econ');

exports.job = (...args) => this.log(...args, 'job');

exports.sick = (...args) => this.log(...args, 'sick');