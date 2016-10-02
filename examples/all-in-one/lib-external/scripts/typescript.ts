export class Library {
  constructor() {
    document.addEventListener('DOMContentLoaded', function() {
    var div = document.createElement('div');
    div.className = 'example scripts typescript typescript-external';
    div.innerHTML = 'Loaded: Scripts / TypeScript (External Library)';

    document.body.appendChild(div);
    });
  }
}
