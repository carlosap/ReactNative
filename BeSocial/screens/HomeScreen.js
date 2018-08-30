import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View,StyleSheet,Button, Text } from 'react-native'
import { updateScreen } from '../actions/main';

class HomeScreen extends Component {
  
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>the value is ({this.props.screen})</Text>
        <Button title="Goto Main" onPress={() => this.props.updateScreen('Login')} />
      </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});