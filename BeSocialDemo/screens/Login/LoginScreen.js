import React, { Component } from "react";
import { connect } from "react-redux";
import { AsyncStorage, Platform, Alert } from "react-native";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { Colors } from "../../styles";
import { ifIphoneX } from "react-native-iphone-x-helper";
import Link from "../../components/Link";
import { Icon, Input, Button } from "react-native-elements";
import {
  updateScreen,
  updateCurrentUser,
  updateAppLoadingProgress
} from "../../actions/main";
import * as keys from "../../constants/storageKeys";
import { dbUsers, auth, dbErrors } from "../../firebase-db";
import _ from "lodash";
import { Notifications } from "expo";
import * as Permissions from 'expo-permissions';
import * as AppAuth from 'expo-app-auth';
import * as Facebook from 'expo-facebook';
import Constants from 'expo-constants';
import { validatedEmail, validatedPassword, LogError, Log } from './../../global';

import ModalLoader from "./../../components/ModalLoader";
import ErrorContainer from "./../../components/ErrorContainer";
import LogoContainer from "./../../components/LogoContainer";

const currentUserDefaultInit = require("./currentUserDefaultInit.json");


const configClientID = (Constants.appOwnerShip === 'standalone' ?
  (
    Platform.OS === 'android' ?
      Constants.manifest.extra.googleLogin.androidStandaloneAppClientId :
      Constants.manifest.extra.googleLogin.iosStandaloneAppClientId
  )
  :
  (
    Platform.OS === 'android' ?
      Constants.manifest.extra.googleLogin.androidClientId :
      Constants.manifest.extra.googleLogin.iosClientId)
)

