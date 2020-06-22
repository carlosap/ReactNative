import React from "react";
import { AsyncStorage, NetInfo, Platform, AppState } from "react-native";
import { Notifications } from "expo";
import { connect } from "react-redux";
import { ApplicationScreen } from "../routes";
import {
  updateScreen,
  updateContacts,
  updateEvents,
  updateUsers,
  updateCurrentUser,
  updateCurrentNotifications,
  updateCurrentNotificationsCount,
  updateAppConstSettings,
  updateNetInfoConnected,
  updateNetInfoType,
  updateAppState,
  updateLocationBackGround,
} from "../actions/main";
import { updateProductList } from "../actions/product";
import * as keys from "../constants/storageKeys";
import {
  dbUsers,
  dbEvents,
  dbProducts,
  dbSettings,
  dbBackGroundTrigger,
} from "../firebase-db";
import { LogError, Log } from "../global";
import Loading from "../components/Loading";
import _ from "lodash";
import Constants from 'expo-constants';

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.heartBeat = null;
    this.heartBeatCount= 0;
    this.state = {
      timePassed: false,
      appState: AppState.currentState
    };
  }

  goToApp = () => {
    try {
      this.props.updateScreen("Main");
    } catch (error) {
      LogError('Root::goToApp', errror.message);
    }
  };

  componentDidMount = async () => {
    this.notificationSubscription = this.registerForPushNotifications();
    this.setNetInfoListener();
    this.firebaseListenerOn();
    AppState.addEventListener('change', this._handleAppStateChange); 
  }

  firebaseListenerOn() {
    this.setDbUserListener();
    this.setDbProductListener();
    this.setDbEventsListener();
    this.setDbConstSettingsListener();
    this.setDbLocationBackGroundListener();
  }

  firebaseListenerOff() {
    dbUsers.off();
    dbEvents.off();
    dbProducts.off();
    dbSettings.off();
    dbBackGroundTrigger.off();
  }

  componentWillUnmount() {
    this.notificationSubscription && this.notificationSubscription.remove();
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {

    switch (nextAppState) {
      case "active":
        //console.log('App has come to the foreground! (active) ' + nextAppState);
        this.props.updateAppState(true);
        break;
      case "background":
        this.props.updateAppState(false);
        //console.log('App has come to the Background! ' + nextAppState);
        break;
      default:
          //console.log('unknonw state: ' + nextAppState);
          this.props.updateAppState(false);
        break;
    }
  };

  checkHeartBeat = () => {
    const { isForeground } =this.props;
     //console.log('isForeground ' + isForeground + ' ' + this.heartBeatCount);    
    if (isForeground) {
      this.heartBeatCount = 0;
    } else {
      this.heartBeatCount++;
      if ( this.heartBeatCount >= 30 ){
        this.heartBeatCount = 0;
        this.firebaseListenerOff();
        this.firebaseListenerOn();
      }
    }
  }

  setNetInfoListener = () => {
    try {
      NetInfo.isConnected.addEventListener(
        "connectionChange",
        this.handleConnectivityConnectedChange
      );
      NetInfo.addEventListener(
        "connectionChange",
        this.handleConnectivityTypeChange
      );
      NetInfo.isConnected.fetch().done(isConnected => {
        this.props.updateNetInfoConnected(isConnected);
      });
    } catch (error) {
      LogError('Root::setNetInfoListener', error);
    }
  };

  handleConnectivityTypeChange = connectiontype => {
    try {
      this.props.updateNetInfoType(connectiontype);
    } catch (error) {
      LogError('Root::handleConnectivityTypeChange', error);
    }
  };

  handleConnectivityConnectedChange = isConnected => {
    try {
      this.props.updateNetInfoConnected(isConnected);
    } catch (error) {
      LogError('Root::handleConnectivityConnectedChange', error);
    }
  };

  setDbProductListener = () => {
    try {
      dbProducts.on("value", snap => {
        const data = [];
        if (!_.isEmpty(snap.val())) {
          for (let [key, value] of Object.entries(snap.val())) {
            data.push(_.extend({ id: key }, value));
          }
        }
        if (_.isLength(data.length)) {
          const filteredData = data.filter((element, index) => {
            return (Platform.OS === 'android' ? element.isandroidenabled : element.isiosenabled) && element.isenabled;
          });
          this.props.updateProductList(filteredData.sort(function (a, b) {
            return a.price > b.price
          })
          );
        }
      });
    } catch (error) {
      LogError('Root::setDbProductListener', error);
    }
  };

  setDbUserListener = () => {
    try {
      dbUsers.on("value", snap => {
        const data = [];
        if (!_.isEmpty(snap.val())) {
          for (let [key, value] of Object.entries(snap.val())) {
            if (!_.isEqual(key, "1")) data.push(_.extend({ id: key }, value));
          }
        }
        this.updateUser(data);
      });
    } catch (error) {
      LogError('Root::setDbUserListener', error);
    }
  };

  setDbEventsListener = () => {
    try {
      dbEvents.on("value", snap => {
        const data = [];
        if (!_.isEmpty(snap.val())) {
          for (let [key, value] of Object.entries(snap.val())) {
            if (!_.isEqual(key, "1")) data.push(_.extend({ id: key }, value));
          }
        }
        // added an array sort for event
        this.props.updateEvents(
          data.sort((a, b) => {
            return a["starteventat"] > b["starteventat"];
          })
        );
      });
    } catch (error) {
      LogError('Root::setDbEventsListener', error);
    }
  };

  setDbConstSettingsListener = () => {
    try {
      dbSettings.on("value", snap => {
        const data = [];
        data.push(snap.val());
        this.props.updateAppConstSettings(data);
      });
    } catch (error) {
      LogError('Root::setDbConstSettingsListener', error);
    }
  };

  setDbLocationBackGroundListener = () => {
    try {
      dbBackGroundTrigger.on("value", snap => {
        const trigger = snap.val();
        this.props.updateLocationBackGround(trigger.lastupdate);
      });
      
    } catch (error) {
      LogError('Root::setDbLocationBackGroundListener', error);
    }
  }

  componentWillMount() {
    AsyncStorage.getItem(keys.CURRENTUSER).then(id => {
      if (!_.isUndefined(id) && !_.isNull(id) && !_.isEmpty(id)) {
        this.props.updateScreen("Main");
      }
    });

    NetInfo.removeEventListener("change", this.handleConnectivityChange);
  }

  registerForPushNotifications = () => {
    this.notificationSubscription = Notifications.addListener(
      this.handlerNotification
    );
  };

  handlerNotification = notification => {
    try {
      const { navigate } = this.props.navigation;
      navigate("Alerts");
    } catch (error) {
      LogError('Root::handlerNotification', error);
    }
  };

  updateUser = data => {
    try {
      if (_.isArray(data) && !_.isEmpty(data)) {
        this.setCurrentUser(data); // current user. Only if found in cached
        this.setUsers(data); // only users
        this.props.updateContacts(data); // all users types enteties
      }
    } catch (error) {
      LogError('Root::updateUser', error);
    }
  };

  setUsers = data => {
    try {
      if (_.isArray(data) && !_.isEmpty(data)) {
        let users = _.without(data, undefined);
        users = _.filter(users, function (user) {
          // TODO may need to consider date code.
          return user.isActive && user.isliveuser;
        });
        this.props.updateUsers(users);
      }
    } catch (error) {
      LogError('Root::setUsers', error);
    }
  };

  setCurrentUser = async data => {
    try {
      if (_.isArray(data) && !_.isEmpty(data)) {
        let id = await AsyncStorage.getItem(keys.CURRENTUSER);
        if (!_.isUndefined(id) && !_.isNull(id) && !_.isEmpty(id)) {
          const users = _.without(data, undefined);
          const currentuser = _.head(
            _.filter(users, function (user) {
              return user.id === id;
            })
          );

          if (!_.isUndefined(currentuser)) {
            //Current User exists in the lifecycle of the application.
            //This update gets triggered on real-time from the backend.
            if (currentuser.id) {
              if (currentuser.notifications) {
                this.setCurrentNotifications(currentuser.notifications);
              }

              AsyncStorage.setItem(keys.CURRENTUSER, currentuser.id);
              this.props.updateCurrentUser(currentuser);
            }
          } else {
            //This condition enforces Login. When the user is Removed from backend-
            //We want to make sure we enforece Login
            AsyncStorage.setItem(keys.CURRENTUSER, "");
            this.props.updateCurrentUser(null);
            this.props.updateScreen("Login");
          }
        }
      }
    } catch (error) {
      LogError('Root::setCurrentUser', error);
    }
  };

  setCurrentNotifications = async notificaitons => {
    try {
      const data = [];
      let count = 0;
      if (!_.isEmpty(notificaitons)) {
        for (let [key, value] of Object.entries(notificaitons)) {
          data.push(_.extend({ id: key }, value));
          if (value.isactive) {
            count++;
          }
        }
      }
      this.props.updateCurrentNotificationsCount(count);
      this.props.updateCurrentNotifications(data);
    } catch (error) {
      LogError('Root::setCurrentNotifications', error);
    }
  };

  _onPlaybackStatusUpdate = playbackStatus => {
    try {
      if (playbackStatus.didJustFinish) {
        this.setState({
          timePassed: true
        });
      }
    } catch (error) {
      LogError('Root::_onPlaybackStatusUpdate', error);
    }
  };

  render() {
    const {
      screen,
      // entities,
      // users,
      // events,
      settings,
      isConnected,
      connectionType
    } = this.props;
    const { timePassed } = this.state; 

    const findMyBnadTitle = "E-Flyer Junkie  v" + Constants.manifest.version;

    if (_.get(connectionType,"type") === "none") {
      return (
        <Loading
          title="Please close the app and check your connection"
          enableVideo={false}
          justifycontent="flex-end"
          onPlaybackStatusChange={this._onPlaybackStatusUpdate}
        />
      );
    }

    //waiting on video load and if entities is empty
    if (
      !timePassed ||
      _.isEmpty(settings)
    ) {
      return (
        <Loading
          title={findMyBnadTitle}
          enableVideo={true}
          justifycontent="flex-end"
          onPlaybackStatusChange={this._onPlaybackStatusUpdate}
        />
      );
    }

    //video done and make sure entities not empty
    //TODO:::well what if they are still empty. we are stuck
    if (
      timePassed &&
      !_.isEmpty(settings)
    ) {
      if (screen === "Login") return <ApplicationScreen.Login />;
      if (screen === "Welcome")
        return <ApplicationScreen.Welcome onPress={this.goToApp} />;

      return <ApplicationScreen.MapAndEvents />;
    }
  }
}

