'use strict';

module.exports = {
  builder: function(options) { return new require('./builder')(options); },
  server: function(options) { return new require('./server')(options); }
};
