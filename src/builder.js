'use strict';

var fs = require('fs');
var path = require('path');

var webpack = require('webpack');
var webpackExtractPlugin = require('extract-text-webpack-plugin');
var supportsColor = require('supports-color');

var typedLoaders = require('./builder.loaders');
var utilities = require('./utilities');

// Builder
var Builder = module.exports = function(options) {
  this.settings = utilities.mergeObjects({
    source: '.',
    destination: './build',
    watch: false,
    weaken: false,
    exclude: ['package.json'],
    multiple: false,
    target: '',
    paths: {
      base: [],
      js: [],
      pug: [],
      less: [],
      sass: [],
      stylus: []
    },
    // Server
    server: false,
    serverDestination: 'site',
    serverFile: 'server.js',
    serverPackage: {
      private: true,
      dependencies: {
        express: '4.14.0'
      },
      scripts: {
        start: 'node server.js'
      }
    },
    // Webpack
    webpack: {}
  }, options);

  // Resolving paths
  this.settings.source = path.resolve(this.settings.source);
  this.settings.destination = path.resolve(this.settings.destination);

  for (var group in this.settings.paths) {
    var item = this.settings.paths[group];
    for (var index in item) item[index] = path.resolve(item[index]);
  }

  // Cleaning excludes
  for (var index in this.settings.exclude) {
    this.settings.exclude[index] = this.settings.exclude[index].trim().toLowerCase();
  }

  // Cleaning target
  if (this.settings.target) this.settings.target = this.settings.target.trim().toLowerCase();

  // Supported extensions
  this.extensions = {};

  for (var type in typedLoaders) {
    var priority = 1;

    typedLoaders[type].loaders.forEach(function(item) {
      item.extensions.forEach(function(extension) {
        this.extensions[extension] = {type: type, priority: priority};
        priority += 1;
      }, this);
    }, this);
  }
};

Builder.prototype.getTargets = function() {
  var targets = [];

  if (!this.settings.multiple) {
    var destination = this.settings.destination;
    if (this.settings.server) destination = path.join(destination, this.settings.serverDestination);

    targets = [{source: this.settings.source, destination: destination}];
  }

  else {
    fs.readdirSync(this.settings.source).forEach(function(item) {
      var itemPath = path.join(this.settings.source, item);

      if (utilities.isDirectory(itemPath))
        targets.push({source: itemPath, destination: path.join(this.settings.destination, item)});
    }, this);
  }

  return targets;
};

Builder.prototype.getTargetFiles = function(targetSource) {
  var files = {};

  fs.readdirSync(targetSource).forEach(function(item) {
    var itemCleaned = item.trim().toLowerCase();

    if (!this.settings.exclude || !utilities.inArray(this.settings.exclude, itemCleaned)) {
      var itemPath = path.join(targetSource, item);

      if (utilities.isFile(itemPath)) {
        var extension = path.extname(itemCleaned).split('.').pop().trim();

        if (extension) {
          var data = this.extensions[extension];

          if (data) {
            if (!files[data.type]) files[data.type] = [];
            files[data.type].push([data.priority, itemPath]);
          }
        }
      }
    }
  }, this);

  for (var type in files) {
    var typeFiles = files[type];

    typeFiles.sort(function(a, b) { return a[0] - b[0]; });
    for (var index in typeFiles) typeFiles[index] = typeFiles[index][1];
  }

  return files;
};

Builder.prototype.start = function() {
  var targets = this.getTargets();

  if (this.settings.target && targets.length) {
    targets = targets.filter(function(target) {
      return path.basename(target.source).trim().toLowerCase() === this.settings.target;
    }, this);
  }

  if (!targets.length) throw new TypeError("There are no any targets found");

  var webpackConfigs = [];

  targets.forEach(function(target) {
    var targetFiles = this.getTargetFiles(target.source);

    for (var type in targetFiles) {
      targetFiles[type].forEach(function(file) {
        webpackConfigs.push(this.webpackFileConfig(type, file, target.destination));
      }, this);
    }
  }, this);


  if (this.settings.server)
    webpackConfigs.push(this.webpackServerConfig(this.settings.destination));

  this.webpackStart(webpackConfigs);
};

