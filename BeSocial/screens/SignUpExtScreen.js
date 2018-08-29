import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native'
import { Toast } from 'antd-mobile-rn';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import { Colors } from '../styles';
import Spinner from '../components/Spinner';
import Form from '../components/Form';
import logo from '../assets/logo.png';
import {login, handleSocialSignInError, handleSocialSignIn} from './LoginScreen';
import { enableOnboarded } from '../actions/main';

class SignUpExtScreen extends Component {
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

  componentDidMount() {
  }
  setValidations() {
    this.validations = {

      "phone": {
        rules: [
          { min: 10, message: "Phone number should be of minimum 10 characters." },
          { max: 15, message: "Phone number should be of maximum 15 characters." },
        ]
      }
    }
  }


  onSubmit(values) {
    const { signUp, navigation } = this.props;
    Spinner.start();
    this.props.enableOnboarded();
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
    const { phone } = this.validations;
    const formElements = [
      {
        type: "number",
        name: "age",
        inputProps: {
          clear: true,
          placeholder: "Enter Age",
          labelNumber: 1.5,
          style: [styles.input],
          placeholderTextColor: "#fff",
        }
      },
      {
        type: "text",
        name: "city",
        inputProps: {
          clear: true,
          placeholder: "Enter City",
          labelNumber: 1.5,
          style: [styles.input],
          placeholderTextColor: "#fff",
        }
      },
      {
        type: "text",
        name: "hobbies",
        inputProps: {
          clear: true,
          placeholder: "Enter Hobbies",
          labelNumber: 1.5,
          style: [styles.input],
          placeholderTextColor: "#fff",
        }
      },
      {
        type: "phone",
        name: "phone",
        inputProps: {
          clear: true,
          placeholder: "Enter Phone",
          labelNumber: 1.5,
          style: [styles.input],
          placeholderTextColor: "#fff",
        },
        options: phone
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
                text: "Continue (or skip)"
              }}
            >
            </Form>
          </View>
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    onboarded: state.main.navigation.onboarded,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    enableOnboarded: (onboarded) => dispatch(enableOnboarded(onboarded)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SignUpExtScreen)

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