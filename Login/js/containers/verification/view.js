import React from 'react';
import styles from './styles';
import {View, Text, Image, ScrollView} from 'react-native';
import {Input, Link, Form, ModalTrigger, SocialSignIn} from '@core-components';
import {List, InputItem, Button} from 'antd-mobile';
import logo from '../../../assets/logo-basic-hr.png';
import lock from '../../../assets/lock.png';
import back from '../../../assets/back.png';
import {getInputStyle} from '../../utils/antd'

/**
 * Returns the JSX Markup for the view
 * @returns {XML}
 */
var view = function () {
    const {number} = this.validations;
    const {translate} = this.props;
    const formElements = [
        {
            type: "number",
            name: "otp",
            inputProps: {
                clear: true,
                placeholder: translate("common.verification.placeholder"),
                labelNumber: 1.5,
                style: [styles.input],
                placeholderTextColor: "#fff",
                styles : getInputStyle({
                    input : {
                        color : "#fff"
                    }
                }),
                children: (
                    <Image
                        resizeMode="contain"
                        source={lock}
                        style={[styles.inputIcon]}
                    />
                )
            },
            options: number
        }
    ];
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
                <Text style={[styles.pageTitle]}>{translate("verification.title")}</Text>
                <Text style={[styles.message]}>{translate("verification.message")}</Text>
                <Form
                    elements={formElements}
                    style={{
                        Body: styles.list
                    }}
                    onSubmit = {this.onSubmit.bind(this)}
                    submitTrigger={{
                        buttonProps: {
                            style: styles.button
                        },
                        textProps: {
                            style: styles.buttonText
                        },
                        text : translate("verification.submit")
                    }}
                >

                </Form>
            </ScrollView>
        </View>
    )
};

module.exports = view;
