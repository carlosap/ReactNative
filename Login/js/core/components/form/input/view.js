import React from 'react';
import styles from './styles';
import {InputItem} from 'antd-mobile';

/**
 * JSX View
 * @returns {XML}
 */
var view = function () {
    const {keyboardType,value} = this.props;
    let {inputProps} = this.props;
    let {style } = this.props;
    style = style || {};
    inputProps = inputProps || {}
    let input = null;
    inputProps = {
        ...inputProps,
        onChange : this.onChange.bind(this),
        style : [styles.input, inputProps.style],
        value : this.state.value
    }
    switch (this.getType()){
        case "email" :
            input =  (
                <InputItem
                    type="text"
                    keyboardType = {keyboardType || "email-address"}
                    {...inputProps}
                />
            );
            break;
        case "password" :
            input = (
                <InputItem
                    type="password"
                    {...inputProps}
                />
            );
            break;
        case "number" :
            input = (
                <InputItem
                    type="number"
                    {...inputProps}
                />
            );
            break;
        case "phone" :
            input = (
                <InputItem
                    type="phone"
                    {...inputProps}
                />
            );
            break;
        case "bankCard" :
            input = (
                <InputItem
                    type="bankCard"
                    {...inputProps}
                />
            );
            break;
        default :
            input = (
                <InputItem
                    keyboardType = {keyboardType || "default"}
                    {...inputProps}
                />
            );
            break;
    }
    return input;
}
module.exports = view;
