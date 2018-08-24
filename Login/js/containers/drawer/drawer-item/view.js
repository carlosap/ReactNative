import React from 'react';
import styles from './styles';
import {View, Text, TouchableHighlight, Image} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';

var view = function () {
    const {translate} = this.props;
    return (
        <TouchableHighlight underlayColor="transparent" onPress={this.onPress.bind(this)}>
            <View style={[styles.drawerNavItem]}>
                {this.props.item.icon ? (<Icon name={this.props.item.icon} size={25} color="#fff"
                                               style={[styles.drawerNavItemIcon]}/>) : null}
                <Text style={styles.drawerItemText}>{translate(this.props.item.title)}</Text>
            </View>
        </TouchableHighlight>
    )
}
module.exports = view;
