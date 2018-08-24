import React, {Component} from 'react';
import ComponentView  from './view';
import {ActionSheet} from 'antd-mobile';
/**
 * @description Image Picker
 * @type Component
 * @author Inderdeep
 */
export default class Main extends Component {

    /**
     * Container
     * @param props
     */
    constructor(props) {
        super(props);

    }

    /**
     * ComponentDidMount Hook
     */
    componentDidMount() {

    }

    /**
     * On trigger press
     */
    onPress(onPress) {
        this.openMenu();
        if (onPress instanceof Function) {
            onPress()
        }
    }

    /**
     * Open Menu
     */
    openMenu() {
        const BUTTONS = ['Capture new image', 'Choose existing image', 'Cancel'];
        ActionSheet.showActionSheetWithOptions({
                options: BUTTONS,
                cancelButtonIndex: BUTTONS.length - 1,
                destructiveButtonIndex: BUTTONS.length - 2,
                message: 'Select Image',
                maskClosable: true
            },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        this.openCamera();
                        break;
                    case 1:
                        this.openGallery();
                        break;
                    default:
                        this.onCancel();
                        break;
                }
            });
    }

    /**
     * Open Camera
     */
    async openCamera() {
        let result = await Expo.ImagePicker.launchCameraAsync({
            base64: true
        });
        this.onImageSelected(result);
    }

    /**
     * Open gallery
     */
    async openGallery() {
        let result = await Expo.ImagePicker.launchImageLibraryAsync({
            mediaTypes: "Images",
            base64: true
        })
        this.onImageSelected(result);
    }

    /**
     * On Image Selected
     * @param result
     */
    onImageSelected(result) {
        const {onImageSelected} = this.props;
        if(!result.cancelled){
            result.base64Image = "data:image/png;base64,"+result.base64;
        }
        onImageSelected ? onImageSelected(result) : null;
    }

    /**
     * On Cancel
     */
    onCancel() {
        const {onCancel} = this.props;
        onCancel ? onCancel() : null;
    }

    /**
     * Render Method
     * @returns {*}
     */
    render() {
        return (ComponentView.bind(this))();
    }
}

Main.displayName = "Image-Picker";
