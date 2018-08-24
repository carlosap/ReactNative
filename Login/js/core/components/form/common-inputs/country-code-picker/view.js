import React from 'react';
import styles from './styles';
import {View,Text} from 'react-native';
import {Picker, List} from 'antd-mobile';
import ListItemStyle from 'antd-mobile/lib/list/style/index.native';
/**
 * View
 * @returns {XML}
 */
var view = function(){
	const {title,arrow,pickerProps} = this.props;
	let {style,listItemStyles} = this.props;
	const {value} = this.state;
    style = style || {};
	return (
		<Picker
            {...pickerProps}
			title={title || "Country Code"}
			cascade={false}
			data={this.getCountryCodeMap()}
			onChange = {this.onChange.bind(this)}
			value = {value}
		>
			<List.Item arrow={arrow || "horizontal"}
					   styles = {{
                           ...ListItemStyle,
                           Line : {
                               ...ListItemStyle.Line,
                               borderBottomWidth : 0,
                               ...style.line
                           },
                           Extra : {
                               ...ListItemStyle.Extra,
                               color : "#000",
							   ...style.value
                           },
                           underlayColor : {
                               ...ListItemStyle.underlayColor,
                               backgroundColor : 'transparent',
                               ...style.underlay
                           },
						   ...listItemStyles
                       }}
					   style={[style.listItem]}>
				<Text style={[style.label]}>
                    {title || "Country Code"}
				</Text>
			</List.Item>
		</Picker>
	)
}
module.exports = view;
