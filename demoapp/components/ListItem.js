import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet, Button} from 'react-native';


const ListItem = ({item, deleteHandler}) => {
    return (
        <TouchableOpacity style={styles.container}>
            <View style={styles.listView}>
                <Text style={styles.text}>{item.text}</Text>
                <Button
                    title="Delete"
                    color="red"
                    onPress= {() => deleteHandler(item.id)}


                />
            </View>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: "lightgrey",
        borderBottomWidth: 1,
        borderColor: '#eee'
    },
    listView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'


    },
    text: {
        fontSize: 18
    }
})
export default ListItem;