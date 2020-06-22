import React, { Component } from "react";
import MapView from 'react-native-maps';
import {
    StyleSheet,
    Image
} from "react-native";



class CurrentUserMapMarker extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { heading, coordinate ,flag } = this.props;

        return (
            <MapView.Marker.Animated
                coordinate={coordinate}
                style={{
                    transform: [{
                        rotate: (typeof heading === 'number'
                            && heading >= 0) ? `${heading}deg` : '270deg'
                    }]
                }}
            >
                <Image
                    style={styles.imageStyle}
                    source={flag}
                />
            </MapView.Marker.Animated>
        );
    };
}
const styles = StyleSheet.create({
    imageStyle: {
        height: 35,
        width: 35,
        transform: [{
            rotate: '270deg'
        }]
    }
})

export default CurrentUserMapMarker;
