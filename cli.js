#!/usr/bin/env node

require('shelljs/global');
var program = require('commander');

var docsFolder = process.cwd() + '/docs';

program.version(require('./package.json').version)

program
  .command('clean')
  .description('remove the docs folder')
  .action(function(env, options){
    rm('-rf', docsFolder);
  });

program
  .command('doc')
  .description('prepares the docs folder')
  .action(function(env, options){
    mkdir('-p', docsFolder);
    cp('-r', __dirname + '/lib/swagger-ui/*', docsFolder);
    mv('./swagger.json', docsFolder);
  });

program
  .command('serve')
  .description('serves the docs folder')
  .action(function(env, options){
    exec('http-server --cors');
  });

program.parse(process.argv);

if (!program.args || !program.args.length) program.help();
