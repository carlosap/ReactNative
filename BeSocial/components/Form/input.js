import React, { Component } from 'react';
import { StyleSheet } from 'react-native'
import {InputItem} from 'antd-mobile-rn';

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || ""
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.value != nextProps.value) {
      this.setState({
        value: nextProps.value
      })
    }
  }

  onChange(value) {
    const { onChange } = this.props;
    this.setState({ value });
    if (onChange) {
      onChange(value);
    }
  }

  getIcon() {
    let { icon } = this.props;
    if (typeof icon == 'undefined') {
      switch (this.getType()) {
        case "email":
          return "envelope";
        case "password":
          return "lock";
        case "phone":
          return "phone";
        case "number":
          return "lock";
        default:
          return null;
      }

    }
    return icon;
  }

  getType() {
    const { type } = this.props;
    return (type || "").toLowerCase()
  }



  render() {
    const { keyboardType, value } = this.props;
    let { inputProps } = this.props;
    let { style } = this.props;
    style = style || {};
    inputProps = inputProps || {}
    let input = null;
    inputProps = {
      ...inputProps,
      onChange: this.onChange.bind(this),
      style: [styles.input, inputProps.style],
      value: this.state.value
    }

    switch (this.getType()) {
      case "email":
        input = (<InputItem type="text" keyboardType={keyboardType || "email-address"} {...inputProps} />);
        break;
      case "password":
        input = (<InputItem type="password" {...inputProps} />);
        break;
      case "number":
        input = (<InputItem type="number" {...inputProps} />);
        break;
      case "phone":
        input = (<InputItem type="phone" {...inputProps} />);
        break;
      case "bankCard":
        input = (<InputItem type="bankCard" {...inputProps} />);
        break;
      default:
        input = (<TextInput keyboardType={keyboardType || "default"} {...inputProps} />);
        break;
    }

    return input
  }
}

const styles = StyleSheet.create({
  input: {
    height: 45,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 38,
    borderColor: '#e6e6e6',
    borderWidth: 1,
    borderRadius: 5
  },
  inputIcon: { position: 'absolute', left: 10, top: 13, zIndex: 2, fontSize: 18, backgroundColor: '#fff' }
});



export default Input