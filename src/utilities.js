'use strict';

var fs = require('fs');

// Utilities
var utilities = module.exports = {};

utilities.isDirectory = function(path) {
  try { return fs.lstatSync(path).isDirectory(); }
  catch (error) { return false; }
};

utilities.isFile = function(path) {
  try { return fs.lstatSync(path).isFile(); }
  catch (error) { return false; }
};

utilities.inArray = function(data, item) {
  return data.indexOf(item) >= 0;
};

utilities.copyArray = function(source) {
  return Array.prototype.slice.call(source);
};

utilities.mergeObjects = function() {
  var destination = null;

  utilities.copyArray(arguments).forEach(function(source) {
    if (destination === null) destination = source || {};
    else if (typeof source === 'object' && (source !== null)) {
      if (Array.isArray(destination)) {
        source.forEach(function(element) {
          if (!utilities.inArray(destination, element)) destination.push(element);
        }, this);
      }
      else {
        for (var item in source) {
          var found = item in destination;

          if (found) {
            var destinationItem = destination[item];
            if (typeof destinationItem === 'object') utilities.mergeObjects(destinationItem, source[item]);
            else found = false;
          }

          if (!found) destination[item] = source[item];
        }
      }
    }
  }, this);

  return destination || {};
};

utilities.getItem = function(data, item) {
  var result = data;

  if (result && item) {
    var parts = item.split('.');

    for (var index in parts) {
      var part = parts[index];
      result = result[part];
      if (typeof result === 'undefined') break;
    }
  }

  return result;
};
