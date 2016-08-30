document.addEventListener 'DOMContentLoaded', () ->
  div = document.createElement('div')
  div.className = 'example'
  div.innerHTML = 'Webby Example'

  document.body.appendChild(div)
