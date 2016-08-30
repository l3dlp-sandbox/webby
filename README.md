<a href="https://www.npmjs.com/package/webby" title="View on NPM"><img src="https://img.shields.io/npm/v/webby.svg"></a>
<a href="https://www.npmjs.com/package/webby" title="View on NPM"><img src="https://img.shields.io/npm/dm/webby.svg"></a>
<a href="https://www.patreon.com/nickola" title="Donate using Patreon"><img src="https://img.shields.io/badge/patreon-donate-green.svg"></a>

# About

 - Webby is a [Webpack](https://webpack.github.io) based, front-end (static HTML/CSS/JS) builder.
 - Supported: SASS, LESS, Stylus, CoffeeScript, TypeScript, Babel (ES5, ES6, Stage 0), Pug (Jade), etc.
 - Low barriers of entry, zero configuration, new project can be started in few seconds.

If you like Webby, please consider an opportunity to support it on [Patreon](https://www.patreon.com/nickola).

# Examples

In `examples` directory you can find common use cases of Webby.
Source code of example projects is located in `src` directory, builded results are located in `build` directory.
The following examples are available:

 - `coffeescript-sass-html_default`: CoffeeScript + SASS -> JS + CSS + HTML (default)
 - `babel_es6-stylus-html_default`: JavaScript (Babel ES6) + Stylus -> JS + CSS + HTML (default)
 - `typescript-less-html`: TypeScript + LESS + HTML -> JS + CSS + HTML
 - `javascript-css-pug`: JavaScript + CSS + Pug (Jade) -> JS + CSS + HTML
 - `sass_import-html_default_variables`: SASS (with external import) -> CSS + HTML (default with variables)

# Usage

 - Start new `Node.js` project with `npm` and `package.json` like that:

```javascript
{
  "private": true,
  "scripts": {
    "build": "webpack",
    "watch": "webpack --progress --watch"
  },
  "devDependencies": {
    "webby": "^0.0.8"
  }
}
```

 - Run `npm install` to install Webby with all dependencies.

 - Create file `webpack.config.js` with content like that:

```javascript
var webby = require('webby');
module.exports = webby().webpack();
```

 - Create directory `src`.

 - Create file `src/index.js` with content like that:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  var div = document.createElement('div');
  div.className = 'example';
  div.innerHTML = 'Webby Example';

  document.body.appendChild(div);
});
```

- Create file `src/index.sass` with content like that:

```sass
.example
  font-size: 35px
  font-weight: bold
```

 - Create any other files with names like `src/index.<supported extension>` (it will be builded by Webby).

 - Run `npm run build`, your project will be builded into directory `build`, see build results there.

 - Run `npm run watch`, build will be started in `watch` mode.

# Options

You can pass options to Webby when it is called from `webpack.config.js` file, like that:
```javascript
var webby = require('webby');

module.exports = webby({
  destination: './dist'
}).webpack();
```

The following options are supported:
  - `target`: source file name (by default - `index`)
  - `source`: source directory  (by default - `./src`)
  - `destination`: destination directory (by default - `./build`)
  - `html_template`: default HTML (Pug / Jade) template file (by default - internal `templates/index.pug`)
  - `weaken`: do not optimize / minimize builded files (by default - `false`)

Also, you can pass variables to default HTML template when it is used, like that:
```javascript
var webby = require('webby');

module.exports = webby({
  variables: {
    meta: {
      description: 'Description'
    }
  }
}).webpack();
```

The following default HTML template variables are supported:
  - `title`: page title (by default - empty)
  - `meta.charset`: page meta charset (by default - `utf-8`)
  - `meta.description`: page meta description (by default - empty)

And also, you can pass options to Webpack, like that:
```javascript
var path = require('path');
var webby = require('webby');

module.exports = webby().webpack({
  sassLoader: {
    includePaths: [
      path.join(__dirname, 'src-lib')
    ]
  }
});
```

# Supported languages and file extensions

Just add any file with name like `index.<supported extension>` (for example: `index.js`, `index.sass`) into `src` directory
and it will be automatically builded by Webby. In that files you can include any other files.
Folowing languages and file extensions are supported:

 - JavaScript (Babel: ES5, ES6, Stage 0): `js`, `jsx`
 - CoffeeScript: `coffee`
 - TypeScript: `ts`, `tsx`
 - CSS: `css`
 - SASS: `sass`, `scss`
 - LESS: `less`
 - Stylus: `styl`
 - HTML: `html`
 - Pug (Jade): `pug`, `jade`

# About author

Webby has been developed by [Nickolay Kovalev](http://nickola.ru).
If you have interest job offers, you can see him contacts at his [CV](http://cv.nickola.ru).
Also, various third-party components are used.

# URLs

  - NPM: https://www.npmjs.com/package/webby
  - GitHub: https://github.com/nickola/webby
  - Patreon: https://www.patreon.com/nickola
  - Author: http://nickola.ru

# License

Webby is licensed under [ISC](https://en.wikipedia.org/wiki/ISC_license) license.
