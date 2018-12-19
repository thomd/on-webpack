# on-webpack

Notes on using Webpack 4

## Basic Setup without configuration file

    npm init -y
    npm i -D webpack webpack-cli

The **default entry point** is `./src/index.js`

The **default output file** is `./dist/main.js`

Build in **Development mode** for optimized speed and an un-minified bundle:

    npx webpack --mode development

Build in **Production mode** to enable optimizations out of the box, including minification, scope hoisting, tree-shaking and more:

    npx webpack --mode production

> Tree shaking is a term commonly used in the JavaScript context for dead-code elimination. It relies on the static structure of ES2015 module syntax, i.e. `import` and `export`.

## Basic Setup with configuration file

Create a `webpack.config.js` file (using default settings)

    module.exports = {
      mode: 'production',
      entry: './src/index.js',
      output: {
        path: __dirname + '/dist',
        filename: 'main.js'
      }
    }

and run

    npx webpack

In order to create multiple bundles, export multiple configs in an array like this:

    module.exports = [config1, config2]

## Webpack Loaders

Without any loader, Webpack is basically a bundler for javascript modules (ESM and CommonJS) which adds
bootstrap code for module loading.

### Transpile Javascript with Babel

Install dependencies

    npm i -D @babel/core @babel/cli @babel/preset-env
    npm i -D babel-loader

and inspect transpiled code via

    npx babel ./srcindex.js --presets=@bable/preset-env

Extend Webpack configuration with

```
    module.exports = {
      mode: 'production',
      entry: './src/index.js',
      output: {
        path: __dirname + '/dist',
        filename: 'main.js'
-      }
+      },
+      module: {
+        rules: [
+          {
+            test: /\.js$/,
+            loader: 'babel-loader',
+            exclude: /node_modules/,
+            options: {
+              presets: ['@babel/preset-env']
+            }
+          }
+        ]
+      }
    }
```

