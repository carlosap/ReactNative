import React, { Component } from 'react';
import { View,Text,StyleSheet,Button } from 'react-native'
import { connect } from 'react-redux';
import { disableOnboarded } from '../actions/main';

class MapScreen extends Component {

  render() {
    
    return (
      <View style={styles.container}>
        <Text>the value is ({this.props.onboarded ? "true" : "false"})</Text>
        <Button title="Go To Login Screen" onPress={()=> this.props.disableOnboarded()} />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    onboarded: state.main.navigation.onboarded
  }
}

function mapDispatchToProps(dispatch) {
  return {
    disableOnboarded : (onboarded) => dispatch(disableOnboarded(onboarded)),
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
