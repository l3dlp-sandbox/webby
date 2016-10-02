#!/usr/bin/env node
'use strict';

var path = require('path');
var yargs = require('yargs');

var Builder = require('../builder');
var Server = require('../server');

// Options
var name = path.basename(__filename, path.extname(__filename));

var optionsParser = yargs
  .usage('Usage: ' + name + ' <command> [options]')

  // Build
  .command('build [source] [destination]', 'Build project', function (yargs) {
      return yargs.usage('Usage: ' + name + ' build [source] [destination] [options]')
                  .option('source', {type: 'string', default: '.', describe: 'Source directory'})
                  .option('destination', {type: 'string', default: './build', describe: 'Destination directory'})
                  .option('watch', {type: 'boolean', default: false, describe: 'Enable "watch" mode'})
                  .option('weaken', {type: 'boolean', default: false, describe: 'Disable minimization'})
                  .option('exclude', {type: 'array', default: ['package.json'], describe: 'Exclude files'})
                  .option('server', {type: 'boolean', default: false, describe: 'Enable "server" mode (as package)'})
                  .option('server-destination', {type: 'string', default: 'site', describe: 'Site destination directory for "server" mode'})
                  .option('server-default', {type: 'string', describe: 'Default site for "server" mode'})
                  .option('server-port', {type: 'number', default: 8000, describe: 'Port number for "server" mode'})
                  .option('server-domain-aliases', {type: 'boolean', default: false, describe: 'Enable domain aliases for "server" mode'})
                  .option('multiple', {type: 'boolean', default: false, describe: 'Enable "multiple" mode'})
                  .option('target', {type: 'string', describe: 'Target for "multiple" mode'})
                  // // Paths
                  .option('paths', {type: 'array', describe: 'Base paths'})
                  .option('js-paths', {type: 'array', describe: 'JavaScript paths'})
                  .option('pug-paths', {alias: 'jade-paths', type: 'array', describe: 'Pug (Jade) paths'})
                  .option('less-paths', {type: 'array', describe: 'LESS paths'})
                  .option('sass-paths', {type: 'array', describe: 'SASS paths'})
                  .option('stylus-paths', {type: 'array', describe: 'Stylus paths'});
  })

  // Server
  .command('server [home]', 'Run server', function (yargs) {
    return yargs.usage('Usage: ' + name + ' server [home] [options]')
                .option('home', {type: 'string', default: '.', describe: 'Home directory'})
                .option('port', {type: 'number', default: 8000, describe: 'Port number'})
                .option('index', {type: 'array', default: ['index.html'], describe: 'Index files'})
                .option('exclude', {type: 'array', describe: 'Exclude files'})
                .option('always-home', {type: 'boolean', default: false, describe: 'Enable "always home" mode'})
                .option('always-home-exclude', {type: 'array', default: ['favicon.ico'], describe: 'Exclude files for "always home" mode'})
                .option('multiple', {type: 'boolean', default: false, describe: 'Enable "multiple" mode'})
                .option('multiple-domain-aliases', {type: 'boolean', default: false, describe: 'Enable domain based site aliases for "multiple" mode'})
                .option('default', {type: 'string', default: 'default', describe: 'Default site for "multiple" mode'})
                .option('server-file', {type: 'string', default: '_server.js', describe: 'Internal server routing file'});
  })
  .demand(1)

  // Help and version
  .help('help')
  .alias('help', 'h')
  .alias('version', 'v')
  .version(function() {
    return name.replace(/(^|\s)\w/g, function(x) { return x.toUpperCase(); }) +
           ' ' + require('../../package').version;
  });

var options = optionsParser.argv;
var command = options._[0];

// Build
if (command === 'build') {
  var server = false;
  if (options.server) {
    server = {};
    if (options['server-default']) server['default'] = options['server-default'];
    if (options['server-port']) server['port'] = options['server-port'];
    if (options['server-domain-aliases']) server['multipleDomainAliases'] = options['server-domain-aliases'];
  }

  new Builder({
    source: options.source,
    destination: options.destination,
    watch: options.watch,
    weaken: options.weaken,
    exclude: options.exclude || [],
    server: server,
    serverDestination: options['server-destination'],
    multiple: options.multiple,
    target: options.target,
    paths: {
      base: options['paths'] || [],
      js: options['js-paths'] || [],
      pug: options['pug-paths'] || [],
      less: options['less-paths'] || [],
      sass: options['sass-paths'] || [],
      stylus: options['stylus-paths'] || []
    },
  }).start();
}

// Server
else if (command === 'server') {
  new Server({
    home: options.home,
    port: options.port,
    index: options.index || [],
    exclude: options.exclude || [],
    alwaysHome: options['always-home'],
    alwaysHomeExclude: options['always-home-exclude'] || [],
    multiple: options.multiple,
    multipleDomainAliases: options['multiple-domain-aliases'],
    default: options.default,
    serverFile: options['server-file']
  }).start();
}

// Help
else optionsParser.showHelp();
