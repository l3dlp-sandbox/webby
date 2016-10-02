// Import "lib-external/scripts/babel.js"
require('script!scripts/babel');

// Import "src/lib-internal/scripts/babel.js"
require('script!lib-internal/scripts/babel');

document.addEventListener('DOMContentLoaded', () => {
  let div = document.createElement('div');
  div.className = 'example scripts babel';
  div.innerHTML = 'Loaded: Scripts / Babel';

  document.body.appendChild(div);
});
