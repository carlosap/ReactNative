import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, Image, View } from 'react-native'
import { VictoryPie } from 'victory-native'

const getCompleted = tasks => (
  tasks.filter((data) => data.completed).length
)

const getUncompleted = tasks => (
  tasks.filter((data) => !data.completed).length
)

class Analytics extends Component {
  static navigationOptions = {
    title: 'Insights',
    header: {
      style: {
        backgroundColor: '#2ad5d0',
      },
      tintColor: 'white',
      titleStyle: {
        color: 'white',
        fontFamily: 'Karla',
        fontWeight: 'normal',
        fontSize: 20
      }
    },
    tabBar: {
      label: 'Insights',
      icon: ({ tintColor }) => (
        <Image
          source={require('../images/icons/analytics.png')}
          style={[styles.icon, { tintColor }]} />
      )
    }
  }

  getData(tasks) {
    if(!tasks.length) return []

    return [
      {
        type: 'Completed',
        total: getCompleted(tasks)
      },
      {
        type: 'Not Completed',
        total: getUncompleted(tasks)
      }
    ]
  }

  render() {
    const { tasks } = this.props
    const data = this.getData(tasks)

    if(!tasks.length) return <Text>Add some tasks!</Text>

    return (
      <View style={styles.wrapper}>
        <View style={styles.stats}>
          <View style={[styles.column, {backgroundColor: '#b878cc'}]}>
            <Text style={styles.value}>
              { getUncompleted(tasks) }
            </Text>
            <Text style={styles.label}>
              To do
            </Text>
          </View>

          <View style={[styles.column, {backgroundColor: '#47daae'}]}>
            <Text style={styles.value}>
              { getCompleted(tasks) }
            </Text>
            <Text style={styles.label}>
              Completed
            </Text>
          </View>
        </View>

        <View style={styles.chart}>
          <Text style={styles.total}>You currently have <Text style={styles.bold}>{tasks.length}</Text> tasks</Text>

          <VictoryPie
            width={350}
            height={350}
            innerRadius={120}
            labelRadius={70}
            colorScale={['#47daae', '#b878cc']}
            style={{ labels: styles.label}}
            data={data}
            x='type'
            y='total'
            animate={{duration: 1500}} />
        </View>
      </View>
    )
  }
}

const styles = {
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Karla',
    fontWeight: 'bold'
  },
  total: {
    marginTop: 40,
    marginBottom: 10,
    fontSize: 16,
    color: 'silver',
    fontFamily: 'Karla',
    alignSelf: 'center'
  },
  bold: {
    color: 'gray',
    fontWeight: 'bold'
  },
  stats: {
    width: '100%',
    height: 100,
    backgroundColor: '#ddd',
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 40,
    fontFamily: 'Karla',
    fontWeight: 'bold',
    color: 'white'
  },
  icon: {
    top: 2,
    height: 35,
    resizeMode: 'contain'
  },
}

export default connect(
  (state) => ({ tasks: state.tasks })
)(Analytics)