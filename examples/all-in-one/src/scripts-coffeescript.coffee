# Import "lib-external/scripts/coffeescript.coffee"
require 'scripts/coffeescript.coffee'

# Import "src/lib-internal/scripts/coffeescript.coffee"
require 'lib-internal/scripts/coffeescript.coffee'

document.addEventListener 'DOMContentLoaded', () ->
  div = document.createElement('div')
  div.className = 'example scripts coffeescript'
  div.innerHTML = 'Loaded: Scripts / CoffeeScript'

  document.body.appendChild(div)
