'use strict';

var utilities = require('./utilities');

// Loaders
module.exports = {
  '_': {
    loaders: [
      {
        extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'woff', 'woff2'],
        loader: 'url-loader?name=static/[hash].[ext]&limit=8192'
      },
      {
        extensions: ['eot', 'ttf', 'wav', 'ogg', 'mp3', 'mp4'],
        loader: 'file-loader?name=static/[hash].[ext]'
      },
      {extensions: ['json'], loader: 'json-loader'},
      {extensions: ['txt'], loader: 'raw-loader'}
    ]
  },
  'js': {
    loaders: [
      {
        extensions: ['js', 'jsx'],
        loader: function (settings, webpack) {
          var paths = (utilities.getItem(settings, 'paths.js') || [])
                      .concat(utilities.getItem(settings, 'paths.base') || []);

          if (paths.length) utilities.mergeObjects(webpack, {resolve : {root: paths}});
          return 'babel-loader';
        }
      },
      {extensions: ['coffee'], loader: 'coffee-loader'},
      {extensions: ['ts', 'tsx'], loader: 'ts-loader'}
    ]
  },
  'css': {
    extract: true,
    loaders: [
      {
        extensions: ['css'],
        loader: 'css-loader!postcss-loader'
      },
      {
        extensions: ['less'],
        loader: function (settings, webpack) {
          var paths = (utilities.getItem(settings, 'paths.less') || [])
                      .concat(utilities.getItem(settings, 'paths.base') || []);

          // "less-loader" adds custom file manager plugin, imports must be with tilda (Webpack resolver)
          // Example: "import('~example')"
          if (paths.length) utilities.mergeObjects(webpack, {resolve : {root: paths}});

          // This not works
          var query = []; // paths.map(function(path) { return 'paths[]=' + path; });
          return 'css-loader!postcss-loader!less-loader' + (query.length ? ('?' + query.join('&')) : '');
        }
      },
      {
        extensions: ['sass', 'scss'],
        loader: function(settings) {
          var paths = (utilities.getItem(settings, 'paths.sass') || [])
                      .concat(utilities.getItem(settings, 'paths.base') || []);

          var query = ['sourceMap'].concat(paths.map(function(path) { return 'includePaths[]=' + path; }));
          return 'css-loader!postcss-loader!resolve-url-loader!sass-loader' +
                 (query.length ? ('?' + query.join('&')) : '');
        }
      },
      {
        extensions: ['styl'],
        loader: function(settings) {
          var paths = (utilities.getItem(settings, 'paths.stylus') || [])
                      .concat(utilities.getItem(settings, 'paths.base') || []);

          var query = ['sourceMap', 'include css'].concat(paths.map(function(path) { return 'paths[]=' + path; }));
          return 'css-loader!postcss-loader!resolve-url-loader!stylus-loader' +
                 (query.length ? ('?' + query.join('&')) : '');
        }
      }
    ]
  },
  'html': {
    extract: true,
    loaders: [
      {
        extensions: ['html', 'htm'],
        loader: function(settings) {
          return 'html-loader' +
                 (!settings.weaken ? '?conservativeCollapse=false&removeAttributeQuotes=false' : '');
        }
      },
      {
        extensions: ['pug', 'jade'],
        loader: function(settings) {
          var paths = (utilities.getItem(settings, 'paths.pug') || [])
                      .concat(utilities.getItem(settings, 'paths.base') || []);

          // Only one "basedir" supported, using first
          var query = paths.length ? ['basedir=' + paths[0]] : [];
          return 'pug-html-loader' + (query.length ? ('?' + query.join('&')) : '');
        }
      }
    ]
  }
};
