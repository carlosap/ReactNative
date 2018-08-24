import React from 'react'
import styles from './styles'
import { View, Image, ScrollView, Text } from 'react-native'
import lock from '../../../assets/lock.png'
import { Input, Link, Form, ImagePicker } from '@core-components'
import Icon from '@expo/vector-icons/Ionicons'
import back from '../../../assets/back-pink.png'
import { Button } from 'antd-mobile'

var view = function () {
    const {translate} = this.props
    const {token, notification} = this.state

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
                    <View style={[styles.pushNotifications]}>

                        <View style={[styles.message]}>
                            <Text style={[styles.label]}>Please Note</Text>
                            <Text style={[styles.info]}>You will have to exit from the app since notifications are only
                                shown when app is backgrounded</Text>
                        </View>
                        <View style={[styles.item]}>
                            <Button onClick={this.scheduleLocalNotification.bind(this)}>
                                <Text style={[styles.text]}>Local Notification - Notify after 5 seconds</Text>
                            </Button>
                        </View>
                        <View style={[styles.item]}>
                            <Button onClick={this.registerForExpoNotification.bind(this)}>
                                <Text style={[styles.text]}>Receive Notification via expo (Will only work on real device)</Text>
                            </Button>
                            {
                                token ? (
                                    <Text>Send below curl request via command line to receive the demo notification from expo server :
                                        {this.getCurlString()}
                                    </Text>
                                ) : null
                            }
                            {
                                notification ? (
                                    <Text>Received a notification :
                                        {JSON.stringify(notification)}
                                    </Text>
                                ) : null
                            }
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
module.exports = view
