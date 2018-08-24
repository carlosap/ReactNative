import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentView  from './view';
export default class Main extends Component {
  static get defaultProps() {
    return {
      propTypes : {
        text :PropTypes.string,
        name : PropTypes.string
      }
    };
  }
  setNativeProps(nativeProps){
    this.refs.icon?this.refs.icon.setNativeProps(nativeProps):null;
  }

  render() {
    return (ComponentView.bind(this))();
  }
}
