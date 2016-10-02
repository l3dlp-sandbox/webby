document.addEventListener 'DOMContentLoaded', () ->
  div = document.createElement('div')
  div.className = 'example scripts coffeescript coffeescript-internal'
  div.innerHTML = 'Loaded: Scripts / CoffeeScript (Internal Library)'

  document.body.appendChild(div)
