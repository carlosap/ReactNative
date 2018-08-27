import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View,StyleSheet,Button, Text } from 'react-native'
import { enableOnboarded } from '../actions/main';

class HomeScreen extends Component {
  
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>the value is ({this.props.onboarded ? "true" : "false"})</Text>
        <Button title="Goto Main" onPress={() => this.props.enableOnboarded()} />
      </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});