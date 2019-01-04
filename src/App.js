import React from 'react'
import { hot } from 'react-hot-loader/root'

class App extends React.Component {
  state = {
    count: 0
  }
  render() {
    return (
      <div>
        <h1>Hello World</h1>
        <h2>Count: {this.state.count}</h2>
        <div className="btn-group">
          <button className="btn btn-light" onClick={() => this.setState(state => ({count: state.count + 1}))}>count up</button>
          <button className="btn btn-light" onClick={() => this.setState(state => ({count: state.count - 1}))}>count down</button>
        </div>
      </div>
    )
  }
}

export default hot(App)
