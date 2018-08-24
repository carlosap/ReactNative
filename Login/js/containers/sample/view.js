import React from 'react';
import styles from './styles';
import {View,Text,WebView} from 'react-native';
import {Environment} from '../../config';
var view = function(){
    let source = {uri:Environment.WEBVIEW_URL};//isStandaloneApp?{uri:Environment.WEBVIEW_URL}: require("./index.html")
	return (
		<WebView
			javaScriptEnabled={true}
			domStorageEnabled={true}
			javaScriptEnabledAndroid = {true}
			injectedJavaScript = {`
				setTimeout(function(){
					document.addEventListener("message",function(event){
						alert(event.data)
					})
					window.postMessage("Message from webview");

				})
			`}
			onMessage={(event)=>{
                this.webViewRef.postMessage( "Post message from react native" );
			}}
			ref = {(ref)=>{this.webViewRef = ref;}}
			style={{flex: 1,backgroundColor:"#ff5a60"}}
			source={source}
		/>
	)
}
module.exports = view;
