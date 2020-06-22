import React from "react";
import { View, StyleSheet, Dimensions, Platform } from "react-native";
import { Header } from "react-native-elements";
import Constants from 'expo-constants';
import { Colors } from "./../styles";

let ScreenHeight = Dimensions.get("window").height;

const SimpleHeader = props => {
  return (
    <View style={styles.container}>
      <Header
        centerComponent={{
          text: props.title,
          style: props.style ? [styles.baseStyle, props.style] : styles.baseStyle
        }}
        backgroundColor={Colors.black}
      />
    </View>
  );
};

export default SimpleHeader;

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "ios" ? Constants.statusBarHeight : -Constants.statusBarHeight / 8,
    // marginTop: Constants.statusBarHeight,
    // height: ScreenHeight / 10
  },
  baseStyle: {
    color: Colors.primaryColor,
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: Platform.OS === "ios" ? Constants.statusBarHeight : 0
  }
});
