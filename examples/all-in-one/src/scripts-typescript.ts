// Import "lib-external/scripts/typescript.js"
import * as libExternal from 'scripts/typescript.ts';
new libExternal.Library();

// Import "src/lib-internal/scripts/typescript.js"
import * as libInternal from 'lib-internal/scripts/typescript.ts';
new libInternal.Library();

document.addEventListener('DOMContentLoaded', function() {
  var div = document.createElement('div');
  div.className = 'example scripts typescript';
  div.innerHTML = 'Loaded: Scripts / TypeScript';

  document.body.appendChild(div);
});
