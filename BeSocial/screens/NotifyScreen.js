import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button
} from 'react-native'

class NotifyScreen extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Text>Notifications Page</Text>
      </View>
    );
  }
}

export default NotifyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});