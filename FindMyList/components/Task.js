import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  Alert,
  Animated
} from 'react-native'

import Swipeout from 'react-native-swipeout'
import TimeAgo from 'react-native-timeago'

class Task extends Component {
  constructor() {
    super()

    this.state = {
      hidden: false,
      lineThrough: false,
      animation: new Animated.Value(0)
    }
    this.removeTask = this.removeTask.bind(this)
    this.completeTask = this.completeTask.bind(this)
    this.showRemoveConfirm = this.showRemoveConfirm.bind(this)
  }

  hideElement(cb) {
    const config = { toValue: 0, duration: 400}

    Animated.timing(this.state.animation, config).start(() => {
      this.setState({ hidden: true })
      cb()
    })
  }

  completeTask() {
    const id = this.props.task.id

    this.setState({ lineThrough: true })
    this.hideElement(()=> this.props.actions.completeTask(id))
  }

  removeTask() {
    const id = this.props.task.id
    this.hideElement(()=> this.props.actions.removeTask(id))
  }

  showRemoveConfirm() {
    Alert.alert('Are you sure you want to delete this task?', null, [
      { text: 'Cancel', onPress: () => {} },
      { text: 'Delete', onPress: this.removeTask },
    ], { cancelable: false })
  }

  componentDidMount() {
    Animated.timing(this.state.animation, { toValue: 1, duration: 1000}).start()
  }

  render() {
    if(this.state.hidden) return null

    const { text, createdAt, completedAt, completed } = this.props.task

    const removeTaskButton = [{
      backgroundColor: '#ed7c8c',
      underlayColor: '#d84f62',
      component: <DeleteIcon style={styles.swipeIcon} />,
      onPress: this.showRemoveConfirm
    }]

    const completeTaskButton = !completed ? [{
      backgroundColor: '#7ced9f',
      underlayColor: '#4fd879',
      component: <CheckIcon style={styles.swipeIcon} />,
      onPress: this.completeTask
    }] : null

    const createOrCompleted = (completed)
      ? { text: 'completed', date: completedAt }
      : { text: 'created',  date: createdAt }

    return (
      <Animated.View style={{opacity: this.state.animation}}>
        <Swipeout
          right={removeTaskButton}
          left={completeTaskButton}
          backgroundColor='white'
          scroll={this.props.onScroll}
          style={styles.swipeItem}>
          <View style={styles.task}>
            <View style={styles.dateWrapper}>
              <ClockIcon style={styles.dateIcon} />
              <Text style={styles.date}>{createOrCompleted.text} <TimeAgo time={createOrCompleted.date} /></Text>
            </View>
            <Text
              style={[styles.taskText, {
                textDecorationLine: this.state.lineThrough || completed ? 'line-through' : 'none'}]}>{text}</Text>
          </View>
        </Swipeout>
      </Animated.View>
    )
  }
}

const styles = {
  wrapper: {
    flex: 1
  },
  swipeItem: {
    marginTop: 10,
  },
  task: {
    backgroundColor: 'white',
    padding: 20
  },
  swipeIcon: {
    flex: 1,
    tintColor: 'white',
    resizeMode: 'contain',
    width: 25,
    height: 25,
    alignSelf: 'center',
    flexDirection:'row',
    justifyContent:'center'
  },
  dateWrapper: {
    flexDirection: 'row'
  },
  dateIcon: {
    marginRight: 4,
    width: 15,
    height: 15,
    resizeMode: 'contain',
    tintColor: 'silver'
  },
  date: {
    marginTop: 1,
    fontSize: 10,
    color: 'silver'
  },
  taskText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'Karla',
    marginTop: 8
  },
}

const DeleteIcon = ({style}) => (
  <Image
    style={style}
    source={require('../images/icons/delete.png')} />
)

const CheckIcon = ({style}) => (
  <Image
    style={[style, { height: 32, width: 32 }]}
    source={require('../images/icons/check.png')} />
)

const ClockIcon = ({style}) => (
  <Image
    style={style}
    source={require('../images/icons/clock.png')} />
)

export default Task