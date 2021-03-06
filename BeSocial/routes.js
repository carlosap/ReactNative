import React from 'react';
import { Image } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import SettingScreen from './screens/SettingScreen';
import EventScreen from './screens/EventScreen';
import NotifyScreen from './screens/NotifyScreen';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
//---Login Screens----
import LoginScreen from './screens/Login/LoginScreen';
import SignUpScreen from './screens/Login/SignUpScreen';
import SignUpExtScreen from './screens/Login/SignUpExtScreen';
import ForgotPasswordScreen from './screens/Login/ForgotPasswordScreen';

//---Welcome Screen----
import WelcomeScreen from './screens/Welcome/WelcomeScreen';

const tabBarConfig = {
  initialRouteName: 'Map',
  order: ['Map', 'Events','Notify','Setting'],
  navigationOptions: {
    tabBarVisible: true
  },
  tabBarOptions: {
    tintColor: '#434343',
    activeTintColor: '#16d0e9',
    labelStyle: {
      fontSize: 14,
      fontFamily: 'Karla'
    },
    style: {
      backgroundColor: '#232323',
      height: 70,
      paddingBottom: 6,
    }
  }
}

// StackNavigation pattern
const LoginRoutes = createStackNavigator({
  Login: LoginScreen,
  SignUp: SignUpScreen,
  SignExtUp: SignUpExtScreen,
  ForgotPassword: ForgotPasswordScreen,
})

// NavigationTab pattern
const MapAndEventRoutes = createBottomTabNavigator({
  Map: {
    screen: MapScreen,
    navigationOptions: {
      tabBarLabel: 'Maps',
      tabBarIcon: ({ tintColor }) => (
        <Image source={require('./assets/map-icon.png')} style={{ tintColor: tintColor }} />
      )
    }
  },
  Events: {
    screen: EventScreen,
    navigationOptions: {
      tabBarLabel: 'Events',
      tabBarIcon: ({ tintColor }) => (
        <Image source={require('./assets/event-icon.png')} style={{ tintColor: tintColor }} />
      )
    }
  },
  Notify: {
    screen: NotifyScreen,
    navigationOptions: {
      tabBarLabel: 'Notifications',
      tabBarIcon: ({ tintColor }) => (
        <Image source={require('./assets/notify-icon.png')} style={{ tintColor: tintColor }} />
      )
    }
  },
  Setting: {
    screen: SettingScreen,
    navigationOptions: {
      tabBarLabel: 'Settings',
      tabBarIcon: ({ tintColor }) => (
        <Image source={require('./assets/settings-icon.png')} style={{ tintColor: tintColor }} />
      )
    }
  }
},
tabBarConfig
)

const ApplicationScreen = {
  Login: LoginRoutes,
  MapAndEvents: MapAndEventRoutes,
  Welcome : WelcomeScreen,
}
export { ApplicationScreen }