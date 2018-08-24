import React from 'react';
import {View} from 'react-native';
import Modal from '../modal-component';
/**
 * View
 * @returns {XML}
 */
var view = function () {
    const {children, content} = this.props;
    const {visible} = this.state;
    /**
     * Modal Props are the actual Modal Properties supported by modal component
     */
    let {style,modalProps} = this.props;
    style = style || {}
    modalProps = modalProps || {}
    /**
     * This modal implementation will work for a single child based mode
     * and the child should support the onPress or onClick event
     */
    let modifiedChildren = React.cloneElement(children, {
        onPress: (event) => {
            this.onPress(children.props.onPress)
        },
        onClick: (event) => {
            this.onPress(children.props.onPress)
        }
    });
    return (
        <View style = {style.container}>
            {modifiedChildren}
            <Modal
                visible={visible}
                {...modalProps}
                style = {style.modal}
            >
                {content}
            </Modal>
        </View>
    )
}
module.exports = view;
