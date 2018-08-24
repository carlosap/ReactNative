import React from 'react'
import styles from './styles'
import { View, Image, ScrollView, Text } from 'react-native'
import { Input, Link, Form, ImagePicker } from '@core-components'
import Icon from '@expo/vector-icons/Ionicons'
import back from '../../../assets/back-pink.png'
import { Button } from 'antd-mobile'
import {
    FacebookAds
} from 'expo'
import { Admob } from '../../config'
import NativeAd from './native-ad'

const adsManager = new FacebookAds.NativeAdsManager('513432372363654_568838906823000', 2)
var view = function () {
    const {translate} = this.props
    const {adUnits} = Admob
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
                    <View style={[styles.facebookAds]}>
                        <View style={[styles.section]}>
                            <Text style={[styles.text]}>Below is an example of banner Ad</Text>
                            <View style={[styles.ad]}>
                                <FacebookAds.BannerView
                                    placementId="513432372363654_568836156823275"
                                    type="standard"
                                    onPress={() => console.log('click')}
                                    onError={(err) => console.log('error', err)}
                                />
                            </View>
                        </View>
                        <View style={[styles.section]}>
                            <Text style={[styles.text]}>Interstitial Ad example</Text>
                            <View style={[styles.item]}>
                                <Button
                                    onClick={this.showInterstitialAd.bind(this)}>
                                    <Text style={[styles.text]}>Show Interstitial Ad</Text>
                                </Button>
                            </View>
                        </View>
                        <View style={[styles.section]}>
                            <Text style={[styles.text]}>Below is a Native Ad.Native Ads can be customized to match
                                the design of the app</Text>
                            <View style={[styles.item]}>
                                <NativeAd adsManager={adsManager}/>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
module.exports = view
