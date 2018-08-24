import React from 'react'
import styles from './styles'
import { View, Image, ScrollView, Text } from 'react-native'
import lock from '../../../assets/lock.png'
import { Button, Toast } from 'antd-mobile'
import Icon from '@expo/vector-icons/Ionicons'
import back from '../../../assets/back-pink.png'
import { Link } from '@core-components'
import { recordScreenTransition, trackEvent } from '../../utils/analytics'
import Hyperlink from 'react-native-hyperlink'
var view = function () {
    const {translate} = this.props

    return (
        <View style={[styles.container]}>
            <View style={[styles.backBtn]}>
                <Link link="home">
                    <View style={[styles.backLink]}>
                        <Image source={back}
                               style={[styles.backIcon]}/>
                    </View>
                </Link>
            </View>
            <ScrollView>
                <View style={[styles.content]}>
                    <View style={[styles.analytics]}>
                        <View style={[styles.item]}>
                            <Button onClick={() => {
                                trackEvent('Test Event', {
                                    'description': 'Test Event by Arivaa Firebase'
                                })
                                Toast.success('Event Fired Successfully')
                            }}>
                                <Text style={[styles.text]}>Fire Test Event</Text>
                            </Button>
                        </View>
                        <View style={[styles.item]}>
                            <Button onClick={() => {
                                recordScreenTransition('Analytics Screen', {
                                    'description': 'Analytics Screen transition by Arivaa Firebase'
                                })
                                Toast.success('Screen Transition Fired Successfully')
                            }}>
                                <Text style={[styles.text]}>Fire Screen Transition</Text>
                            </Button>
                        </View>
                        <View style={[styles.message]}>

                            <Text style={[styles.label]}>For Checking Data</Text>
                            <Hyperlink linkDefault={ true } linkStyle = {{color: '#2980b9'}}>
                            <Text style={[styles.info]}>Visit : https://app.segment.com</Text>
                            </Hyperlink>
                        </View>
                        <View style={[styles.message]}>
                            <Text style={[styles.label]}>Use this Credentials</Text>
                            <Text style={[styles.info]}>Email : inderdeep.singh@laxaar.com</Text>
                            <Text style={[styles.info]}>Password : Arivaa@123</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
module.exports = view
