const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const chalk = require('chalk');

const sep = os.platform() === 'win32' ? '\\' : '/';

const message = {
  success (text) {
    console.log(chalk.green.bold(text));
  },
  error (text) {
    console.log(chalk.red.bold(text));
  },
  info (text) {
    console.log(chalk.blue.bold(text));
  },
  light (text) {
    console.log(chalk.yellow.bold(text));
  }
};

function write(path, str) {
  fs.writeFileSync(path, str);
}

module.exports = { message, write};
