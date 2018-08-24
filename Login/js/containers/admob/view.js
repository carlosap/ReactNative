import React from 'react'
import styles from './styles'
import { View, Image, ScrollView, Text } from 'react-native'
import { Input, Link, Form, ImagePicker } from '@core-components'
import Icon from '@expo/vector-icons/Ionicons'
import back from '../../../assets/back-pink.png'
import { Button } from 'antd-mobile'
import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded
} from 'expo'
import { Admob } from '../../config'

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
                    <View style={[styles.adMob]}>
                        {
                            (adUnits || []).map((ad, index) => {
                                switch (ad.type) {
                                    case 'banner':
                                        return (
                                            <View key={index} style={[styles.banner]}>
                                                <AdMobBanner
                                                    bannerSize={ad.bannerSize || 'fullBanner'}
                                                    adUnitID={ad.unitId}
                                                    testDeviceID="EMULATOR"
                                                    onDidFailToReceiveAdWithError={this.bannerError}/>
                                            </View>
                                        )
                                    case 'interstitial' :
                                        return (
                                            <View key={index} style={[styles.item]}>
                                                <Button
                                                        onClick={this.showInterstitialAd.bind(this, ad)}>
                                                    <Text style={[styles.text]}>Show Interstitial Ad</Text>
                                                </Button>
                                            </View>
                                        )
                                    case 'rewarded' :
                                        return (
                                            <View key={index} style={[styles.item]}>
                                                <Button onClick={this.showRewardedAd.bind(this, ad)}>
                                                    <Text style={[styles.text]}>Show Rewarded Ad</Text>
                                                </Button>
                                            </View>
                                        )
                                }
                            })
                        }

                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
module.exports = view
