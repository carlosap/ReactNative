import React from 'react';
import styles from './styles';
import {View,TouchableHighlight} from 'react-native';
/**
 * View
 * @returns {XML}
 */
var view = function(){
    const {children} = this.props;
    //console.log(children.length)
    //console.log(children)
    if(typeof children.length != 'undefined' && children.length>1){
    	throw new Error("There should be exactly single child for Image Picker Component")
	}

    /**
     * This  implementation will work for a single child based mode
     * and the child should support the onPress event
     */
    let child = typeof children.length != 'undefined'?children[0]:children;
    let modifiedChildren = React.cloneElement(child, {
        onPress: (event) => {
            this.onPress(child.props.onPress)
        }
    });
	return (
		<View>
			{modifiedChildren}
		</View>
	)
}
module.exports = view;
