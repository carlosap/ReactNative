import React from 'react-native';

var styles = React.StyleSheet.create({
    input: {
        height: 45,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 10,
        paddingLeft: 38,
        borderColor: '#e6e6e6',
        borderWidth: 1,
        //Commented it since antd input does not support it
        //fontSize: 14,
        borderRadius: 5
    },
    inputIcon: {position: 'absolute', left: 10, top: 13, zIndex: 2, fontSize: 18, backgroundColor: '#fff'}
});

export default styles;
