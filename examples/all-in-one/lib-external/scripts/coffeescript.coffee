document.addEventListener 'DOMContentLoaded', () ->
  div = document.createElement('div')
  div.className = 'example scripts coffeescript coffeescript-external'
  div.innerHTML = 'Loaded: Scripts / CoffeeScript (External Library)'

  document.body.appendChild(div)
