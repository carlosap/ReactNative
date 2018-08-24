import React from 'react';
import styles from './styles';
import {View,Text,WebView} from 'react-native';
import {Modal} from '@core-components';
import WebJavascript from './web-javascript';
import {Environment} from '../../config';
import Expo from 'expo';
import Spinner from '../spinner'
const isStandaloneApp = Expo.Constants.appOwnership=="standalone";
var view = function(){
	const {url,style,scriptId,onHide} = this.props;
	const {visible} = this.state;
    /**
	 * When the app is installed as a standalone app
	 * the require file will not work with firebase as
	 * firebase only supports the html file opened from
	 * a web url and not something like about://
     */
	let source = {uri:Environment.WEBVIEW_URL};//isStandaloneApp?{uri:Environment.WEBVIEW_URL}: require("./index.html")
	return (
		<Modal visible={visible} onHide = {onHide}>
			{
                visible?(
					<WebView
						onLoadStart = {Spinner.start}
						onLoad = {Spinner.stop}
						javaScriptEnabled={true}
						domStorageEnabled={true}
						javaScriptEnabledAndroid = {true}
						injectedJavaScript = {WebJavascript[scriptId]}
						ref = {(ref)=>{this.webViewRef = ref;}}
						style={{flex: 1,backgroundColor:"#ff5a60",...style}}
						source={source}
						onNavigationStateChange={this.onNavigationStateChange.bind(this)}
						onError={this.onError.bind(this)}
						onLoadingError = {this.onError.bind(this)}
					/>
				):null
			}
		</Modal>
	)
}
module.exports = view;
