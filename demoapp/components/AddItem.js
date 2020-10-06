import React, {useState}  from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity,Text } from 'react-native';


const AddItem = ({addHandler}) => {


    const [text, setText]  = useState('');
    const onChange = value => setText(value);


    return (


        <View>
            <TextInput
                onChangeText={onChange}
                value={text}
                placeholder='Add new Item...'
                style={styles.input}


            />
            <TouchableOpacity style={styles.btn} onPress={() => {
                addHandler(text);
                console.log('hlelerle')
                setText('');
            }}>
                <Text style={styles.btnText}>
                    Add New Item
                </Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    input: {
        height: 60,
        padding: 8,
        fontSize: 16
    },
    btn: {
        backgroundColor: 'black',
        padding: 10,
        margin: 5,
    },
    btnText: {
        color: "lightblue",
        fontSize: 20,
        textAlign: 'center'
    }
})
export default AddItem;