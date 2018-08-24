import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentView  from './view';

import { withNavigation } from 'react-navigation';
class Main extends Component {
  static get defaultProps() {
    return {
      propTypes : {
        text :PropTypes.string,
        onPress : PropTypes.function,
        style : PropTypes.object,
        textStyle : PropTypes.object,
        link : PropTypes.string
      }
    };
  }

  onPress(){
    let {onPress,link,navigation} = this.props;
    //console.log(navigation)
    if(onPress){
      onPress.apply(this,this.args);
    }
    if(link && navigation){
        navigation.navigate(link)
    }
  }
  render() {
    return (ComponentView.bind(this))();
  }
}
export default withNavigation(Main);
/**
 * Exporting linkwithoutnavigation because there
 * might be some components like header,drawer which dont have access
 * to react navigation navigation property and can cause a warning -
 * Warning: Failed context type: The context `navigation` is marked as required in `withNavigation(Main)`, but its value is `undefined`.
 * In those cases,use LinkWithoutNavigation if navigation property is passed, it will work else
 * handle using custom onPress event
 */
export {
    Main
} ;
