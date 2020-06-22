import React from 'react';
import _ from "lodash";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { ThemeProvider } from "nachos-ui";
import Root from './screens/Root';
import reducer from './reducers';
import { Platform } from 'react-native';
import { Asset } from 'expo-asset';

Asset;
const store = createStore(reducer)

if (Platform.OS === 'android') {
  require('intl');
  require('intl/locale-data/jsonp/fr-BE');
  require('intl/locale-data/jsonp/nl-BE');
  require('intl/locale-data/jsonp/it-IT');
}

class App extends React.Component {
  render() {
    return (
      <ThemeProvider>
        <Provider store={store}>
          <Root />
        </Provider>
      </ThemeProvider>

    );
  }
}
export default App;