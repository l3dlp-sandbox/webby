var webby = require('../../src');

module.exports = webby({
  variables: {
    title: 'Webby Example',
    meta: {
      charset: 'utf-8',
      description: 'Webby Example'
    }
  }
}).webpack();
