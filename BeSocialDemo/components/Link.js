import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableHighlight } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Colors}  from "./../styles";

class Link extends Component {
  static get defaultProps() {
    return {
      propTypes: {
        text: PropTypes.string,
        onPress: PropTypes.function,
        style: PropTypes.object,
        textStyle: PropTypes.object,
        link: PropTypes.string
      }
    };
  }

  onPress() {
    let { onPress, link, navigation } = this.props;
    
    if (onPress) {
      onPress.apply(this, this.args);
    }
    if (link && navigation) {
      navigation.navigate(link)
    }
  }

  render() {
    let { textStyle, style, text, children } = this.props;
    let markUp = null;

    if (children) {
      markUp = children;
    } else {
      markUp = (<Text style={[styles.text, textStyle]}>{text}</Text>)
    }

    return (
      <TouchableHighlight underlayColor='transparent' style={[styles.container, style]} onPress={this.onPress.bind(this)}>
        <View>
          {markUp}
        </View>
      </TouchableHighlight>
    );
  }
}

export default withNavigation(Link);

const styles = {
  container: {},
  text: {
    color: Colors.lightGray,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right'
  }
}
