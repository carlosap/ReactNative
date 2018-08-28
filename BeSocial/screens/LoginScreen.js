import React, { Component } from 'react';
import { View, StyleSheet, Image, ScrollView, WebView, Text } from 'react-native'
import { Colors } from '../styles'
import { ifIphoneX } from 'react-native-iphone-x-helper';
import logo from '../assets/logo.png'
import envelope from '../assets/envelope.png'
import lock from '../assets/lock.png'
import facebook from '../assets/facebook.png'
import google from '../assets/google.png'
import phoneIcon from '../assets/phone.png'
import { InputItem } from 'antd-mobile-rn';
import Link from '../components/Link';
import Button from '../components/Button';

class LoginScreen extends Component {

  // Remove the Header of the App
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      phoneSignIn: false,
      confirmOtp: false,
      renderRecaptcha: false,
    };

    this.setValidations();
    this.login = login.bind(this);
    this.handleSocialSignIn = handleSocialSignIn.bind(this);
    this.handleSocialSignInError = handleSocialSignInError.bind(this);
  }

  parseRecaptcha(recaptcha) {
    this.setState({
      recaptcha,
      renderRecaptcha: false
    }, this.sendSms.bind(this))
  }

  setValidations() {
    this.validations = {
      "email": {
        rules: [
          { required: true, message: "Please enter email" },
          { type: "email", message: "Please enter a valid email" }
        ],
        initialValue: ""
      },
      "password": {
        rules: [
          { required: true, message: "Please enter password" },
          { min: 6, message: "Password should be of minimum 6 characters" }
        ],
        initialValue: ""
      },
    }
  }

  togglePhoneSignIn() {
    this.setState({
      phoneSignIn: !this.state.phoneSignIn
    })
  }

  sendSms() {
    const { recaptcha, phone } = this.state;
    Spinner.start();
    if (!recaptcha) {
      Toast.fail("Captcha has expired, Please try again", 0.5)
      return;
    }

    firebase.auth().signInWithPhoneNumber(phone, getRecaptchaApplicationVerifier(this.state.recaptcha)).then((result) => {
      this.setState({
        verificationId: result.verificationId,
        confirmOtp: true
      }, Spinner.stop);

    }).catch((e) => {
      console.log(e)
      //Todo : Handle specific error codes for invalid phone number and invalid captcha
    });
  }

  verifyOtp(otp) {

    this.login("phone", {
      code: otp,
      verificationId: this.state.verificationId
    });
  }

  onSubmit(values) {
    if (this.state.phoneSignIn) {
      const phone = values.countryCode[0].concat(values.phone);
      if (isValidNumber(phone)) {
        this.setState({
          renderRecaptcha: true,
          phone
        })
      } else {
        Toast.fail("Please enter a valid numeric phone number.", 0.5)
      }
    } else {
      this.login('local', values);
    }
  }

  render() {
    const { email, password } = this.validations;
    const { phoneSignIn, githubSignIn, twitterSignIn, confirmOtp, renderRecaptcha } = this.state;
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
            <InputItem type="email" name="email" keyboardType={"email-address"}
              {...{
                options: email,
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
              }
              } />

            <InputItem type="password" name="password"
              {...{
                options: password,
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
              }
              } />

            <Link textStyle={[styles.forgotPassword]} text={"Forgot Password?"} link="ForgotPassword" />
            <Text style={[styles.separatorOr]}></Text>
            <Button label="Sign In" style={styles.button} textStyle={styles.buttonText} />
          </View>
        </ScrollView>
        <View style={[styles.options]}>
          <View>
            <Text style={[styles.optionLabel]}>{"Become a member"}</Text>
            <Link textStyle={[styles.textLink]} text={"Sign Up"} link="SignUp" />
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


export default LoginScreen;

export function login(provider, credentials) {
  const { navigation, login } = this.props;
  let promise = null;
  let credential = null;
  Spinner.start();
  switch (provider) {
    case 'local':
      promise = firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
      break;
    case 'google':
      credential = firebase.auth.GoogleAuthProvider.credential(credentials.idToken);
      promise = firebase.auth().signInWithCredential(credential)
      break;
  }
  if (promise) {
    promise.then((response) => {
      Spinner.stop();
    }).catch((e) => {
      //alert(JSON.stringify(e))
      switch (provider) {
        case 'local':
          Toast.fail("Invalid Username and Password", 0.5);
          break;
        case 'google':
          Toast.fail("Could not authenticate you with" + " Google\n" + "Reason : " + e.message, 0.5);
          break;
      }

    })
  }
}

export function handleSocialSignIn(provider, result) {
  this.login(provider, result);
}

export function handleSocialSignInError(provider, error) {
  Toast.fail("Could not authenticate you with" + provider, 0.5);
}

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
  button: {
    marginBottom: 10,
    borderRadius: 2,
    borderWidth: 0,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    justifyContent: 'center',
    alignItems: 'center'

  },
  buttonText: {
    color: Colors.primaryColor,
    fontSize: 20,
    fontFamily: 'Karla',
    textAlign: 'center'
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
  forgotPassword: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 10
  },
  separatorOr: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff'
  }
});



