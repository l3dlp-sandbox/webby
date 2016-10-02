'use strict';

var fs = require('fs');
var path = require('path');
var express = require('express');

var utilities = require('./utilities');

// Server
var Server = module.exports = function(options) {
  this.settings = utilities.mergeObjects({
    home: '.',
    port: 8000,
    index: ['index.html'],
    exclude: [],
    default: 'default',
    alwaysHome: false,
    alwaysHomeExclude: ['favicon.ico'],
    multiple: false,
    multipleAliases: {},
    multipleDomainAliases: false,
    serverFile: '_server.js'
  }, options);

  // Home
  if (this.settings.home) this.settings.home = path.resolve(this.settings.home);
  if (!this.settings.home || !utilities.isDirectory(this.settings.home))
    TypeError("Incorrect home directory");

  // Initialization
  this.loadSites();

  // Express
  this.express = express();
  this.express.disable('x-powered-by');

  var instance = this;
  this.express.get('/*', function (request, response) {
    var site = instance.resolveSite(request.hostname), file = null;

    if (site) {
      var url = '';

      if (request.path) {
        url = path.relative('/', path.resolve(request.path));
        if (url && (!site.exclude || !utilities.inArray(site.exclude, url)) &&
                   (!instance.settings.exclude || !utilities.inArray(instance.settings.exclude, url)))
          file = instance.findFile(site.home, url);
      }

      if (!url || (!file && instance.settings.alwaysHome &&
                   (!instance.settings.alwaysHomeExclude ||
                    !utilities.inArray(instance.settings.alwaysHomeExclude, url)))) {
        if (site.server) return site.server.apply(instance, arguments);
        else {
          for (var index in instance.settings.index) {
            file = instance.findFile(site.home, instance.settings.index[index]);
            if (file) break;
          }
        }
      }
    }

    if (file) response.sendFile(file);
    else response.status(404).send('');
  });
};

Server.prototype.start = function() {
  var port = this.settings.port;
  if (!port) throw new TypeError('Server port is not defined');

  this.express.listen(port, function() {
    console.log('Server listening on port: ' + port);
  });
};

// Sites
Server.prototype.loadSites = function(directory) {
  this.sites = {};

  if (!this.settings.multiple) {
    var site = this.loadSite(this.settings.home);
    if (site) this.sites[this.settings.default] = site;
  }
  else {
    fs.readdirSync(this.settings.home).forEach(function(item) {
      var itemPath = path.join(this.settings.home, item);

      if (utilities.isDirectory(itemPath)) {
        var domain = item.trim().toLowerCase();

        if (domain) {
          var site = this.loadSite(itemPath);
          if (site) this.sites[domain] = site;
        }
      }
    }, this);
  }
};

Server.prototype.loadSite = function(directory) {
  if (directory && utilities.isDirectory(directory)) {
    var data = {'home': directory};

    if (this.settings.serverFile) {
      var serverFile = path.join(directory, this.settings.serverFile);

      if (utilities.isFile(serverFile)) {
        var directoryOriginal = process.cwd();

        process.chdir(directory);
        data['server'] = eval('require(serverFile)');
        process.chdir(directoryOriginal);

        data['exclude'] = [this.settings.serverFile];
      }
    }

    return data;
  }

  return null;
};

Server.prototype.resolveSite = function(hostname) {
  var domains = [];

  if (this.settings.multiple) {
    hostname = (hostname || '').trim().toLowerCase();

    if (this.settings.multipleAliases && this.settings.multipleAliases[hostname])
      domains.push(this.settings.multipleAliases[hostname]);
    else if (this.settings.multipleDomainAliases) domains.push(hostname);
  }

  if (this.settings.default && !utilities.inArray(domains, this.settings.default))
    domains.push(this.settings.default);

  for (var index in domains) {
    var site = this.sites[domains[index]];
    if (site) return site;
  }

  return null;
};

// Utilities
Server.prototype.findFile = function(root, file) {
  var filePath = null;

  if (file) {
    filePath = root ? path.join(root, file) : file;
    if (!utilities.isFile(filePath)) filePath = null;
  }

  return filePath;
};

// Starting server (if defined)
if (typeof serverSettings !== 'undefined') new Server(serverSettings).start();
