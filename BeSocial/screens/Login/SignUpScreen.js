import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native'
import { Toast } from 'antd-mobile-rn';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import { Colors } from '../../styles';
import Spinner from '../../components/Spinner';
import Link from '../../components/Link';
import Form from '../../components/Form';
import envelope from '../../assets/envelope.png';
import logo from '../../assets/logo.png';
import lock from '../../assets/lock.png';
import person from '../../assets/persongrey.png';
import google from '../../assets/google.png';
import facebook from '../../assets/facebook.png';
import {login, handleSocialSignInError, handleSocialSignIn} from './LoginScreen';

class SignUpScreen extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.setValidations();
    this.login = login.bind(this);
    this.handleSocialSignIn = handleSocialSignIn.bind(this);
    this.handleSocialSignInError = handleSocialSignInError.bind(this);
  }

  setValidations() {
    this.validations = {
      "name": {
        rules: [
          { required: true, message: "Please enter your full name" },
        ],
        //initialValue : "Demo User"
      },
      "email": {
        rules: [
          { required: true, message: "Please enter email" },
          { type: "email", message: "Please enter a valid email" }
        ],
      },
      "password": {
        rules: [
          { required: true, message: "Please enter password" },
          { min: 6, message: "Password should be of minimum 6 characters" }
        ],
      }
    }
  }


  onSubmit(values) {
    const { navigation } = this.props;
    //Spinner.start();
    navigation.navigate('SignExtUp')
    const errorHandler = ((e) => {
      console.log(e);
      if (e.code == 'auth/email-already-in-use') {
        Toast.fail("This email already exists in our system.", 0.5);
      } else {
        Toast.fail("Error while registering your account", 0.5);
      }
    })
  }

  render() {
    const { name, email, password } = this.validations;
    const formElements = [
      {
        type: "text",
        name: "name",
        inputProps: {
          clear: true,
          placeholder: "Enter your full name",
          labelNumber: 1.5,
          style: [styles.input],
          placeholderTextColor: "#fff",
          children: (
            <Image
              resizeMode="contain"
              source={person}
              style={[styles.inputIcon]}
            />
          )
        },
        options: name
      },
      {
        type: "email",
        name: "email",
        inputProps: {
          clear: true,
          placeholder: "Enter Email",
          labelNumber: 1.5,
          style: [styles.input],
          placeholderTextColor: "#fff",
          children: (
            <Image
              resizeMode="contain"
              source={envelope}
              style={[styles.inputIcon]}
            />
          )
        },
        options: email
      },
      {
        type: "password",
        name: "password",
        inputProps: {
          clear: true,
          placeholder: "Enter Password",
          labelNumber: 1.5,
          style: [styles.input],
          placeholderTextColor: "#fff",
          children: (
            <Image
              resizeMode="contain"
              source={lock}
              style={[styles.inputIcon]}
            />
          )
        },
        options: password
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
          <View style={[styles.form]}>
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
                text: "Sign Up"
              }}
            >
            </Form>
          </View>
        </ScrollView>
        <View style={[styles.options]}>
          <View>
            <Text style={[styles.optionLabel]}>{"Become a member"}</Text>
            <Link
              textStyle={[styles.textLink]}
              text={"Sign In"}
              link="Login" />
          </View>
          <View style={[styles.separator]}>
          </View>
          <View>
            <Text style={[styles.optionLabel]}>{"Login with social apps"}</Text>
            <View style={[styles.social]}>
              <Link>
                <Image
                  resizeMode="contain"
                  source={google}
                  style={[styles.socialIcon]}
                />
              </Link>
              <Link>
                <Image
                  resizeMode="contain"
                  source={facebook}
                  style={[styles.socialIcon]}
                />
              </Link>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
export default SignUpScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
    padding: 15
  },
  logoContainer: {
    ...ifIphoneX({
      marginTop: 70,
    }, {
        marginTop: 30,
      }),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  logo: {
    ...ifIphoneX({
      width: 180,
      height: 180,
    }, {
        width: 130,
        height: 130,
      }),
    alignSelf: 'center'
  },
  form: {
    alignSelf: 'stretch',
    ...ifIphoneX({
      paddingTop: 50,
    }, {
        paddingTop: 20,
      }),
  },
  list: {
    backgroundColor: 'transparent'
  },
  input: {
    borderColor: Colors.primaryColor,
    backgroundColor: Colors.inputBackgroundColor,
    height: 50,
    marginBottom: 10,
    marginLeft: 0,
    paddingLeft: 15,
    borderBottomWidth: 0,
  },
  inputIcon: {
    width: 18
  },
  userIcon: {
    color: '#f79198',
    fontSize: 30
  },
  button: {
    marginBottom: 10,
    borderRadius: 2,
    borderWidth: 0,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: Colors.primaryColor,
    fontSize: 15
  },
  textLink: {
    color: '#fff',
    fontSize: 25,
    textAlign: 'left'
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingBottom: 10
  },
  separator: {
    height: 40,
    width: 2,
    backgroundColor: '#ff9599',
    marginTop: 8
  },
  optionLabel: {
    color: '#fff'
  },
  social: {
    flex: 1,
    flexDirection: 'row',
  },
  socialIcon: {
    width: 25,
    marginRight: 10
  },
  githubIcon: {
    fontSize: 28,
    color: '#fff',
    marginTop: 6
  }
});