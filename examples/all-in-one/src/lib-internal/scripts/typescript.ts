export class Library {
  constructor() {
    document.addEventListener('DOMContentLoaded', function() {
    var div = document.createElement('div');
    div.className = 'example scripts typescript typescript-internal';
    div.innerHTML = 'Loaded: Scripts / TypeScript (Internal Library)';

    document.body.appendChild(div);
    });
  }
}
