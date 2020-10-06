import React from 'react';
import {View, Text, StyleSheet} from 'react-native';


const Header  = ({title}) => {
    return(
        <View style={styles.container}>
            <Text style={styles.text}>
                {title}
            </Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: "green"
    },
    text: {
        fontSize: 20,
        color: "yellow"
    }
})




export default Header;