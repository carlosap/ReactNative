import React, { Component } from 'react';
import { View,Text,StyleSheet,Button } from 'react-native'
import { connect } from 'react-redux';
import { updateScreen } from '../actions/main';

class MapScreen extends Component {

  render() {
    
    return (
      <View style={styles.container}>
        <Text>the value is ({this.props.screen})</Text>
        <Button title="Go To Login Screen" onPress={()=> this.props.updateScreen('Login')} />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    screen: state.main.navigation.screen
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateScreen: (screen) => dispatch(updateScreen(screen)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
