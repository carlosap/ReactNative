import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator
} from 'react-native';
import { Colors } from "./../styles";

const ModalLoader = props => {
  const {
    loading,
    size,
    indicatorColor
  } = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => { 
        //console.log('close modal') 
        
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            size={size ? size : "large"}
            color={indicatorColor ? indicatorColor : Colors.primaryColor}
            animating={loading} />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    // backgroundColor: rgba(0,0,0,.5),
    opacity: 0.7
  },
  activityIndicatorWrapper: {
    backgroundColor: Colors.black,
    height: 100,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  }
});

export default ModalLoader;