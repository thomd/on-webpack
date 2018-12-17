# on-webpack

Notes on using Webpack 4

## Basic Setup without configuration file

    npm init -y
    npm i -D webpack webpack-cli

The **default entry point** is `./src/index.js`

The **default output file** is `./dist/main.js`

### Development Mode

Development mode is optimized for speed and creates an un-minified bundle:

    npx webpack --mode development

### Production Mode

Production mode enables optimizations out of the box, including minification, scope hoisting, tree-shaking and more:

    npx webpack --mode production

## Tree shaking

Tree shaking is a term commonly used in the JavaScript context for dead-code elimination. It relies on the static structure of ES2015 module syntax, i.e. `import` and `export`.

### Example

The example code (using a ES2015 modules verison of lodash)

    import { capitalize } from 'lodash-es'
    console.log(capitalize('default entry point'))

compiles to a `main.js` file size of `1.41 MB` on development mode and `3.26 KB` on production mode.

The example code (using a CommonJS modules verison of lodash)

    var capitalize = require('lodash/capitalize')
    console.log(capitalize('default entry point'))

compiles to a `main.js` file size of `27.4 KB` on development mode and `3.9 KB` on production mode.

