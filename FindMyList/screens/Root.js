import React, { Component } from 'react'
import { View, AsyncStorage, Text } from 'react-native'

import WelcomeScreen from './Welcome'
import { ApplicationScreen } from '../routes'
import * as keys from '../constants/storageKeys'

class Root extends Component {
  constructor() {
    super()
    this.state = { onboarded: false, loading: true }
    this.goToApp = this.goToApp.bind(this)
  }

  componentWillMount() {
    AsyncStorage.getItem(keys.ONBOARDED).then(data => {
      if(data) this.setState({ onboarded: true })
      this.setState({ loading: false })
    })
  }

  goToApp() {
    AsyncStorage.setItem(keys.ONBOARDED, 'true')
    this.setState({ onboarded: true })
  }

  render() {
    const { onboarded, loading } = this.state

    if(loading)    return null
    if(!onboarded) return <WelcomeScreen onPress={this.goToApp} />

    return (
      <View style={styles.wrapper}>
        <ApplicationScreen />
      </View>
    )
  }
}

const styles = {
  wrapper: {
    flex: 1
  }
}

export default Root