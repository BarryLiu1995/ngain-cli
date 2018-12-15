#!/usr/bin/env node
const program = require('commander');
const common = require('./common');
const init = require('./init');

const { message } = common;

if (process.argv.slice(2).join('') === '-v') {
  const pkg = require('../package');
  message.info('ngain-cli version ' + pkg.version);
  process.exit()
}

program
  .command('new [name]')
  .alias('n')
  .description('Create a new project')
  .action(name => {
    const projectName = name || 'myAngularApp';
    init({ app: projectName})
  });

program.parse(process.argv);

const cmd = process.argv[2];
if (!['new', 'n'].includes(cmd)) {
  program.help();
}
