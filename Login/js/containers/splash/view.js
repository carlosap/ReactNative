import React from 'react';
import styles from './styles';
import {View, Text, Image, ScrollView} from 'react-native';
import {Input, Link, Form, ModalTrigger, SocialSignIn} from '@core-components';
import {List, Button} from 'antd-mobile';
import logo from '../../../assets/logo.png';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

/**
 * Returns the JSX Markup for the view
 * @returns {XML}
 */


var view = function () {
    const {navigation} = this.props;
    return (
        <View style={[styles.container]}>
            <ScrollView>
                <View style={[styles.logoContainer]}>
                    <Image
                        resizeMode="contain"
                        source={logo}
                        style={[styles.logo]}
                    />
                </View>
                <View style={[styles.language]}>
                    <Text style={[styles.label]}>Select App Language</Text>
                    <RadioForm
                        ref = "radioForm"
                        radio_props={this.radio_props}
                        initial={0} //Index of selected language
                        labelHorizontal={true}
                        formHorizontal={true}
                        buttonColor={'#fff'}
                        selectedButtonColor = {"#fff"}
                        selectedLabelColor = {"#fff"}
                        buttonInnerColor={'#fff'}
                        buttonOuterColor={'#fff'}
                        labelColor={'#fff'}
                        labelStyle={{marginRight:15}}
                        buttonSize={15}
                        animation={true}
                        onPress={this.switchLanguage.bind(this)}
                    />
                </View>
                <View style={[styles.form]}>
                    <List styles={{
                        Body: styles.list
                    }}>
                        <Button onClick = {()=>{navigation.navigate("login")}} type="default" style={[styles.button]}>
                            <Text style={[styles.buttonText]}>
                                Get Started
                            </Text>
                        </Button>
                    </List>
                </View>
            </ScrollView>
        </View>
    )
};

module.exports = view;
