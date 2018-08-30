import React from 'react';
import { AsyncStorage } from 'react-native'
import { connect } from 'react-redux';
import { ApplicationScreen } from '../routes'
import { updateScreen } from '../actions/main';
import * as keys from '../constants/storageKeys';
class Root extends React.Component {

  goToApp = () => {
    AsyncStorage.setItem(keys.ONBOARDED, 'true')
    this.props.updateScreen('Main');
  }

  render() {
    const { screen } = this.props;
    if(screen === 'Login') return <ApplicationScreen.Login />
    if(screen === 'Welcome') return <ApplicationScreen.Welcome onPress={this.goToApp} />
    return (
        <ApplicationScreen.MapAndEvents />
    );
  }
}

function mapStateToProps(state) {
  return {
    screen: state.main.navigation.screen,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateScreen : (screen) => dispatch(updateScreen(screen)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);