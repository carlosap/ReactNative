import React from 'react';
import styles from './styles';
import {View,Text} from 'react-native';

var view = function(){
	return (
		<View>
			<Text>{this.props.nativeAd.description}</Text>
		</View>
	)
}
module.exports = view;
