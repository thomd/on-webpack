# On Webpack

Some personal notes on using [Webpack 4](https://webpack.js.org/).

In Webpack, everything is a **module**. Not only JavaScript but also everything else (stylesheets, images, markup) can be a module.

Starting from **entry** points, Webpack creates a dependency graph which allows for bundling single or multiple **outputs** so that you just load what you need and when you need it.

With **loaders** you can transform your code before bundling. With **plugins** you can perform subsequent tasks like bundle optimizations (Webpack itself is considered a plugin with one behaviour by default: bundle assets).

Hence, Webpack is basically about **entry**, **output**, **loaders** and **plugins**.

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

```javascript
    module.exports = {
      mode: 'production',
      entry: './src/index.js',
      output: {
        path: __dirname + '/dist',
        filename: 'main.js'
      }
    }
```

and run

    npx webpack

In order to create multiple bundles, export multiple configs in an array like this:

    module.exports = [config1, config2]

### Webpack Options

Run Webpack in **watch mode** with

    npx webpack --watch

---

## Webpack Loaders

Without any loader, Webpack is basically a bundler for javascript modules (ESM and CommonJS) which adds
bootstrap code for module loading.

### Transpile Javascript with Babel

First install [Babel](https://babeljs.io/) dependencies

    npm i -D @babel/core @babel/cli @babel/preset-env

then create a Babel configuration file `.babelrc`

    {
      "presets": ["@babel/preset-env"]
    }

and inspect transpiled code via

    npx babel ./src/index.js

Second, install Babel loader with

    npm i -D babel-loader

and either transpile with

    npx webpack --mode development --module-bind js=babel-loader

or add a Babel loader rule into Webpack configuration:

```diff
    module.exports = {
      mode: 'production',
      entry: './src/index.js',
      output: {
        path: __dirname + '/dist',
        filename: 'main.js'
+     },
+     module: {
+       rules: [
+         {
+           test: /\.js$/,
+           loader: 'babel-loader',
+           exclude: /node_modules/
+         }
+       ]
      }
    }
```

### Transpile React JSX with Babel

First install [React](https://reactjs.org/) as a runtime dependency

    npm i react react-dom

Then install Babels React preset

    npm i -D @babel/preset-react

and add to the Babel configuration file `.babelrc`

```diff
    {
-     "presets": ["@babel/preset-env"]
+     "presets": ["@babel/preset-env", "@babel/preset-react"]
    }
```

---

## Webpack Plugins

---

## Webpack Tools

- [ ] https://medium.com/@joeclever/three-simple-ways-to-inspect-a-webpack-bundle-7f6a8fe7195d

