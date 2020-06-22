import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { ifIphoneX } from "react-native-iphone-x-helper";
const logo = require('./../assets/image3.png');

const LogoContainer = props => {
  return (
    <View style={[styles.logoContainer]}>
      <Image resizeMode="contain" source={logo} style={[styles.logo]} />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch"
  },
  logo: {
    ...ifIphoneX(
      {
        width: 180,
        height: 180
      },
      {
        width: 130,
        height: 130
      }
    ),
    alignSelf: "center"
  }
});

export default LogoContainer;
