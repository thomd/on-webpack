import React from 'react'
import ReactDOM from 'react-dom'
import '@babel/polyfill'
import App from './App'

// react application
ReactDOM.render(<App/>, document.getElementById('app'))

// example for dynamic module import
setTimeout(function () {
  import('./lazy').then(({default: message}) => console.log(message))
}, 2000)
