import React from 'react-native';
import {Colors, Button} from '@core-styles';

var styles = React.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40
    },
    scrollBox: {
        flex: 1,
    },
    content: {
        paddingBottom: 100,
        paddingTop: 20,
    },
    button: {
        marginBottom: 10,
        marginTop: 30,
        borderRadius: 2,
        borderWidth: 0,
        height: 57,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 2,
        backgroundColor: Colors.primaryColor
    },
    buttonText: {
        color: '#fff'
    },
    form: {
        backgroundColor: '#fff',
        margin: 10,
        marginTop: 20,
    },
    fieldLabel: {
        color: Colors.brandRed,
        marginBottom: 10
    },
    input: {
        marginBottom: 25,
        borderWidth: 0,
        borderBottomWidth: 1,
        padding: 0,
        paddingLeft: 0,
        height: 35,
        margin:0
    },
    inputIcon: {
        color: Colors.primaryColor
    },
    text: {
        color: Colors.brandRed
    },
    backBtn: {
        position: 'absolute',
        top: 40,
        left: 10,
        zIndex: 2
    },
    backLink: {
        padding: 10,
        paddingTop: 0
    },
    backIcon: {
        width: 20,
        height: 20
    },
    label:{
        color: Colors.brandRed,
        fontSize:20,
        marginBottom:40,
        textAlign:'center'
    },
    noCurrentPassword:{
        marginBottom:20,
        color:'#9c9c9c'
    }
});

export default styles;
