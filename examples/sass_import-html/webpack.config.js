var path = require('path');
var webby = require('../../src');

module.exports = webby().webpack({
  sassLoader: {
    includePaths: [
      path.join(__dirname, 'src-lib')
    ]
  }
});
