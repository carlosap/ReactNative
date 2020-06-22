import React from 'react';
import {TouchableOpacity, Text } from 'react-native';
import { Colors } from "./../../styles";

const Button = ({style = {}, textStyle = {}, label, onPress = () => {}}) => {

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.default, style]}
      activeOpacity={0.6}>
      <Text style={[styles.buttonText, textStyle]}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = {
  default: {
    backgroundColor: Colors.white,
    borderRadius: 5,
    paddingVertical: 20,
    paddingHorizontal: 50,
  },
  buttonText: {
    fontSize: 22,
    color: Colors.primaryLightColor
    // fontFamily: 'Arial'
  }
}

export default Button