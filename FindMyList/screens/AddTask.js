import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { TouchableOpacity, View, Text, Image } from 'react-native'
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput'

import * as taskActions from '../actions/tasks'
import Button from '../components/Button'

class AddTask extends Component {
  static navigationOptions = {
    title: 'Add Task',
    header: ({ goBack }) => ({
      style: {
        backgroundColor: '#2ad5d0',
      },
      tintColor: 'white',
      titleStyle: {
        color: 'white',
        fontFamily: 'Karla',
        fontWeight: 'normal',
        fontSize: 20
      },
      left: (
        <TouchableOpacity onPress={()=> goBack(null)} activeOpacity={.8}>
          <Image style={styles.backButton} source={require('../images/icons/back.png')} />
        </TouchableOpacity>
      )
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

  constructor() {
    super()

    this.state = { task: '' }
    this.addTask = this.addTask.bind(this)
  }

  addTask() {
    const task = this.state.task
    this.props.actions.addTask(task)
    this.props.navigation.goBack()
    this.setState({ task: '' })
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.label}>Your task</Text>
        <AutoGrowingTextInput
          ref='newTask'
          autocomplete={false}
          clearButtonMode='while-editing'
          onChange={(e) => this.setState({task: e.nativeEvent.text})}
          value={this.state.task}
          style={styles.input}
          placeholder='Enter your task...' />
        <Button
          onPress={this.addTask}
          style={styles.button}
          textStyle={styles.buttonText}
          label='Add task' />
      </View>
    )
  }
}

const styles = {
  wrapper: {
    flex: 1,
    backgroundColor: '#fcfcfc',
    padding: 20
  },
  label: {
    fontFamily: 'Karla',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#666'
  },
  button: {
    marginTop: 15,
    padding: 5,
    backgroundColor: '#16d0e9',
    alignItems: 'center',
    paddingVertical: 15,
    width: '50%',
    alignSelf: 'flex-end'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: 'white',
    height: 50,
    marginTop: 8,
    fontSize: 16,
    color: '#999',
    padding: 10,
    paddingBottom: 15,
    fontWeight: 'normal',
    fontFamily: 'Karla'
  },
  icon: {
    top: 2,
    height: 35,
    resizeMode: 'contain'
  },
  backButton: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginLeft: 10
  }
}

export default connect(
  (state) => ({ tasks: state.tasks }),
  (dispatch) => ({ actions: bindActionCreators(taskActions, dispatch) })
)(AddTask)