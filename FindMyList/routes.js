import React from 'react'
import { Image } from 'react-native'
import { TabNavigator, StackNavigator } from 'react-navigation'

import Tasks from './screens/Tasks'
import AddTask from './screens/AddTask'
import Insights from './screens/Insights'

const tabBarConfig = {
  initialRouteName: 'Tasks',
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

const TasksScreen = StackNavigator({
  Main: { screen: Tasks },
  AddTask: { screen: AddTask },
})

const InsightsScreen = StackNavigator({
  Main: { screen: Insights },
})

const ApplicationScreen = TabNavigator({
  Tasks: { screen: TasksScreen },
  Insights: { screen: InsightsScreen },
}, tabBarConfig)

export { ApplicationScreen }