import React, { Component } from 'react'
import { Provider } from 'react-redux'
import Root from './screens/Root'
import store from './store'

class Application extends Component {
  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    )
  }
}

export default Application