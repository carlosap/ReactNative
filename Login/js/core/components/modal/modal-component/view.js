import React from 'react';
import {TouchableHighlight} from 'react-native';
import ModalBox from 'react-native-modalbox';
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from './styles';
import ModalUtils from '../modal-utils';
/**
 * View
 * @returns {XML}
 */
var view = function () {
    const {children,style,onHide,onShow,hideCloseButton,modalId,contentProps} = this.props;
    const {visible} = this.state;
    let content;
    if(modalId){
        /**
         * contentProps -> When modal Id is passed
         * @type {*}
         */
        let ModalScene = ModalUtils.getModalScene(modalId);
        content = ModalScene?<ModalScene {...contentProps}/>:null;
    } else {
        content = children
    }
    return (

        <ModalBox
            isOpen={visible}
            onOpened = {onShow}
            onClosed = {onHide}
            coverScreen = {false}
            backButtonClose = {true}
            backdrop = {false}
            swipeToClose = {false}
            onBackButtonPress = {this.hideModal.bind(this)}
            //onBackdropPress = {this.hideModal.bind(this)}
            backdropPressToClose = {true}

        >
            {
                !hideCloseButton?(
                    <TouchableHighlight underlayColor='transparent' onPress={this.hideModal.bind(this)} style={[styles.close]} >
                        <Ionicons name="ios-close-outline" style={[styles.closeIcon]}/>
                    </TouchableHighlight>
                ):null
            }
            {content}
        </ModalBox>

    )
}
module.exports = view;
