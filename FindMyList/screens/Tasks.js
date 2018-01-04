import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { TouchableOpacity, View, Text, Image } from 'react-native'
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view'

import * as taskActions from '../actions/tasks'
import TaskList from '../components/TaskList'

const AddButton = ({ navigate, test }) => {
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={() => navigate('AddTask')}>
      <Image
        source={require('../images/icons/add.png')}
        style={styles.addButton} />
    </TouchableOpacity>
  )
}

class Tasks extends Component {
  static navigationOptions = {
    title: 'My Tasks',
    header: (opts) => ({
      style: {
        backgroundColor: '#2ad5d0',
      },
      titleStyle: {
        color: 'white',
        fontFamily: 'Karla',
        fontWeight: 'normal',
        fontSize: 20,
      },
      right: <AddButton navigate={opts.navigate} test={this} />
    }),
    tabBar: {
      label: 'My Tasks',
      icon: ({ tintColor }) => (
        <Image
          source={require('../images/icons/tasks.png')}
          style={[styles.icon, { tintColor }]} />
      )
    }
  }

  render() {
    const tasks = this.props.tasks
    const tasksCompleted = tasks.filter(task => task.completed)
    const tasksUncompleted = tasks.filter(task => !task.completed)

    const tabBarComponent = (
      <DefaultTabBar
        activeTextColor={'#666'}
        inactiveTextColor={'#999'}
        underlineStyle={{backgroundColor: '#16d0e9'}}
        style={{borderColor: '#eee'}}
        textStyle={styles.tab} />
    )

    return (
      <View style={styles.wrapper}>
        <ScrollableTabView locked={true} style={styles.tabs} renderTabBar={() => tabBarComponent}>
          <TaskList
            tabLabel={`TO DO (${tasksUncompleted.length})`}
            tasks={tasksUncompleted}
            actions={this.props.actions} />

          <TaskList
            tabLabel={`COMPLETED (${tasksCompleted.length})`}
            tasks={tasksCompleted}
            actions={this.props.actions} />
        </ScrollableTabView>
      </View>
    )
  }
}

const styles = {
  wrapper: {
    flex: 1,
    backgroundColor: '#fcfcfc'
  },

  tabs: {
    paddingTop: 20,
  },

  tab: {
    fontSize: 18,
    fontFamily: 'Karla',
    fontWeight: 'bold',
    letterSpacing: -0.3,
  },

  icon: {
    top: 2,
    height: 35,
    resizeMode: 'contain'
  },

  addButton: {
    marginRight: 10,
    width: 30,
    height: 30,
    resizeMode: 'contain'
  }
}

export default connect(
  (state) => ({ tasks: state.tasks }),
  (dispatch) => ({ actions: bindActionCreators(taskActions, dispatch) })
)(Tasks)