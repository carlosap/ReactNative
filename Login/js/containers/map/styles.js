import React from 'react-native'
import { Dimensions } from 'react-native'
import { Colors } from '@core-styles'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

var styles = React.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40
    },
    content: {
        paddingBottom: 100,
        paddingTop: 20,
    },
    map: {
        marginTop: 20
    },
    mapView: {
        width: width,
        height: height - 100
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
    }
})

export default styles
