import React from 'react';
import PropTypes from 'prop-types';
import { Colors } from "./../styles";

import {
  StyleSheet,
  View,
  Image,
} from 'react-native';

const propTypes = {
  banner: PropTypes.object.isRequired,
  fontSize: PropTypes.number,
};

const defaultProps = {
  fontSize: 13,
};

class BubbleMarker extends React.Component {
  render() {
    const { fontSize, banner,mobileevent } = this.props;  
    return (
      <View style={styles.container}>
        <View style={[styles.bubble, mobileevent ? styles.bubblegreen : styles.bubbleblack ]}>
          <Image
            source={banner}
            style={{ width: 40, height: 40 }}
          />
        </View>
        <View style={[styles.arrowBorder, mobileevent ? styles.arrowgreen : styles.arrowblack]} />
          <View style={styles.arrowBorder} />
        {/* <View style={styles.arrow} /> */}
      </View>
    );
  }
}

BubbleMarker.propTypes = propTypes;
BubbleMarker.defaultProps = defaultProps;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    zIndex : 2000
  },
  bubble: {
    flex: 0,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    padding: 2,
    borderRadius: 3,
    borderWidth: 0.5,
    zIndex : 2000
  },
  bubbleblack:{
    borderColor: Colors.black,
    backgroundColor: Colors.black,
  },
  bubblegreen:{
    borderColor: Colors.green,
    backgroundColor: Colors.green,
  },
  banner: {
    color: Colors.white,
    fontSize: 13,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 10,
    borderColor: 'transparent',
    borderTopColor: Colors.black,
    alignSelf: 'center',
    marginTop: -9,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderWidth: 10,
    borderColor: 'transparent',
    alignSelf: 'center',
    marginTop: -0.5,
  },
  arrowgreen :{

    borderTopColor: Colors.green,
  },
  arrowblack :{

    borderTopColor: Colors.black,
  }
});

export default BubbleMarker;
