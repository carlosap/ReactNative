import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button
} from 'react-native'

class EventScreen extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Text>Events Page</Text>
      </View>
    );
  }
}

export default EventScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});