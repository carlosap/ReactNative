import React, { Component } from 'react'
import { View,Text,Image, AsyncStorage, Dimensions } from 'react-native'
import Swiper from 'react-native-swiper'
import Logo from '../components/Logo'
import Button from '../components/Button'

const { width, height } = Dimensions.get('window')
const splashes = [
  require('../assets/welcome/6.jpg'),
  require('../assets/welcome/7.jpg'),
  require('../assets/welcome/8.jpg'),
]

class Welcome extends Component {
  constructor() {
    super()
  }

  render() {
    const swiperConfig = {
      loop: false,
      showsButtons: false,
      dot: <View style={styles.dot} />,
      activeDot: <View style={[styles.dot, styles.activeDot]} />
    }

    return (
      <Swiper style={styles.wrapper} {...swiperConfig}>
        <View style={styles.slide}>
          <Image style={styles.image} source={splashes[0]} />
          <Text style={styles.text}>Welcome to (change may logo)</Text>
          <Logo style={styles.logo} />
        </View>

        <View style={styles.slide}>
          <Image style={styles.image} source={splashes[1]} />
          <Text style={styles.text}>{`Be Social \nYou get to meet cool people.`}</Text>
        </View>

        <View style={styles.slide}>
          <Image style={styles.image} source={splashes[2]} />
          <Text style={styles.text}>{`I will find the love of my life\nBeSocial`}</Text>
          <Button onPress={this.props.onPress} label='Get started now' style={styles.buttonStyle} />
        </View>
      </Swiper>
    )
  }
}

const styles = {
  wrapper: {
  },
  slide: {
    flex: 1,
    alignItems: 'center'
  },
  image: {
    resizeMode: 'cover',
    width,
    height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  logo: {
    width: '70%',
    resizeMode: 'contain',
  },
  text: {
    color: '#fff',
    fontFamily: 'Karla-Regular',
    fontSize: 30,
    marginTop: 190,
    alignSelf: 'center'
  },
  dot: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3
  },
  activeDot: {
    backgroundColor: 'white',
    width: 12,
    height: 12,
    borderRadius: 6
  },
  buttonStyle: {
    position: 'absolute',
    bottom: 80
  }
}

export default Welcome