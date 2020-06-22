import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { Colors } from "../../styles";
import Link from "../../components/Link";
import { Icon, Input, Button } from "react-native-elements";

import * as firebase from "firebase";
import { updateAppLoadingProgress } from "../../actions/main";
import ModalLoader from "./../../components/ModalLoader";
import ErrorContainer from "./../../components/ErrorContainer";
import LogoContainer from "./../../components/LogoContainer";
import { LogError } from './../../global';

class ForgotPasswordScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      email_valid: true,
      errorMsg: "",
      showDoneMsg: false
    };
  }

  onDoneToHome = () => {
    try {
      const { navigation } = this.props;
      navigation.navigate("Login");
    } catch (error) {
      LogError('ForgotPasswordScreen::onDoneToHome', error);
    }
  };

  onSubmitForgotPassword(values) {
    // activate loading modal
    const { email } = this.state;
    try {
      this.props.updateAppLoadingProgress(true);

      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(result => {
          this.setState({
            showDoneMsg: true,
            errorMsg: ""
          });
          // disactivate loading modal
          this.props.updateAppLoadingProgress(false);
        })
        .catch(e => {
          this.setState({
            errorMsg: e.message
          });
          // disactivate loading modal
          this.props.updateAppLoadingProgress(false);
        });
    } catch (error) {
      LogError('ForgotPasswordScreen::onSubmitForgotPassword', error);
    }
  }

  _setEmail = (email) => this.setState({ email });
  //TODO:::MOVE THIS FUNCTION TO THE GLOBAL. I BELIEVE WE HAVE ONE TO CHECK EMAIL
  validateForm = () => {
    var retVal = false;
    const { email, password } = this.state;
    let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // var pass ="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
    // let regPassword =/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    let regPassword = /.{6,}/;
    try {
      /*check for email */
      if (regEmail.test(email) === false) {
        this.setState({ email_valid: false });
        return retVal;
      } else {
        this.setState({ email_valid: true });
      }
      retVal = true;

      return retVal;
    } catch (error) {
      LogError('LoginScreen::validateForm', error);
    }
  };

  render() {
    const { email, email_valid } = this.state;
    const { errorMsg, showDoneMsg } = this.state;
    const { loadingflag } = this.props;


    return (
      <View style={[styles.container]}>
        {loadingflag ? <ModalLoader loading={loadingflag} /> : null}
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 20
          }}
          keyboardShouldPersistTaps={'handled'}
        >
          <Link link="Login" style={[styles.back]}>
            <Icon
              name="arrow-left"
              type="font-awesome"
              size={32}
              color={Colors.primaryColor}
            />
          </Link>
          <LogoContainer />
          <Text style={[styles.pageTitle]}>{"Forgot Password?"}</Text>

          {showDoneMsg ? (
            <Text style={[styles.message]}>
              {
                "An email was sent to your mailbox, Please check your email for reset link."
              }
            </Text>
          ) : (
              <Text style={[styles.message]}>
                {
                  "We will send you password reset link to your email. Please enter your email address below."
                }
              </Text>
            )}
          <View style={[styles.form]}>
            {showDoneMsg ? (
              <Button
                title="Done"
                titleStyle={{ paddingLeft: 10, color: Colors.primaryColor }}
                buttonStyle={{
                  backgroundColor: Colors.silverGray
                }}
                onPress={() => {
                  this.onDoneToHome();
                }}
              />
            ) : (
                <View >
                  <View style={{ marginBottom: 10 }}>
                    <Input
                      keyboardAppearance="dark"
                      containerStyle={styles.containerStyle}
                      value={email}
                      onChangeText={email => this._setEmail(email)}
                      type="email"
                      clear={true}
                      overflow="hidden"
                      inputStyle={styles.input}
                      placeholder="Enter Email"
                      placeholderTextColor={Colors.primaryColor}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      returnKeyType="next"
                      autoCorrect={false}
                      blurOnSubmit={false}
                      leftIcon={
                        <Icon
                          type="font-awesome"
                          name="envelope"
                          size={25}
                          color={Colors.primaryColor}
                        />
                      }
                      rightIconContainerStyle={styles.rightIconContainerStyle}
                      errorStyle={styles.inputError}
                      errorMessage={email_valid ? "" : "Please enter a valid email"}
                    />
                  </View>
                  <Button
                    buttonStyle={styles.button}
                    title="Submit"
                    titleStyle={styles.buttonText}
                    onPress={() => {
                      try {
                        const form_valid = this.validateForm();
                        if (form_valid) {
                          this.onSubmitForgotPassword();
                        }
                      } catch (error) {
                        LogError('LoginScreen::SignInButton', error);
                      }
                    }}
                  />
                </View>
              )}
            {errorMsg ? (
              <ErrorContainer msg={errorMsg} color={Colors.white} />
            ) : null}
          </View>
        </ScrollView>
        <View style={[styles.options]}>
          <View>
            <Text style={[styles.optionLabel]}>{"Clicked by mistake?"}</Text>
            <Link textStyle={[styles.textLink]} text={"Sign In"} link="Login" />
          </View>
          <View style={[styles.separator]} />
          <View>
            <Text style={[styles.optionLabel]}>{"Need new account?"}</Text>
            <Link
              textStyle={[styles.textLink]}
              text={"Sign Up"}
              link="SignUp"
            />
          </View>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    loadingflag: state.main.loadingprogress.loadingflag
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateAppLoadingProgress: loadingflag =>
      dispatch(updateAppLoadingProgress(loadingflag))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPasswordScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 15
  },
  back: {
    marginTop: 20,
    paddingBottom: 10
  },
  pageTitle: {
    color: Colors.white,
    fontSize: 25,
    marginBottom: 10,
    fontWeight: "bold"
  },
  message: {
    color: Colors.white,
    fontSize: 15,
    lineHeight: 22
  },
  form: {
    alignSelf: "stretch",
    paddingTop: 10
  },
  list: {
    backgroundColor: "transparent"
  },
  input: {
    borderColor: Colors.primaryColor,
    backgroundColor: Colors.silverGray,
    height: 45,
    paddingLeft: 15,

  },
  containerStyle: {
    borderStyle: 'solid',
    overflow: 'hidden',
    marginBottom: 0,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 5,
    backgroundColor: Colors.silverGray,
  },
  viewInputStyle: {
    marginBottom: 2,
    color: Colors.white
  },
  inputStyle: {
    marginRight: 10,
    textAlignVertical: "top",
    color: Colors.white
  },
  rightIconContainerStyle: {
    paddingRight: 10
  },
  inputIcon: {
    width: 18
  },
  button: {
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 0,
    height: 50,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white
  },
  buttonText: {
    color: Colors.primaryColor,
    fontSize: 20,
    fontWeight: "bold",
    // fontFamily: 'Arial',
    textAlign: "center"
  },
  textLink: {
    color: Colors.primaryColor,
    fontSize: 25,
    textAlign: "left"
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "stretch",
    paddingBottom: 10
  },
  separator: {
    height: 40,
    width: 2,
    backgroundColor: Colors.primaryColor,
    marginTop: 8
  },
  optionLabel: {
    color: Colors.primaryColor
  }
});
