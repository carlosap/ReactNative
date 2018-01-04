import React from 'react'
import { Image } from 'react-native'

const logo = require('../images/tudu-logo.png')

const Logo = (props) => {
  return (
    <Image {...props} source={logo} />
  )
}

export default Logo