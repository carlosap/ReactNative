import React from 'react';
import { Platform, InteractionManager, Image, View } from 'react-native';
import { createStackNavigator, createAppContainer , createBottomTabNavigator} from 'react-navigation';
import MapScreen from './screens/MapScreen';
import SettingScreen from './screens/SettingScreen';
import EventScreen from './screens/EventScreen';
import NotifyScreen from './screens/NotifyScreen';
import AdvertiseScreen from './screens/Advertise/AdvertiseScreen';
import { YellowBox } from 'react-native';
import { Badge } from 'nachos-ui';
import { Colors } from "./styles";
import { Icon } from "react-native-elements";
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'Setting a timer']);

//workaround for android firebase setTimeout - Setting a timer
const _setTimeout = global.setTimeout;
const _clearTimeout = global.clearTimeout;
const MAX_TIMER_DURATION_MS = 60 * 1000;
if (Platform.OS === 'android') {
  // Work around issue `Setting a timer for long time`
  // see: https://github.com/firebase/firebase-js-sdk/issues/97
  const timerFix = {};
  const runTask = (id, fn, ttl, args) => {
    const waitingTime = ttl - Date.now();
    if (waitingTime <= 1) {
      InteractionManager.runAfterInteractions(() => {
        if (!timerFix[id]) {
          return;
        }
        delete timerFix[id];
        fn(...args);
      });
      return;
    }

    const afterTime = Math.min(waitingTime, MAX_TIMER_DURATION_MS);
    timerFix[id] = _setTimeout(() => runTask(id, fn, ttl, args), afterTime);
  };

  global.setTimeout = (fn, time, ...args) => {
    if (MAX_TIMER_DURATION_MS < time) {
      const ttl = Date.now() + time;
      const id = '_lt_' + Object.keys(timerFix).length;
      runTask(id, fn, ttl, args);
      return id;
    }
    return _setTimeout(fn, time, ...args);
  };

  global.clearTimeout = id => {
    if (typeof id === 'string' && id.startWith('_lt_')) {
      _clearTimeout(timerFix[id]);
      delete timerFix[id];
      return;
    }
    _clearTimeout(id);
  };
}

// Fixes isomorphic-fetch
GLOBAL.self = GLOBAL;

//---Login Screens----
import LoginScreen from './screens/Login/LoginScreen';
import SignUpScreen from './screens/Login/SignUpScreen';
import ForgotPasswordScreen from './screens/Login/ForgotPasswordScreen';

//---Welcome Screen----
import WelcomeScreen from './screens/Welcome/WelcomeScreen';

const tabBarConfig = {
  initialRouteName: 'Map',
  order: ['Map', 'Events', 'Notify', 'Advertise', 'Setting'],
  navigationOptions: {
    tabBarVisible: true,
  },
  tabBarOptions: {
    tintColor: Colors.secondaryLightColor,
    activeTintColor: Colors.primaryColor,
    labelStyle: {
      fontSize: 14,
      // fontFamily: 'Arial'
    },
    style: {
      backgroundColor: Colors.black,
      height: 70,
      paddingBottom: 6,
    }
  }
}

// StackNavigation pattern
const LoginRoutes = createStackNavigator({
  Login: {
    screen: LoginScreen,
  },
  SignUp: {
    screen: SignUpScreen,
  },
  ForgotPassword: {
    screen: ForgotPasswordScreen,
  }
})

// NavigationTab pattern
const MapAndEventRoutes = createBottomTabNavigator({
  Map: {
    screen: MapScreen,
    navigationOptions: {
      tabBarLabel: 'Maps',
      tabBarIcon: ({ tintColor }) => (
        <Icon
          name="map"
          type="font-awesome"
          color={tintColor}
        />
      )
    }
  },
  Events: {
    screen: EventScreen,
    navigationOptions: {
      tabBarLabel: 'Events',
      tabBarIcon: ({ tintColor }) => (
        <Icon
          name="calendar"
          type="font-awesome"
          color={tintColor}
        />
      )
    }
  },
  Notify: {
    screen: NotifyScreen,
    navigationOptions: ({ navigation }) => {
      const { params } = navigation.state;
      return {
        tabBarLabel: 'Notifications',
        tabBarIcon: ({ tintColor }) => (
          <View>
            {(params && params.notifyCount && params.notifyCount > 0)
              ? <View style={{ marginTop: -20, marginLeft: 28, flexDirection: 'row' }}><Badge value={params.notifyCount} /></View>
              : null
            }

            {(params && params.notifyCount && params.notifyCount > 0)
              ? <Icon
                name="comments"
                type="font-awesome"
                color={tintColor}
                marginLeft={18} />
              : <Icon
                name="comments"
                type="font-awesome"
                color={tintColor}
              />
            }
          </View>
        )
      }
    }
  },
  Advertise: {
    screen: AdvertiseScreen,
    navigationOptions: {
      tabBarLabel: 'Advertise',
      tabBarIcon: ({ tintColor }) => (
        <Icon
          name="cart-plus"
          type="font-awesome"
          color={tintColor}
        />
      )
    }
  },
  Setting: {
    screen: SettingScreen,
    navigationOptions: ({ settingProps }) => ({
      title: 'Settings',
      tabBarLabel: 'Settings',
      tabBarIcon: ({ tintColor }) => (
        <Icon
          name="cogs"
          type="font-awesome"
          color={tintColor}
        />
      )
    })
  }
},
  tabBarConfig
)

const ApplicationScreen = {
  Login: createAppContainer(LoginRoutes),
  MapAndEvents: createAppContainer(MapAndEventRoutes),
  Welcome: WelcomeScreen,
}
export { ApplicationScreen }