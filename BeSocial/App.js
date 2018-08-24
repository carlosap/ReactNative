import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Root from './screens/Root';
import reducer from './reducers';
const store = createStore(reducer)

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}
export default App;
