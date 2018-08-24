import React from 'react-native'
import { Colors, Button } from '@core-styles'

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
    analytics: {
        marginTop: 20
    },
    item: {
        padding: 18,
        marginBottom: 5,
        backgroundColor: '#fafafa'
    },
    text: {
        color: Colors.brandRed,
        fontSize: 14
    },
    message: {
        padding: 18,
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
        color: Colors.brandRed,
        marginBottom: 8
    },
    info: {
        color: '#555'
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
