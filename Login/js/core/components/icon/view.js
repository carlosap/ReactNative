import React from 'react';
import styles from './styles';
import {View,Text,TouchableHighlight} from 'react-native';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';

const defaultIconSet ='font-awesome';
const iconMap = {
	'font-awesome' : FontAwesome,
	'simple-line-icons' : SimpleLineIcons,
	'ionicons' : Ionicons
}
var view = function(){
		let {type,name} = this.props;
		type = type || this.defaultIconSet;
		let Icon = iconMap[type];
		return (
			<Icon ref={(ref)=>{this.refs.icon = ref;}} {...this.props}/>
		);

}
module.exports = view;
