'use strict';

var settings = {
  loaders: {
    '_': {
      loaders: [
        {extensions: ['png', 'jpg', 'jpeg', 'gif', 'woff', 'woff2'], loader: 'url-loader?name=static/[hash].[ext]&limit=8192'},
        {extensions: ['svg', 'eot', 'ttf', 'wav', 'ogg', 'mp3', 'mp4'], loader: 'file-loader?name=static/[hash].[ext]'},
        {extensions: ['json'], loader: 'json-loader'},
        {extensions: ['txt'], loader: 'raw-loader'}
      ]
    },
    'js': {
      loaders: [
        {extensions: ['js', 'jsx'], loader: 'babel-loader'},
        {extensions: ['coffee'], loader: 'coffee-loader'},
        {extensions: ['ts', 'tsx'], loader: 'ts-loader'}
      ]
    },
    'css': {
      extract: true,
      loaders: [
        {extensions: ['css'], loader: 'css-loader!postcss-loader'},
        {extensions: ['less'], loader: 'css-loader!postcss-loader!less-loader'},
        {extensions: ['sass', 'scss'], loader: 'css-loader!postcss-loader!sass-loader'},
        {extensions: ['styl'], loader: 'css-loader!postcss-loader!stylus-loader'},
      ]
    },
    'html': {
      extract: true,
      loaders: [
        {extensions: ['html', 'htm'], loader: 'html-loader?conservativeCollapse=false&removeAttributeQuotes=false'},
        {extensions: ['pug', 'jade'], loader: 'pug-html-loader'},
      ]
    }
  }
};

module.exports = settings;
