import React from 'react';
import styles, {stylesObj} from './styles';
import {View, Text, ScrollView, Image, WebView} from 'react-native';
import {Input, Button, Link, Form, ImagePicker, Modal, CountryCodePicker} from '@core-components';
import Icon from '@expo/vector-icons/Ionicons';
import back from '../../../assets/back-pink.png';
import InputItemStyle from 'antd-mobile/lib/input-item/style/index.native';
import CustomWebView from '../../components/CustomWebView';

/**
 * View
 * @returns {XML}
 */
var view = function () {
    const {name, email, phone, countryCode} = this.validations;
    const {translate} = this.props;
    const {profileImage, confirmOtp, renderRecaptcha} = this.state;
    console.log(renderRecaptcha)
    const formElements = [
        {
            type: "text",
            name: "name",
            inputProps: {
                clear: true,
                placeholder: translate("common.name.placeholder"),
                labelNumber: 1.5,
                style: [styles.input],
                styles: {
                    ...InputItemStyle,
                    input: {
                        ...InputItemStyle.input,
                        fontSize: 14
                    }
                },
                placeholderTextColor: "#555",
                children: (
                    <Icon
                        name={"ios-person-outline"}
                        size={25}
                        style={[styles.inputIcon]}/>
                )
            },
            before: (
                <Text style={[styles.fieldLabel]}>{translate("common.name.title")} *</Text>
            ),
            options: name
        },
        {
            type: "email",
            name: "email",
            inputProps: {
                clear: true,
                placeholder: translate("common.email.placeholder"),
                labelNumber: 1.5,
                style: [styles.input],
                styles: {
                    ...InputItemStyle,
                    input: {
                        ...InputItemStyle.input,
                        fontSize: 14
                    }
                },
                placeholderTextColor: "#555",
                children: (
                    <Icon
                        name={"ios-mail-outline"}
                        size={25}
                        style={[styles.inputIcon]}/>
                )
            },
            before: (
                <Text style={[styles.fieldLabel]}>{translate("common.email.title")} *</Text>
            ),
            options: email
        },
        {
            name: "countryCode",
            customElement: (
                <CountryCodePicker
                    style={{
                        value: stylesObj.countryCodeValue,
                        listItem: stylesObj.countryCode
                    }}
                />
            ),
            before: (
                <Text style={[styles.fieldLabel]}>{translate("common.countryCode.title")}</Text>
            ),
            options: countryCode
        },
        {
            type: "number",
            name: "phone",
            inputProps: {
                clear: true,
                placeholder: translate("common.phone.placeholder"),
                labelNumber: 1.5,
                style: [styles.input],
                styles: {
                    ...InputItemStyle,
                    input: {
                        ...InputItemStyle.input,
                        fontSize: 14
                    }
                },
                placeholderTextColor: "#555",
                children: (
                    <Icon
                        name={"ios-call-outline"}
                        size={25}
                        style={[styles.inputIcon]}/>
                )
            },
            before: (
                <Text style={[styles.fieldLabel]}>{translate("profile.phone")}</Text>
            ),
            after: (
                <Text style={[styles.message]}>{translate("profile.phoneVerification")}</Text>
            ),
            options: phone
        }
    ];

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
                <View style={[styles.form]}>
                    <View style={[styles.imageBox]}>
                        <Image source={profileImage} style={[styles.image]}/>
                        <ImagePicker
                            onImageSelected={this.changeImage.bind(this)}
                        >
                            <Link style={[styles.changeImageLink]}>
                                <Text style={[styles.text]}><Icon type="ionicons"
                                                                  name='md-create'/> {translate("profile.changeImage")}
                                </Text>
                            </Link>
                        </ImagePicker>
                    </View>
                    <Form
                        elements={formElements}
                        style={{
                            Body: styles.list
                        }}
                        onSubmit={this.onSubmit.bind(this)}
                        submitTrigger={{
                            buttonProps: {
                                style: styles.button
                            },
                            textProps: {
                                style: styles.buttonText
                            },
                            text: translate("profile.save")
                        }}
                    >
                    </Form>
                </View>
            </ScrollView>
            <Modal contentProps={{onVerify: this.verifyOtp.bind(this)}} modalId="verification" visible={confirmOtp}/>
            <CustomWebView
                visible={renderRecaptcha}
                scriptId="recaptcha"
                onSuccess={this.parseRecaptcha.bind(this)}
                onHide={() => {
                    this.setState({renderRecaptcha: false})
                }}
                onFailMessage={translate("common.error.invalidCaptcha")}
                reloadOnFail={true}
            />
        </View>
    )
}
module.exports = view;
