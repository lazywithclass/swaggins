#!/usr/bin/env node

require('shelljs/global');
var program = require('commander');


program
  .version(require('./package.json').version)
  .parse(process.argv);

program
  .command('clean')
  .description('remove the docs folder')
  .action(function(env, options){
    rm('-rf', 'docs');
  });

program
  .command('doc')
  .description('prepares the docs folder')
  .action(function(env, options){
    mkdir('-p', 'docs');
    cp('-r', __dirname + '/lib/swagger-ui/*', 'docs');
    cp('api.json', 'docs');
  });

program
  .command('serve')
  .description('serves the docs folder')
  .action(function(env, options){
    exec('http-server --cors');
  });

if (!program.args || !program.args.length) program.help();
