import React from 'react'
import styles from './styles'
import { View, Text, ScrollView, Image, ListView, Alert } from 'react-native'
import { Button, Icon, Link } from '@core-components'
import girl from '../../../assets/girl.jpg'
import back from '../../../assets/back-pink.png'

/**
 * Returns the JSX Markup for the view
 * @returns {XML}
 */
var view = function () {
    const {user, navigation, translate} = this.props
    return (
        <View style={[styles.container]}>

            <ScrollView style={[styles.scrollBox]}>
                {
                    user ? (
                        <View style={[styles.content]}>
                            <View style={[styles.general]}>
                                <View style={[styles.backBtn]}>
                                    <Link link="home">
                                        <View style={[styles.backLink]}>
                                            <Image source={back}
                                                   style={[styles.backIcon]}/>
                                        </View>
                                    </Link>
                                </View>
                                <View style={[styles.editAction]}>
                                    <Link link="editProfile"
                                          style={[styles.button, styles.editBtn]}
                                          textStyle={[styles.buttonText, styles.editText]}>
                                        <Text style={[styles.editIcon]}>{translate('profile.edit')}</Text>
                                    </Link>
                                </View>
                                <View style={[styles.imageBox]}>
                                    <Image source={user.photoURL ? {uri: user.photoURL} : girl}
                                           style={[styles.image]}/>
                                </View>
                                <View style={[styles.userInformation]}>
                                    <View style={[styles.info]}>
                                        <Text style={[styles.label]}>{translate('profile.name')}</Text>
                                        <Text style={[styles.separator]}>:</Text>
                                        <Text style={[styles.value]}>{user.displayName}</Text>
                                    </View>
                                    <View style={[styles.info]}>
                                        <Text style={[styles.label]}>{translate('profile.email')}</Text>
                                        <Text style={[styles.separator]}>:</Text>
                                        <Text style={[styles.value]}>{user.email}</Text>
                                    </View>
                                    <View style={[styles.info]}>
                                        <Text style={[styles.label]}>{translate('profile.phone')}</Text>
                                        <Text style={[styles.separator]}>:</Text>
                                        <Text style={[styles.value]}>{user.phoneNumber}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ) : null
                }

            </ScrollView>
            <View style={[styles.footer]}>

            </View>
        </View>
    )
}
module.exports = view
