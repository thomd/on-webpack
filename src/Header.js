import React from 'react'
import logo from '!url-loader?limit=10000!./webpack.png'

class Header extends React.Component {
  render() {
    return (
      <header className="page-header">
        <img src={logo} />
        <h1>Hello Webpack</h1>
      </header>
    )
  }
}

export default Header


