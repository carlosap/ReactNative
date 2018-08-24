import React from 'react'
import { Image } from 'react-native'

const logo = require('../assets/logo.png')

const Logo = (props) => {
  return (
    <Image {...props} source={logo} />
  )
}

export default Logo