// Webpack
Builder.prototype.webpackFileConfig = function(type, file, destination) {
  var fileName = (path.basename(file, path.extname(file)).trim() + '.' + type).toLowerCase();
  var webpackSettings = utilities.mergeObjects(null, this.settings.webpack);

  var loaders = [], plugins = [];
  ['_', type].forEach(function(type) {
    var typeLoaders = typedLoaders[type];
    var plugin = null;

    typeLoaders.loaders.forEach(function(loaderData) {
      var loader = {
        test: RegExp('\\.(' + loaderData.extensions.join('|') + ')', 'i'),
        loader: (typeof loaderData.loader === 'function') ?
                loaderData.loader(this.settings, webpackSettings) : loaderData.loader
      };

      if (typeLoaders.extract) {
        if (!plugin) plugin = new webpackExtractPlugin(fileName, {allChunks: true});
        loader.loader = plugin.extract(loader.loader);
      }

      loaders.push(loader);
    }, this);

    if (plugin) plugins.push(plugin);
  }, this);

  var config = {
    target: 'web',
    entry: file,
    output: {
      path: destination
    },
    node: {
      __filename: false,
      __dirname: false,
      global: false,
      process: false,
      console: false,
      Buffer: false
    },
    module: {loaders: loaders},
    plugins: plugins
  };

  // Internal file
  if (fileName.startsWith('_') && fileName.endsWith('.js')) {
    config.target = 'node';
    config.externals = [/^[a-z].*$/i];
    config.output.libraryTarget = 'commonjs2';
  }

  if (config.plugins.length) {
    // Extract is enabled
    config.output.filename = '__nothing__';
    config.plugins.push(new webpackOverridePlugin({nothing: config.output.filename}));
  }
  else config.output.filename = fileName;

  var directory = path.dirname(file);
  var paths = directory ? [directory] : [];

  utilities.mergeObjects(config, this.webpackExtraSettings({paths: paths}));
  utilities.mergeObjects(config, webpackSettings);

  return config;
};

Builder.prototype.webpackServerConfig = function(destination) {
  var serverSettings = !this.settings.multiple ? {home: this.settings.serverDestination} : {multiple: true};
  utilities.mergeObjects(serverSettings, this.settings.server);

  var config = {
    target: 'node',
    entry: path.join(__dirname, 'server.js'),
    externals: [/^[a-z].*$/i],
    output: {
      path: destination,
      filename: this.settings.serverFile,
      libraryTarget: 'commonjs'
    },
    plugins: [
      new webpack.DefinePlugin({serverSettings: JSON.stringify(serverSettings)}),
      new webpackOverridePlugin({'files': {'package.json': JSON.stringify(this.settings.serverPackage)}})
    ]
  };

  utilities.mergeObjects(config, this.webpackExtraSettings());
  utilities.mergeObjects(config, this.settings.webpack);

  return config;
};

Builder.prototype.webpackExtraSettings = function(options) {
  var paths = (options && options.paths) || [];
  utilities.mergeObjects(paths, [this.settings.source]);
  utilities.mergeObjects(paths, this.settings.paths.base);

  var settings = {resolve: {root: paths}};

  if (!this.settings.weaken) {
    settings.plugins = [
      new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
      new webpack.optimize.DedupePlugin()
    ];
  }

  return settings;
};

Builder.prototype.webpackStart = function(configs) {
  var watch = this.settings.watch;
  var outputSettings = {
    cached: false,
    cachedAssets: false,
    exclude: ['node_modules', 'bower_components'],
    colors: supportsColor
  };

  var webpackCompiler = webpack(configs);

  function webpackCallback(error, statistics) {
    if (!watch) webpackCompiler.purgeInputFileSystem();

    if (error) {
      console.error(error.stack || error);
      if (error.details) console.error(error.details);
    }
    else {
      for (var index in statistics.stats || []) {
        if ((utilities.getItem(statistics.stats[index], 'compilation.errors') || []).length) {
          error = true;
          break;
        }
      }

      process.stdout.write(statistics.toString(outputSettings) + '\n');
    }

    if (!watch && error) process.on('exit', function() { process.exit(1); });
  }

  if (watch) webpackCompiler.watch(null, webpackCallback);
  else webpackCompiler.run(webpackCallback);
};

// Webpack override plugin
var webpackOverridePlugin = function(options) {
  this.options = options || {};
};

webpackOverridePlugin.prototype.apply = function(compiler) {
  var nothing = this.options.nothing, files = this.options.files;

  compiler.plugin('emit', function(compilation, callback) {
    if (nothing) delete compilation.assets[nothing];

    if (files) {
      for (var fileName in files) {
        var fileData = files[fileName];

        compilation.assets[fileName] = {
          source: function() { return fileData; },
          size: function() { return fileData.length; }
        };
      }
    }

    callback();
  });
};
