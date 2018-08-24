import React from 'react-native';
import {Colors} from '@core-styles';
import {ifIphoneX} from 'react-native-iphone-x-helper';

var styles = React.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primaryColor,
        padding: 20
    },
    logoContainer: {
        marginTop: 100,
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    logo: {
        ...ifIphoneX({
            width: 220,
            height: 220,
        }, {
            width: 180,
            height: 180,
        }),
        alignSelf: 'center'
    },
    form: {
        alignSelf: 'stretch',
        paddingTop: 20,
    },
    list: {
        backgroundColor: 'transparent'
    },
    language: {
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    label: {
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    button: {
        marginBottom: 10,
        borderRadius: 2,
        borderWidth: 0,
        height: 50,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    buttonText: {
        color: Colors.primaryColor,
        fontSize:15
    }
});

export default styles;
