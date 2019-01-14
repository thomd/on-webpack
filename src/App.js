import React from 'react'
import Header from './Header'
import { hot } from 'react-hot-loader/root'

const Warning = React.lazy(() => import('./Warning'))

class App extends React.Component {
  state = {
    count: 0
  }

  increment = () => this.setState(state => ({count: state.count + 1}))
  decrement = () => this.setState(state => ({count: state.count - 1}))

  render() {
    const { count } = this.state
    return (
      <div>
        <Header/>
        <span>Count: {count}</span>
        <div className="btn-group mx-3">
          <button className="btn btn-light" onClick={this.increment}>count up</button>
          <button className="btn btn-light" onClick={this.decrement}>count down</button>
        </div>
        { count > 4 ?
          <React.Suspense fallback={null}>
            <Warning />
          </React.Suspense> :
          null }
      </div>
    )
  }
}

export default hot(App)
