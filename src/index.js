'use strict';

// Imports
var fs = require('fs');
var path = require('path');

var webpack = require('webpack');
var webpackExtract = require('extract-text-webpack-plugin');
var pug = require('pug');

var settings = require('./settings');
var utilities = require('./utilities');

// Making data by settings
var webpackLoaders = [];
var webpackExtractPlugins = [];
var targetExtensions = {};

for (var group in settings.loaders) {
  var groupData = settings.loaders[group];
  var extractPlugin = null, extensionOrder = 0;

  groupData.loaders.forEach(function(loaderData) {
    var loaderExtensions = [];

    loaderData.extensions.forEach(function(extension) {
      loaderExtensions.push(extension);

      if (group !== '_') {
        extensionOrder += 1;
        targetExtensions[extension] = {group: group, order: extensionOrder};
      }
    });

    if (loaderExtensions.length) {
      var loader = {
        test: RegExp('\\.(' + loaderExtensions.join('|') + ')', 'i'),
        loader: loaderData.loader
      };

      if (groupData.extract) {
        if (!extractPlugin) extractPlugin = new webpackExtract('index.' + group, {allChunks: true});
        loader.loader = extractPlugin.extract(loader.loader);
      }

      webpackLoaders.push(loader);
    }
  });

  if (extractPlugin) webpackExtractPlugins.push(extractPlugin);
}

// Webby webpack plugin
function WebbyWebpackPlugin(options) {
  this.options = options || {};
}

WebbyWebpackPlugin.prototype.apply = function(compiler) {
  var files = this.options ? this.options.files : null;

  compiler.plugin('emit', function(compilation, callback) {
    delete compilation.assets['__webby__'];

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

// Webby
function Webby(webbyOptions) {
  return {webpack: function(webpackOptions) { return Webby.webpack(webbyOptions, webpackOptions); }};
}

Webby.webpack = function(webbyOptions, webpackOptions) {
  webbyOptions = utilities.mergeObjects({
    target: 'index',
    source: './src',
    destination: './build',
    html_template: path.resolve(path.join(__dirname, 'templates', 'index.pug')),
    variables: {
      title: '',
      meta: {
        charset: 'utf-8',
        description: ''
      }
    }
  }, webbyOptions);

  // Looking for files of known groups
  var groups = {};

  fs.readdirSync(webbyOptions.source).forEach(function(file) {
    var filePath = path.resolve(path.join(webbyOptions.source, file));
    var fileStat = fs.lstatSync(filePath);

    if (fileStat.isFile()) {
      var fileExtension = path.extname(file);
      var fileName = path.basename(file, fileExtension).trim().toLowerCase();

      if (fileName === webbyOptions.target) {
        var extension = fileExtension.split('.').pop().trim().toLowerCase();
        var targetData = targetExtensions[extension];

        if (targetData) {
          if (!groups[targetData.group]) groups[targetData.group] = [];
          groups[targetData.group].push([targetData.order, filePath]);
        }
      }
    }
  });

  // Making config
  var config = [];

  for (var group in groups) {
    var groupData = groups[group];
    groupData.sort(function(a, b) { return a[0] - b[0]; });

    var files = groupData.map(function(item) { return item[1]; });
    config.push(Webby.webpackGroupConfig(group, {entry: files}, webbyOptions, webpackOptions));
  }

  // Default HTML
  if (!groups.html) {
    var context = utilities.mergeObjects({}, webbyOptions.variables, {
      css: groups.css ? 'index.css' : '',
      js: groups.js ? 'index.js' : ''
    });

    var html = pug.renderFile(webbyOptions.html_template, context);
    config.push(Webby.webpackGroupConfig('html', {output: html}, webbyOptions, webpackOptions));
  }

  return config;
};

Webby.webpackGroupConfig = function(group, parameters, webbyOptions, webpackOptions) {
  parameters = parameters || {};
  webbyOptions = webbyOptions || {};

  // Base config
  var config = {
    target: 'web',
    output: {
      path: webbyOptions.destination,
      filename: '__webby__'
    },
    externals: [/^[a-z].*$/i],
    node: {
      __filename: false,
      __dirname: false,
      global: false,
      process: false,
      console: false,
      Buffer: false
    },
    module: {loaders: webpackLoaders},
    plugins: utilities.copyArray(webpackExtractPlugins)
  };

  if (group === 'js') utilities.mergeObjects(config, {output: {filename: 'index.js'}});

  // Parameters
  if (parameters.entry) {
    config.entry = parameters.entry;
    config.plugins.push(new WebbyWebpackPlugin());
  }
  else if (parameters.output) {
    var files = {};
    files['index.' + group] = parameters.output;
    config.plugins.push(new WebbyWebpackPlugin({files: files}));
  }

  if (!webbyOptions.weaken) {
    // Optimization (minimization)

    // config.htmlLoader = {conservativeCollapse: false};
    // "config.htmlLoader" don't works because of "extract-text-webpack-plugin"
    // and incorrect "getLoaderConfig" in "html-loader" (see "getLoaderConfig" in "sass-loader" as right example)
    // Workaround is to use loader query options: "html-loader?conservativeCollapse=false"

    config.plugins.push(new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}));
    config.plugins.push(new webpack.optimize.DedupePlugin());
  }

  if (webpackOptions) utilities.mergeObjects(config, webpackOptions);

  return config;
};

// Exports
module.exports = Webby;
