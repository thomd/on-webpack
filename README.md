# on-webpack

Notes on using Webpack 4

# Basic Setup without configuration file

    npm init -y
    npm i -D webpack webpack-cli

Webpack 4 *default entry point* is `./src/index.js`

Then run

    npx webpack --mode development

This creates the *output file* in `./dist/main.js`