class LoginScreen extends Component {
  // Remove the Header of the App
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      email_valid: true,
      password_valid: true,
      errorMsg: ""
    };
  }

  getUserFromContacts = id => {
    try {
      const { contacts } = this.props;
      const users = _.without(contacts, undefined);
      return _.head(
        _.filter(users, function (user) {
          return user.id === id;
        })
      );
    } catch (error) {
      LogError('LoginScreen::getUserFromContacts', error);
    }
  };

  onSubmitSignInWithEmailAndPassword = () => {
    // activate loading modal
    this.props.updateAppLoadingProgress(false);
    const { email, password } = this.state;
    try {
      this.props.updateAppLoadingProgress(true);
      auth.signInWithEmailAndPassword(email, password)
        .then(result => {
          //Log('result back email [' + email + ']' + ', password [' + password + ']', result);
          const userID = _.isError(result.user.uid) ? "" : result.user.uid;
          if (!_.isEmpty(userID)) {
            const dateCreated = new Date().getTime();
            const currentuser = this.getUserFromContacts(userID);

           // Log('user found ', currentuser);
            let currentUserDefault = JSON.parse(JSON.stringify(currentUserDefaultInit));

            if (_.isUndefined(currentuser)) {
              //first time user
              //Log('First Time user with ', currentuser);
              currentUserDefault.id = userID;
              currentUserDefault.email = result.user.email;
              currentUserDefault.createddate = dateCreated;
              currentUserDefault.lastupdate = dateCreated;
            } else {
              //user exist in the database
              currentUserDefault = _.assign(
                {},
                currentUserDefault,
                currentuser
              );

             // Log('Returning user with ', currentUserDefault);
            }
            // disactivate loading modal
            this.props.updateAppLoadingProgress(false);
            this.registerForPushNotificationsAsync(currentUserDefault);

          }else{
            Alert.alert(
              'login Error',
              'Could not authenticate you with Email and Password',
              [
                {
                  text: 'OK', onPress: () => {
                    this.props.updateAppLoadingProgress(false);
                    this.props.updateCurrentUser(null);
                   LogError('LoginScreen::auth.signInWithEmailAndPassword : userID not defined', result); 
                  }
                },
              ],
              { cancelable: false },
            );            
          }
        })
        .catch(e => {
          Alert.alert(
            'login Error',
            'Could not authenticate you with Email and Password\n Reason : ' + e.message,
            [
              {
                text: 'OK', onPress: () => {
                  this.props.updateAppLoadingProgress(false);
                  this.props.updateCurrentUser(null);
                  LogError('LoginScreen::auth.signInWithEmailAndPassword : email [' + email + ']' + ', password [' + password + ']', e);
                }
              },
            ],
            { cancelable: false },
          );
        });
    } catch (error) {
      this.props.updateAppLoadingProgress(false);
      this.props.updateCurrentUser(null);
      LogError('LoginScreen::onSubmitSignInWithEmailAndPassword : email [' + email + ']' + ', password [' + password + ']', error);
    }
  }

  signInWithGoogleAsync = async () => {
    try {
      const response = await AppAuth.authAsync({
        issuer: 'https://accounts.google.com',
        scopes: ['openid', 'profile', 'email'],
        clientId: configClientID
      });

      const result = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: {
          'Authorization': `OAuth ${response.accessToken}`
        },
      });

      let user = await result.json();

      if (user && user.id) {
        //const userID = //_.isError(user.id) ? "" : result.user.id;
        if (!_.isEmpty(user.id)) {
          const dateCreated = new Date().getTime();
          const currentuser = this.getUserFromContacts(user.id);
          let currentUserDefault = JSON.parse(
            JSON.stringify(currentUserDefaultInit)
          );
          let userData = currentUserDefault;
          if (_.isUndefined(currentuser)) {
            //first time user
            currentUserDefault.createddate = dateCreated;
            currentUserDefault.lastupdate = dateCreated;
            userData = _.assign({}, currentUserDefault, user);
          } else {
            //user exist in the database
            userData = _.assign({}, currentUserDefault, currentuser);
          }

          this.registerForPushNotificationsAsync(userData);
        }
      } else {
        alert("Please check you internet connection and try again");
        this.props.updateCurrentUser(null);
      }
    } catch (error) {
      alert(
        "\nCould not authenticate you with Google\n Reason : " + error.message
      );
      this.props.updateCurrentUser(null);
      LogError('LoginScreen::signInWithGoogleAsync', error);
    }
  };

  signInWithFaceBookAsync = async () => {
    try {
      const { type, token } = await Facebook.logInWithReadPermissionsAsync(
        Constants.manifest.extra.facebookLogin.key,
        {
          scope: ["public_profile,email"]
        }
      );

      if (_.isEqual(type, "success")) {
        const response = await fetch(
          `https://graph.facebook.com/me?locale=en_US&fields=name,email,first_name,last_name&access_token=${token}`
        );
        const userBody = JSON.parse(response._bodyText);
        const userID = _.isError(userBody.id) ? "" : userBody.id;

        if (response && response._bodyText && !_.isEmpty(userID)) {
          const dateCreated = new Date().getTime();
          const currentuser = this.getUserFromContacts(userID);
          let currentUserDefault = JSON.parse(
            JSON.stringify(currentUserDefaultInit)
          );

          if (_.isUndefined(currentuser)) {
            //first time user
            currentUserDefault.id = userID;
            currentUserDefault.name = userBody.name;
            currentUserDefault.email = userBody.email;
            currentUserDefault.createddate = dateCreated;
            currentUserDefault.lastupdate = dateCreated;
          } else {
            //user exist in the database
            userData = _.assign({}, currentUserDefault, currentuser);
          }

          this.registerForPushNotificationsAsync(currentUserDefault);
        }
      } else {
        alert("Please check you internet connection and try again");
        this.props.updateCurrentUser(null);
      }
    } catch (error) {
      alert(
        "\nCould not authenticate you with Facebook\n Reason : " + error.message
      );
      this.props.updateCurrentUser(null);
      LogError('LoginScreen::signInWithFaceBookAsync', error);
    }
  };

  registerForPushNotificationsAsync = async user => {
    try {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

      //Log('LoginScreen::registerForPushNotificationsAsync::existingStatus');

      let finalStatus = existingStatus;
      // only ask if permissions have not already been determined, because
      // iOS won't necessarily prompt the user a second time.
      if (existingStatus !== "granted") {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      } 

      //Log('LoginScreen::registerForPushNotificationsAsync::existingStatus ', 'device check');

      if (Constants.isDevice) {
        // Stop here if the user did not grant permissions
        if (finalStatus === "granted") {
         // Log('LoginScreen::registerForPushNotificationsAsync::existingStatus ', 'getting token');
          // Get the token that uniquely identifies this device
          let token = await Notifications.getExpoPushTokenAsync();
          user.token = token;
        }
      }

      if (!_.isUndefined(user.id)) {
        AsyncStorage.setItem(keys.CURRENTUSER, user.id);
        this.props.updateCurrentUser(user);
        dbUsers.child(user.id).update(user);
        this.props.updateScreen("Welcome");
      }else{
        Log('LoginScreen::registerForPushNotificationsAsync::user ', 'user not difined');
      }

    } catch (error) {
      LogError('LoginScreen::registerForPushNotificationsAsync', error);
    }
  };

  _setEmail = (email) => this.setState({ email });
  _setPassowrd = (password) => this.setState({ password });

  validateForm = () => {
    var retVal = false;
    const { email, password } = this.state;
    try {
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
      retVal = true;

      return retVal;
    } catch (error) {
      LogError('LoginScreen::validateForm', error);
    }
  };

  render() {
    const { email, password, email_valid, password_valid, errorMsg } = this.state;
    const { loadingflag } = this.props;

    return (
      <View style={[styles.container]} >
        {loadingflag ? <ModalLoader loading={loadingflag} /> : null}
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 20
          }}
          keyboardShouldPersistTaps={'handled'}
        >
          <LogoContainer />
          <View style={[styles.form]}>
            <View>
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

            <View style={{ marginBottom: 10 }}>
              <Input
                keyboardAppearance="dark"
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
                    this.onSubmitSignInWithEmailAndPassword();
                  }
                } catch (error) {
                  LogError('LoginScreen::SignInButton', error);
                }
              }}
            />
            {errorMsg ? (<ErrorContainer msg={errorMsg} color={Colors.white} />) : null}
            <Link textStyle={[styles.forgotPassword]} text={"Forgot Password?"} link="ForgotPassword" />
            <Text style={[styles.separatorOr]} />
          </View>
        </ScrollView>

        <View style={[styles.options]}>
          <View>
            <Text style={[styles.optionLabel]}>{"Become a member"}</Text>
            <Link
              textStyle={[styles.textLink]}
              text={"Sign Up"}
              link="SignUp"
            />
          </View>
          <View style={[styles.separator]} />
          <View>
            <Text style={[styles.optionLabel]}>{"login with social apps"}</Text>
            <View style={[styles.social]}>
              <Link onPress={this.signInWithGoogleAsync}>
                <Icon
                  name="google-plus-square"
                  type="font-awesome"
                  paddingRight={4}
                  size={32}
                  color={Colors.primaryColor}
                />
              </Link>
              <Link onPress={this.signInWithFaceBookAsync}>
                <Icon
                  name="facebook-square"
                  type="font-awesome"
                  size={32}
                  color={Colors.primaryColor}
                />
              </Link>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentuser: state.main.contacts.currentuser,
    contacts: state.main.contacts.entities,
    loadingflag: state.main.loadingprogress.loadingflag
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateScreen: onboarded => dispatch(updateScreen(onboarded)),
    updateCurrentUser: currentuser => dispatch(updateCurrentUser(currentuser)),
    updateAppLoadingProgress: loadingflag =>
      dispatch(updateAppLoadingProgress(loadingflag))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);

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
    backgroundColor: Colors.white,
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
  forgotPassword: {
    color: Colors.primaryColor,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 10
  },
  separatorOr: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.primaryColor
  }
});
