const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.config')

module.exports = merge(base, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    port: 9000,
    disableHostCheck: true,
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})
