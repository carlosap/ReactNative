import React, { Component } from 'react'
import { View, Text, Image, ScrollView } from 'react-native'
import Task from './Task'

class TaskList extends Component {
  constructor() {
    super()

    this.state = { scrollEnabled: true }
    this.onScroll = this.onScroll.bind(this)
  }

  onScroll(scrolling) {
    this.setState({ scrollEnabled: scrolling })
  }

  render() {
    const { tasks } = this.props

    if(!tasks.length) {
      return <Text style={styles.noItems}>No items here!</Text>
    }

    return (
      <ScrollView style={styles.wrapper} scrollEnabled={this.state.scrollEnabled}>
      {
        tasks.map((item, id) => (
          <Task task={item} actions={this.props.actions} key={item.id} onScroll={this.onScroll} />
        ))
      }
      </ScrollView>
    )
  }
}

const styles = {
  wrapper: {
  },
  noItems: {
    alignSelf: 'center',
    color: 'silver',
    fontFamily: 'Karla',
    marginTop: 100
  }
}

export default TaskList