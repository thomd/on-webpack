Some personal notes on

# Webpack 4

Webpack is a **module bundler**. In Webpack, everything is a **module**. Not only JavaScript but also everything else (style sheets, images, markup) can be a module.

Starting from **entry** points, Webpack creates a dependency graph which allows for bundling single or multiple **outputs** so that you just load what you need and when you need it.

With **loaders** you can intercept your dependencies and pre-process them before they get bundled.

With **plugins** you can perform subsequent tasks like bundle optimizations (Webpack itself is considered a plugin with one behaviour by default: bundle assets).

Hence, Webpack is basically about **entry**, **output**, **loaders** and **plugins**.

---

## Entry & Output

### Without configuration file

    npm init -y
    npm i -D webpack webpack-cli

The **default entry point** is `./src/index.js`

The **default output file** is `./dist/main.js`

Build in **Development mode** for optimized speed and an un-minified bundle:

    npx webpack --mode development

Build in **Production mode** to enable optimizations out of the box, including minification, scope hoisting, tree-shaking and more:

    npx webpack --mode production

> Tree shaking is a term commonly used in the JavaScript context for dead-code elimination. It relies on the static structure of ES2015 module syntax, i.e. `import` and `export`.

### With configuration file

Create a `webpack.config.js` file (using default settings)

```diff
+   module.exports = {
+     mode: 'production',
+     entry: './src/index.js',
+     output: {
+       path: __dirname + '/dist',
+       filename: 'main.js'
+     }
+   }
```

and run

    npx webpack

The key `entry` can be a string (`'./src/index.js'`), an array (`['./src/index.js']`) or an object(`{'index': './src/index.js'}`).

In order to create multiple bundles, you can export multiple configs in an array:

    module.exports = [config1, config2]

### Multiple entry files

Use an entry object in case of multiple entry files and replace the output with a filename **substitution**:

```diff
    module.exports = {
-     entry: './src/index.js',
+     entry: {
+       main: './src/index.js',
+       vendor: 'src/vendor.js'
+     },
      output: {
        path: __dirname + '/dist',
-       filename: 'main.js'
+       filename: '[name].js'
      }
    }
```

### Webpack Options

Run Webpack in **watch mode** with

    npx webpack --watch

Print also hidden modules with

    npx webpack --display-modules

---

## Webpack Loaders

Loaders describe to webpack how to process non-JavaScript modules and include these dependencies into your bundles.

Without any loader, Webpack is basically a bundler for JavaScript modules (ESM and CommonJS) which adds bootstrap code for module loading.

### Transpile JavaScript with Babel

