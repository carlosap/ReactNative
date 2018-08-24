import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button
} from 'react-native'

class LoginScreen extends Component {

  // Remove the Header of the App
  static navigationOptions = {
    header: null
  }
  
  render() {

    return (
      <View style={styles.container}>
      <Button title="Go To Home Screen" onPress={()=>this.props.navigation.navigate('Home')} />
      </View>
    );
  }
}


export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});