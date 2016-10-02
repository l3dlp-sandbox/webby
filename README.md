<a href="https://www.npmjs.com/package/webby" title="View on NPM"><img src="https://img.shields.io/npm/v/webby.svg"></a>
<a href="https://www.npmjs.com/package/webby" title="View on NPM"><img src="https://img.shields.io/npm/dm/webby.svg"></a>
<a href="https://www.patreon.com/nickola" title="Donate using Patreon"><img src="https://img.shields.io/badge/patreon-donate-green.svg"></a>

# About

 - Webby is a [Webpack](https://webpack.github.io) based front-end (static HTML/CSS/JS) builder
   and [Express](http://expressjs.com) based web server (back-end).
 - Supported: SASS, LESS, Stylus, CoffeeScript, TypeScript, Babel (ES5, ES6, Stage 0), Pug (Jade), etc.
 - Zero-configuration, low barriers of entry.

If you like Webby, please consider an opportunity to support it on [Patreon](https://www.patreon.com/nickola).

# Examples

In `examples` directory you can find common use cases of Webby.
Source code of example projects is located in `src` directory, builded results are located in `build` directory.
See `Makefile` for more details about Webby execution. The following examples are available:

 - `all-in-one`: All supported -> JavaScript + CSS + HTML
 - `import-stylus`: Stylus (with external imports) -> CSS
 - `import-sass`: SASS (with external imports) -> CSS
 - `import-less`: LESS (with external imports) -> CSS

# Usage

 - Install `Webby` using `npm` (we assume you have pre-installed `Node.js`):

```
npm install webby -g
```

 - Create new directory, and go into it:

```
mkdir project && cd project
```

 - Create file `index.js` (JavaScript) with content like that:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  var div = document.createElement('div');
  div.className = 'example';
  div.innerHTML = 'Example';

  document.body.appendChild(div);
});
```

 - Create file `index.sass` (SASS) with content like that:

```sass
.example
  font-size: 35px
  font-weight: bold
```

 - Create file `index.pug` (Pug / Jade)  with content like that:

```jade
doctype html
html
  head
    meta(charset="utf-8")
    title Example
    link(rel="stylesheet", href="index.css")
    script(src="index.js")
  body
```

 - Create any other files with supported extensions, it will be automatically builded by Webby
   (see below list of supported languages and file extensions).

 - Run `webby build`, your project will be builded into `build` directory, see build results there.

 - Run `webby build --watch`, build will be started in `watch` mode.

 - You can also start Webby server with builded results, run: `webby server --home build`

# Options

To see list of supported options, run: `webby --help`

For now, following options are supported:

```
Usage: webby <command> [options]

Commands:
  build [source] [destination]  Build project
  server [home]                 Run server

Build options:
  --source                   Source directory            [string] [default: "."]
  --destination              Destination directory [string] [default: "./build"]
  --watch                    Enable "watch" mode      [boolean] [default: false]
  --weaken                   Disable minimization     [boolean] [default: false]
  --exclude                  Exclude files   [array] [default: ["package.json"]]
  --server                   Enable "server" mode (as package)
                                                      [boolean] [default: false]
  --server-destination       Site destination directory for "server" mode
                                                      [string] [default: "site"]
  --server-default           Default site for "server" mode             [string]
  --server-port              Port number for "server" mode
                                                        [number] [default: 8000]
  --server-domain-aliases    Enable domain aliases for "server" mode
                                                      [boolean] [default: false]
  --multiple                 Enable "multiple" mode   [boolean] [default: false]
  --target                   Target for "multiple" mode                 [string]
  --paths                    Base paths                                  [array]
  --js-paths                 JavaScript paths                            [array]
  --pug-paths, --jade-paths  Pug (Jade) paths                            [array]
  --less-paths               LESS paths                                  [array]
  --sass-paths               SASS paths                                  [array]
  --stylus-paths             Stylus paths                                [array]

Server options:
  --home                     Home directory              [string] [default: "."]
  --port                     Port number                [number] [default: 8000]
  --index                    Index files       [array] [default: ["index.html"]]
  --exclude                  Exclude files                               [array]
  --always-home              Enable "always home" mode[boolean] [default: false]
  --always-home-exclude      Exclude files for "always home" mode
                                              [array] [default: ["favicon.ico"]]
  --multiple                 Enable "multiple" mode   [boolean] [default: false]
  --multiple-domain-aliases  Enable domain based site aliases for "multiple"
                             mode                     [boolean] [default: false]
  --default                  Default site for "multiple" mode
                                                   [string] [default: "default"]
  --server-file              Internal server routing file
                                                [string] [default: "_server.js"]

Other options:
  --help, -h     Show help                                             [boolean]
  --version, -v  Show version number                                   [boolean]
```

# Supported languages and file extensions

Just add file with any name and supported extension (for example: `index.js`, `base.sass`) into
project directory and it will be automatically builded by Webby. In that files you can include any other files.
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
