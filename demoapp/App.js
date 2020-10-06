import React, { useState } from 'react';
import { View, FlatList, Alert, StyleSheet } from 'react-native';
import _ from 'lodash';
import Header from './components/Header';
import ListItem from './components/ListItem';
import AddItem from './components/AddItem';


const App = () => {


  const [items, setItems] = useState([
    { id: 'xay', text: 'the item one' },
    { id: 'xq7', text: 'the item two' },
    { id: 'sks', text: 'the item three' }
  ]);




  const deteleListItem = (id) => {
    setItems(currentItems => {
      return currentItems.filter(item => item.id != id)
    });
  }


  const addListItem = (text) => {
    if (_.isEmpty(text)) {
      Alert.alert('Error','New Item can not be empty')
    } else {
      setItems(currentItems => {
        return [{ id: getNewID(), text }, ...currentItems]
      })
    }
  }
  const getNewID = () => {
    return Math.random().toString(36).substr(2, 11);
  }

  return (
    <View style={styles.container}>
      <Header title="Home" />
      <AddItem addHandler={addListItem} />
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <ListItem
            item={item}
            deleteHandler={deteleListItem}
          />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex:1
  }
})


export default App;