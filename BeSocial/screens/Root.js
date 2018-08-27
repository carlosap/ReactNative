import React from 'react';
import { AsyncStorage } from 'react-native'
import { connect } from 'react-redux';
import { ApplicationScreen } from '../routes'
import { enableOnboarded } from '../actions/main';

import * as keys from '../constants/storageKeys';

class Root extends React.Component {

  goToApp = () => {
    AsyncStorage.setItem(keys.ONBOARDED, 'true')
    this.props.enableOnboarded()
  }

  render() {
    const { onboarded } = this.props;

    if(!onboarded) return <ApplicationScreen.Login />
    //if(!onboarded) return <ApplicationScreen.Welcome onPress={this.goToApp} />

    return (
        <ApplicationScreen.MapAndEvents />
    );
  }
}

function mapStateToProps(state) {
  return {
    onboarded: state.main.navigation.onboarded,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    enableOnboarded : (onboarded) => dispatch(enableOnboarded(onboarded)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);