First install [Babel](https://babeljs.io/) dependencies

    npm i -D @babel/core @babel/cli @babel/preset-env

then create a Babel configuration file `.babelrc`

```diff
+   {
+     "presets": ["@babel/preset-env"]
+   }
```

and define the supported browsers in `package.json` like this:

```diff
    {
      "name": "on-webpack",
+     "browserslist": [
+       "last 2 versions",
+       "ie >= 10"
+     ]
    }
```

You may then verify the list of browsers via

    npx browserslist

Be aware, that Babel only adds polyfills for [ECMAScript](https://tc39.github.io/ecma262/) methods.
For methods from the Browser API, for example [fetch](https://fetch.spec.whatwg.org/), you need to add the polyfill yourself.

Second, install Babel loader with

    npm i -D babel-loader

and either transpile with

    npx webpack --mode development --module-bind js=babel-loader

or add a Babel loader rule into Webpack configuration:

```diff
    module.exports = {
      entry: './src/index.js',
      output: {
        path: __dirname + '/dist',
        filename: 'main.js'
+     },
+     module: {
+       rules: [
+         {
+           test: /\.js$/,
+           use: ['babel-loader'],
+           exclude: /node_modules/
+         }
+       ]
      }
    }
```

### Transpile React JSX with Babel

First install [React](https://reactjs.org/) as a runtime dependency

    npm i react react-dom

Then install Babels React preset and optionally some plugins (for example class-properties syntax)

    npm i -D @babel/preset-react

and add to the Babel configuration file `.babelrc`

```diff
    {
-     presets: ["@babel/preset-env"]
+     presets: ["@babel/preset-env", "@babel/preset-react"]
    }
```

If you want to use class properties, then install the babel plugin for it:

    npm i -D @babel/plugin-proposal-class-properties

and add into `.babelrc` as plugin:

```diff
    {
      presets: ["@babel/preset-env", "@babel/preset-react"]
+     plugins: ["@babel/plugin-proposal-class-properties"]
    }
```

### Import CSS

The `css-loader` resolves `@import` and `url()` as modules like `import/require()` and returns the CSS code as JavaScript. It doesn't actually do anything with the returned CSS.

The `style-loader` adds the CSS to the DOM by injecting a `<style>` tag on run-time.

    npm i -D style-loader css-loader

First add both loaders into Webpack configuration (loaders are evaluated from right to left):

```diff
    module.exports = {
      entry: './src/index.js',
      output: {
        path: __dirname + '/dist',
        filename: 'main.js'
+     },
+     module: {
+       rules: [
+         {
+           test: /\.css$/,
+           use: ['style-loader', 'css-loader'],
+           exclude: /node_modules/
+         }
+       ]
      }
    }
```

Then import the CSS in the entry file `./src/index.js` like being a module

    import './main.css'

and import subsequent CSS dependencies in `main.css` like so

```diff
+   @import '~bootstrap/dist/css/bootstrap.css';
+   @import './app.css';
```

Injecting CSS as `<style>` tag by JavaScript is performance wise not the best idea - you should load CSS as soon as possible to avoid FOUC and leverage caching. Use the MiniCssExtractPlugin plugin (see below) to extract CSS as a separate file.

### Transpile CSS with SASS and PostCSS

Install loaders, SASS and Autoprefixer with

    npm i -D node-sass autoprefixer
    npm i -D postcss-loader sass-loader

and add a PostCSS configuration `postcss.config.js`

```diff
+   module.exports = {
+     plugins: [
+       require('autoprefixer')()
+     ]
+   };
```

Define the supported browsers in `package.json` like this:

```diff
    {
      "name": "on-webpack",
+     "browserslist": [
+       "last 2 versions",
+       "ie >= 10"
+     ]
    }
```

You may check the supported browsers and CSS prefixes via

    npx browserslist
    npx autoprefixer --info

Then add webpack loaders to `webpack.config.js`

```diff
    module.exports = {
      entry: './src/index.js',
      output: {
        path: __dirname + '/dist',
        filename: 'main.js'
      },
      module: {
        rules: [
          {
-           test: /\.css$/,
+           test: /\.scss$/,
-           use: ['style-loader', 'css-loader'],
+           use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
            exclude: /node_modules/
          }
        ]
      }
    }
```

Using SASS allows to import selective Bootstrap components. If you for example only want to use the button component, then import the following in `main.css`:

```diff
-   @import '~bootstrap/dist/css/bootstrap.css';
+   @import '~bootstrap/scss/functions';
+   @import '~bootstrap/scss/variables';
+   @import '~bootstrap/scss/mixins';
+   @import '~bootstrap/scss/buttons';
+   @import '~bootstrap/scss/button-group';

    @import './variables';
    @import './app';
```

### Export into separate files

As an alternative to the **HTMLWebpackPlugin** or the **mini-css-extract-plugin** you can alos use a combination of the **file-loader** and the **extract-loader**.

```diff
    {
      test: /\.html$/,
      use: ['file-loader?name=[name].[ext]', 'extract-loader', 'html-loader'],
    }
```

---

## Webpack Plugins

### Create HTML index file for bundled modules

The **HtmlWebpackPlugin** creates a new `index.html` file and add script tags for each resulting bundle. It also supports templating syntax and is highly configurable.

If you have any CSS assets (for example, CSS extracted with the MiniCssExtractPlugin) then these will be included with `<link>` tags in the HTML head.

Install plugin with

    npm i -D html-webpack-plugin

and add to `webpack.config.js`:

```diff
+   const HtmlWebpackPlugin = require('html-webpack-plugin')
    module.exports = {
+     plugins: [
+       new HtmlWebpackPlugin()
+     ]
    }
```

In case you need a specific HTML file, for example with a React application container element `<div id="app"></div>`, then create a template file `./src/index.html` and reference in Webpack config:

```diff
    const HtmlWebpackPlugin = require('html-webpack-plugin')
    module.exports = {
      plugins: [
-       new HtmlWebpackPlugin()
+       new HtmlWebpackPlugin({
+         template: './src/index.html'
+       })
      ]
    }
```

### Extract CSS into separate files

The **mini-css-extract-plugin** extracts CSS into separate files. It creates a CSS file per JS file which contains CSS. It supports on-demand-loading of CSS and source-maps.

    npm i -D mini-css-extract-plugin

**MiniCssExtractPlugin** includes a loader `MiniCssExtractPlugin.loader` (to be replaced with `style-loader`) that marks the assets to be extracted. Then a plugin performs its work based on this annotation.

If the CSS is not a JavaScript dependency, then add as an entry.

```diff
+   const MiniCssExtractPlugin = require("mini-css-extract-plugin")
    module.exports = {
-     entry: './src/index.js',
+     entry: [
+       './src/index.js',
+       './src/main.scss'
+     ]
      output: {
        path: __dirname + '/dist',
        filename: 'main.js'
      },
      module: {
        rules: [
          {
            test: /\.scss$/,
-           use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
+           use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
            exclude: /node_modules/
          }
        ]
      },
+     plugins: [
+       new MiniCssExtractPlugin({
+         filename: "[name].css"
+       })
+     ]
    }
```

In combination with the **HtmlWebpackPlugin**, a `<link rel="stylesheet" href="...">` tag is renderd in the extracted `ìndex.html`.

To fully manage styles outside of JavaScript, glob the CSS files through an entry like this:

```
    entry: {
      style: glob.sync("./src/**/*.css")
    }
```

### Hot Module Replacement

Hot Module Replacement (HMR) allows modules to be updated at runtime without the need for a full refresh and without loosing current state.

HMR can only work with loaders that implement and understand HMR API, for example **style-loader**, **react-hot-loader**, etc. HMR is not supported by **MiniCssExtractPlugin.loader**.

You need to use Webpack via webpack-dev-server and it should oly be used for development.

#### Setup

Update the **webpack-dev-server** configuration and use Webpacks built in HMR plugin in `webpack.config.dev.js`:

```diff
    const merge = require('webpack-merge')
    const base = require('./webpack.config')
+   const webpack = require('webpack')

    module.exports = merge(base, {
      mode: 'development',
      devtool: 'source-map',
      devServer: {
        port: 9000,
        disableHostCheck: true,
+       hot: true
      },
+     plugins: [
+       new webpack.HotModuleReplacementPlugin()
+     ]
    })
```

Alternatively, just use the `--hot` option of the **webpack-dev-server** CLI

    npx webpack-dev-server --hot

#### React Setup

Install **react-hot-loader**

    npm i -D react-hot-loader

and add to `.babelrc`:

```diff
    {
      plugins: [
        '@babel/plugin-proposal-class-properties',
+       'react-hot-loader/babel'
      ]
    }
```

Then mark your root component `./src/App.js` as hot-exported:

```diff
    import React from 'react'
+   import { hot } from 'react-hot-loader/root'

    class App extends React.Component {
      ...
    }

-   export default App
+   export default hot(App)
```

---

## Webpack Tools

### Manage multiple configurations

Extend a base configuration with `webpack-merge`:

    npm i -D webpack-merge

Remove build specific configuration from base

```diff
    module.exports = {
-     mode: 'production',
      entry: './src/index.js',
      output: {
        path: __dirname + '/dist',
        filename: 'main.js'
      }
    }
```

and create environment specific configurations like `webpac.config.dev.js`

```diff
+   const merge = require('webpack-merge')
+   const base = require('./webpack.config')
+   module.exports = merge(base, {
+     mode: 'development',
+     devtool: 'source-map'
+   })
```

Then build with

    npx webpack --config webpack.config.dev.js

### Webpack Development Server

Install with

    npm i -D webpack-dev-server

and replace `webpack --watch` in the npm script

```diff
{
  "name": "on-webpack",
  "scripts": {
-   "dev": "webpack --watch --config webpack.config.dev.js",
+   "dev": "webpack-dev-server --open --config webpack.config.dev.js",
    "build": "webpack --config webpack.config.prod.js"
  }
}

```

or use the CLI with

    npx webpack-dev-server

The dev server can be extended using the key `devServer` in the webpack configuration:

```diff
    module.exports = {
      mode: 'development',
+     devServer: {
+       port: 9000,
+       disableHostCheck: true,
+       headers: {
+         "Access-Control-Allow-Origin": "*"
+       }
+     }
    }
```

Webpack-dev-server does **life-reloading**: the browser is refreshed immediately each time there is a code change. This is a different concept compared to HMR.

### Debugging Webpack

Either use the CLI debugger with

    node inspect node_modules/.bin/webpack --config webpack.config.dev.js
    > sb('webpack.config.js', 3)
    > c

or use VS Code with the following **Launch Configuration**:

```json
    "launch": {
      "configurations": [{
        "type": "node",
        "request": "launch",
        "name": "Launch Webpack",
        "program": "${workspaceFolder}/node_modules/webpack/bin/webpack.js"
      }]
    }
```

Optionally add `args` or `env` like this:

```diff
    "launch": {
      "configurations": [{
        "type": "node",
        "request": "launch",
        "name": "Launch Webpack",
        "program": "${workspaceFolder}/node_modules/webpack/bin/webpack.js",
+       "args": [
+         "--config", "./some/dir/webpack.config.js"
+       ],
+       "env" : { 
+         "NODE_ENV" : "production"
+       }
      }]
    }
```


### Inspect Webpack bundle

- [ ] https://medium.com/@joeclever/three-simple-ways-to-inspect-a-webpack-bundle-7f6a8fe7195d

### inspectpack(1)

https://github.com/FormidableLabs/inspectpack
