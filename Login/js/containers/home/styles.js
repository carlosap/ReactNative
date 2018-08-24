import React from 'react-native';
import {Dimensions} from 'react-native';
import {Colors} from '@core-styles';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

var styles = React.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    imageContainer: {
        flex: 1,
        alignItems: 'stretch',
        overflow: 'hidden'
    },
    image: {
        flex: 1,
        width: deviceWidth
    },
    trigger:{
        position:'absolute',
        left:-24,
        top:deviceHeight/3
    },
    triggerIcon:{
        width:60,
        height:100
    }

});

export default styles;
