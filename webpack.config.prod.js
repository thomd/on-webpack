const merge = require('webpack-merge')
const base = require('./webpack.config')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = merge(base, {
  mode: 'production',
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: __dirname + '/report/index.html'
    })
  ],
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  }
})

