import React from 'react'
import {
  TouchableOpacity, Text
} from 'react-native'

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
    backgroundColor: 'white',
    borderRadius: 5,
    paddingVertical: 20,
    paddingHorizontal: 50,
  },
  buttonText: {
    fontSize: 22,
    color: '#00d2ff',
    fontFamily: 'Karla'
  }
}

export default Button