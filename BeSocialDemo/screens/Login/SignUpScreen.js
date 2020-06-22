import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView } from "react-native";
import { ifIphoneX } from "react-native-iphone-x-helper";
import { Colors } from "../../styles";
import Link from "../../components/Link";
import _ from "lodash";
import * as firebase from "firebase";
import { dbUsers } from "../../firebase-db";
import { updateAppLoadingProgress } from "../../actions/main";
import ModalLoader from "./../../components/ModalLoader";
import ErrorContainer from "./../../components/ErrorContainer";
import LogoContainer from "./../../components/LogoContainer";
import { Icon, Input, Button } from "react-native-elements";
import { validatedEmail, validatedPassword, validatedAreaCode, LogError } from './../../global';
const currentUserDefaultInit = require("./currentUserDefaultInit.json");

class SignUpScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      areacode: '',
      email: '',
      password: '',
      zipcode: '',
      name_valid: true,
      areacode_valid: true,
      email_valid: true,
      password_valid: true,
      zipcode_valid: true,
      errorMsg: ""
    };
  }

  onSubmit = () => {
    try {
      const { navigation } = this.props;
      const { name, areacode, email, password, zipcode } = this.state;
      this.props.updateAppLoadingProgress(true);

      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(result => {
          const userID = _.isError(result.user.uid) ? "" : result.user.uid;

          if (!_.isEmpty(userID)) {
            const dateCreated = new Date().getTime();
            let currentUserDefault = JSON.parse(
              JSON.stringify(currentUserDefaultInit)
            );

            currentUserDefault.id = userID;
            currentUserDefault.email = result.user.email;
            currentUserDefault.name = name;
            currentUserDefault.zipcode = ""; //zipcode;
            currentUserDefault.areacode = areacode;
            currentUserDefault.createddate = dateCreated;
            currentUserDefault.lastupdate = dateCreated;
            dbUsers.child(userID).update(currentUserDefault);
            navigation.navigate("Login");
          }

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
      LogError('SignUpScreen::onSubmit', error);
    }
  }

  _setName = (name) => this.setState({ name });
  _setEmail = (email) => this.setState({ email });
  _setZipcode = (zipcode) => this.setState({ zipcode });
  _setPassowrd = (password) => this.setState({ password });

  _setAreacode = (areacode) => {
      //keep it limit to 3 digits
      if (areacode.length >= 4) {
        return;
      } else {
        this.setState({ areacode });
      }
  }

  validateForm = () => {
    var retVal = false;
    const { name, email, password, zipcode, areacode } = this.state;

    try {

      /*check for name */
      if (_.isEmpty(name)) {
        this.setState({ name_valid: false });
        return retVal;
      } else {
        this.setState({ name_valid: true });
      }

      /*check for areacode */
      if (validatedAreaCode(areacode) === false) {
        this.setState({ areacode_valid: false });
        return retVal;
      } else {
        this.setState({ areacode_valid: true });
      }

      /*check for email */
      if (validatedEmail(email) === false) {
        this.setState({ email_valid: false });
        return retVal;
      } else {
        this.setState({ email_valid: true });
      }

      /*check for password */
      if (validatedPassword(password) === false) {
        this.setState({ password_valid: false });
        return retVal;
      } else {
        this.setState({ password_valid: true });
      }

      /*check for zipcode */
      // if (validatedZip(zipcode) === false) {
      //   this.setState({ zipcode_valid: false });
      //   return retVal;
      // } else {
      //   this.setState({ zipcode_valid: true });
      // }

      retVal = true;

      return retVal;
    } catch (error) {
      LogError('LoginScreen::validateForm', error);
    }
  };
  render() {
    const { name,
      email,
      password,
      //zipcode,
      areacode,
      name_valid,
      areacode_valid,
      email_valid,
      password_valid,
      //zipcode_valid,
      errorMsg } = this.state;

    const { loadingflag } = this.props;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={[styles.container]}>
        {loadingflag ? <ModalLoader loading={loadingflag} /> : null}
        <ScrollView 
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps={'handled'}
          >
          <LogoContainer />
          <View style={[styles.form]}>
            <View>
              <Input
                //keyboardAppearance="dark"
                containerStyle={styles.containerStyle}

                value={name}
                onChangeText={name => this._setName(name)}
                type="text"
                clear={true}
                overflow="hidden"
                inputStyle={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.primaryColor}
                autoCapitalize="none"
                keyboardType="default"
                returnKeyType="next"
                autoCorrect={false}
                blurOnSubmit={false}
                leftIcon={
                  <Icon
                    type="font-awesome"
                    name="user"
                    size={25}
                    color={Colors.primaryColor}
                  />
                }
                rightIconContainerStyle={styles.rightIconContainerStyle}
                errorStyle={styles.inputError}
                errorMessage={name_valid ? "" : "Please enter a valid name"}
              />
            </View>

            <View style={{ marginBottom: 10 }}>
              <Input
                //keyboardAppearance="dark"
                containerStyle={styles.containerStyle}
                onChangeText={areacode => this._setAreacode(areacode)}
                value={areacode}
                clear={true}
                overflow="hidden"
                inputStyle={styles.input}
                placeholder="Enter your Area Code"
                placeholderTextColor={Colors.primaryColor}
                autoCapitalize="none"
                keyboardType="number-pad"
                returnKeyType="next"
                autoCorrect={false}
                blurOnSubmit={false}
                leftIcon={
                  <Icon
                    type="font-awesome"
                    name="phone"
                    size={30}
                    color={Colors.primaryColor}
                  />
                }
                rightIconContainerStyle={styles.rightIconContainerStyle}
                errorStyle={styles.inputError}
                errorMessage={areacode_valid ? "" : "Enter a valid 3 digit Area Code"}
              />
            </View>
            <View style={{ marginBottom: 10 }}>
              <Input
                //keyboardAppearance="dark"
                containerStyle={styles.containerStyle}

                onChangeText={email => this._setEmail(email)}
                value={email}
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
                    size={30}
                    color={Colors.primaryColor}
                  />
                }
                rightIconContainerStyle={styles.rightIconContainerStyle}
                errorStyle={styles.inputError}
                errorMessage={email_valid ? "" : "Please enter a valid email"}
              />
            </View>
            <View style={{ marginBottom: 10 }}>
              <Input
                //keyboardAppearance="dark"
                containerStyle={styles.containerStyle}

                onChangeText={password => this._setPassowrd(password)}
                value={password}
                secureTextEntry={true}
                overflow="hidden"
                inputStyle={styles.input}
                placeholder="Enter Password"
                placeholderTextColor={Colors.primaryColor}
                autoCapitalize="none"
                keyboardType="default"
                returnKeyType="next"
                autoCorrect={false}
                blurOnSubmit={false}
                leftIcon={
                  <Icon
                    type="font-awesome"
                    name="lock"
                    size={30}
                    color={Colors.primaryColor}
                  />
                }
                rightIconContainerStyle={styles.rightIconContainerStyle}
                errorStyle={styles.inputError}
                errorMessage={password_valid ? "" : "Please enter a valid password, Password should be of minimum 6 characters"}
              />
            </View>

            <Button
              buttonStyle={styles.button}
              title="Sign In"
              titleStyle={styles.buttonText}
              onPress={() => {
                try {
                  const form_valid = this.validateForm();
                  if (form_valid) {
                    this.onSubmit();
                  }
                } catch (error) {
                  LogError('SignUpScreen::SignInButton', error);
                }
              }}
            />
          </View>
          {errorMsg ? (
            <ErrorContainer msg={errorMsg} color={Colors.white} />
          ) : null}
        </ScrollView>
        <View style={[styles.options]}>
          <View>
            <Text style={[styles.optionLabel]}>{"Become a member"}</Text>
            <Link textStyle={[styles.textLink]} text={"Sign In"} link="Login" />
          </View>
        </View>
      </View>
      </KeyboardAvoidingView>);
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
)(SignUpScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 15
  },
  form: {
    alignSelf: "stretch",
    ...ifIphoneX(
      {
        paddingTop: 50
      },
      {
        paddingTop: 20
      }
    )
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
  inputError: {
    textAlign: "left",
    fontSize: 12,
    color: Colors.red
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
    fontWeight: 'bold',
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
  },
  social: {
    flex: 1,
    flexDirection: "row"
  },
  socialIcon: {
    width: 25,
    marginRight: 10
  },
  githubIcon: {
    fontSize: 28,
    color: Colors.primaryColor,
    marginTop: 6
  }
});