function mapStateToProps(state) {
  return {
    screen: state.main.navigation.screen,
    contacts: state.main.contacts.entities,
    users: state.main.contacts.users,
    events: state.main.contacts.events,
    currentuser: state.main.contacts.currentuser,
    currentnotifications: state.main.contacts.currentnotifications,
    entities: state.main.contacts.entities,
    settings: state.main.constsettings.settings,
    isConnected: state.main.netinfo.isConnected,
    connectionType: state.main.netinfo.type,
    isForeground : state.main.appState.isForeground,
    lastbackgroundupdate: state.main.backGroundTrigger.lastupdate,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateScreen: screen => dispatch(updateScreen(screen)),
    updateContacts: contacts => dispatch(updateContacts(contacts)),
    updateUsers: users => dispatch(updateUsers(users)),
    updateEvents: events => dispatch(updateEvents(events)),
    updateCurrentUser: currentuser => dispatch(updateCurrentUser(currentuser)),
    updateCurrentNotifications: currentnotifications =>
      dispatch(updateCurrentNotifications(currentnotifications)),
    updateCurrentNotificationsCount: count =>
      dispatch(updateCurrentNotificationsCount(count)),
    updateProductList: productlist => dispatch(updateProductList(productlist)),
    updateAppConstSettings: settings =>
      dispatch(updateAppConstSettings(settings)),
    updateNetInfoConnected: isconnected =>
      dispatch(updateNetInfoConnected(isconnected)),
    updateNetInfoType: type => dispatch(updateNetInfoType(type)),
    updateAppState : isForeground => dispatch(updateAppState(isForeground)),
    updateLocationBackGround : lastupdate => dispatch(updateLocationBackGround(lastupdate))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);