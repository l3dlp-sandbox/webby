// Import "lib-external/scripts/javascript.js"
require('script!scripts/javascript');

// Import "src/lib-internal/scripts/javascript.js"
require('script!lib-internal/scripts/javascript');

document.addEventListener('DOMContentLoaded', function() {
  var div = document.createElement('div');
  div.className = 'example scripts javascript'
  div.innerHTML = 'Loaded: Scripts / JavaScript';

  document.body.appendChild(div);
});
