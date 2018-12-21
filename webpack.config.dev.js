const merge = require('webpack-merge')
const base = require('./webpack.config')

module.exports = merge(base, {
  mode: 'development',
  devServer: {
    port: 9000,
    disableHostCheck: true
  }
})
