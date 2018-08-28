import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native'
import Spinner from '../components/Spinner';
import { Colors } from '../styles';
import Link from '../components/Link';
import Form from '../components/Form';
import envelope from '../assets/envelope.png';
import logo from '../assets/logo.png';
import back from '../assets/back.png';
import { enableOnboarded } from '../actions/main';

class ForgotPasswordScreen extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.setValidations();
  }

  setValidations() {
    this.validations = {
      "email": {
        rules: [
          { required: true, message: "Please enter email" },
          { type: "email", message: "Please enter a valid email" }
        ]
      }
    }
  }

  onSubmit(values) {
    Spinner.start();
    alert(values.email);
    Spinner.stop();

  }
  render() {
    const { email } = this.validations;
    const formElements = [
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
      }
    ];

    return (
      <View style={[styles.container]}>
        <ScrollView>
          <Link link="login" style={[styles.back]}>
            <Image
              resizeMode="contain"
              source={back}
              style={[styles.backIcon]}
            />
          </Link>
          <View style={[styles.logoContainer]}>
            <Image
              resizeMode="contain"
              source={logo}
              style={[styles.logo]}
            />
          </View>
          <Text style={[styles.pageTitle]}>{"Forgot Password?"}</Text>
          <Text style={[styles.message]}>{"We will send you password reset link to your email. Please enter your email address below."}</Text>
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
                text: "Submit"
              }}
            >

            </Form>
          </View>
        </ScrollView>
        <View style={[styles.options]}>
          <View>
            <Text style={[styles.optionLabel]}>{"Clicked by mistake?"}</Text>
            <Link
              textStyle={[styles.textLink]}
              text={"Sign In"}
              link="Login" />
          </View>
          <View style={[styles.separator]}>
          </View>
          <View>
            <Text style={[styles.optionLabel]}>{"Need new account?"}</Text>
            <Link
              textStyle={[styles.textLink]}
              text={"Sign Up"}
              link="SignUp" />
          </View>
        </View>

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
export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
    padding: 15
  },
  back: {
    marginTop: 20,
    paddingBottom: 10
  },
  logoContainer: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  logo: {
    width: 130,
    height: 100,
    alignSelf: 'flex-start'
  },
  pageTitle: {
    color: '#fff',
    fontSize: 25,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  message: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22
  },
  form: {
    alignSelf: 'stretch',
    paddingTop: 10,
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
  }
});