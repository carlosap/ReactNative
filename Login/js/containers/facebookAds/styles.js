import React from 'react-native'
import { Colors, Button } from '@core-styles'

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
    facebookAds: {
        marginTop: 20
    },
    section: {
        marginBottom:30,
    },
    ad:{
        overflow: 'hidden',
        paddingBottom:40,
        backgroundColor: '#fafafa',
    },
    item: {
        padding: 18,
        marginBottom: 5,
        backgroundColor: '#fafafa'
    },
    text: {
        color: Colors.brandRed,
        fontSize: 14,
        fontWeight: 'bold',
        margin: 10
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
