import React from 'react';
import styles from './styles';
import {View, Image, ScrollView, Text} from 'react-native';
import lock from '../../../assets/lock.png';
import {Input, Button, Link, Form, ImagePicker} from '@core-components';
import Icon from '@expo/vector-icons/Ionicons';
import back from '../../../assets/back-pink.png';
import {getInputStyle} from '../../utils/antd';
var view = function () {
    const {password, cpassword,currentPassword} = this.validations;
    const {user, translate} = this.props;
    const formElements = [
        {
            type: "password",
            name: "currentPassword",
            inputProps: {
                clear: true,
                placeholder: translate("changePassword.oldPassword"),
                labelNumber: 1.5,
                style: [styles.input],
                placeholderTextColor: "#555",
                styles : getInputStyle({
                    input : {
                        color : "#555"
                    }
                }),
                children: (
                    <Icon
                        name={"ios-lock-outline"}
                        size={25}
                        style={[styles.inputIcon]}/>
                )
            },
            before: (
                <Text style={[styles.fieldLabel]}>{translate("changePassword.oldPassword")} *</Text>
            ),
            options: currentPassword
        },
        {
            type: "password",
            name: "password",
            inputProps: {
                clear: true,
                placeholder: translate("common.password.placeholder"),
                labelNumber: 1.5,
                style: [styles.input],
                placeholderTextColor: "#555",
                styles : getInputStyle({
                    input : {
                        color : "#555"
                    }
                }),
                children: (
                    <Icon
                        name={"ios-lock-outline"}
                        size={25}
                        style={[styles.inputIcon]}/>
                )
            },
            before: (
                <Text style={[styles.fieldLabel]}>{translate("changePassword.password")} *</Text>
            ),
            options: password
        },
        {
            type: "password",
            name: "cpassword",
            inputProps: {
                clear: true,
                placeholder: translate("common.confirmPassword.placeholder"),
                labelNumber: 1.5,
                style: [styles.input],
                placeholderTextColor: "#555",
                styles : getInputStyle({
                    input : {
                        color : "#555"
                    }
                }),
                children: (
                    <Icon
                        name={"ios-lock-outline"}
                        size={25}
                        style={[styles.inputIcon]}/>
                )
            },
            before: (
                <Text style={[styles.fieldLabel]}>{translate("changePassword.confirm")} *</Text>
            ),
            options: cpassword
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
                <View style={[styles.content]}>
                    <View style={[styles.form]}>
                        <Text style={[styles.label]}>{translate("changePassword.title")}</Text>
                        <Text style={[styles.noCurrentPassword]}>{translate("changePassword.noCurrentPassword")}</Text>
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
                                text : translate("changePassword.submit")
                            }}
                        >
                        </Form>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
module.exports = view;
