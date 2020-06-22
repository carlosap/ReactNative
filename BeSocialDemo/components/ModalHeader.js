import React, { Component } from "react";
import { Colors } from "./../styles";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform
} from "react-native";
import { Header, Icon } from "react-native-elements";
import { Share } from "react-native";
import Constants from 'expo-constants';
import { ifIphoneX } from 'react-native-iphone-x-helper';

let ScreenHeight = Dimensions.get("window").height;

const ModalHeader = props => {

  let onShare = async () => {
    try {
      const result = await Share.share({
        message:
          "E-Flyer Junkie :" + props.selectedItem.title + " : " + props.selectedItem.url,
      })

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const backButton = props.showBackButton ? (
    <TouchableOpacity onPress={props.onBackPress} style={styles.headerIconLeft}>
      <Icon
        name="arrow-left"
        type="font-awesome" size={26}
        color={Colors.white}
        underlayColor={Colors.black}
        style={styles.iconStyles} />
    </TouchableOpacity>
  ) : null;

  const closeButton = props.showCloseButton ? (
    <TouchableOpacity onPress={props.onBackPress} style={styles.headerIconRight}>
      <Icon
        name="times"
        type="font-awesome"
        color={Colors.white}
        underlayColor={Colors.black}
        style={styles.iconStyles} />
    </TouchableOpacity>
  ) : null;

  let shareButton = null;
  if (props.selectedItem) {
    shareButton = props.showShareButton && props.selectedItem.title && props.selectedItem.url ? (
      <TouchableOpacity onPress={props.onBackPress} style={styles.headerIconRight}>
        <Icon
          type="ionicon"
          color={Colors.white}
          name="md-share"
          onPress={onShare}
          underlayColor={Colors.black}
          style={styles.iconStyles} />
      </TouchableOpacity>
    ) : null;
  }

  return (
    <View style={styles.container}>
      <Header
        statusBarProps={{ translucent: true }}
        containerStyle={Platform.select({
          android: Platform.Version <= 20 ? { paddingTop: 0, height: 56 } : {},
        })}
        leftComponent={backButton}
        centerComponent={{
          text: props.title,
          style: {
            color: Colors.primaryColor,
            fontSize: 20,
            fontWeight: 'bold',
            paddingBottom: Platform.OS === "ios" ? Constants.statusBarHeight : 0
          }
        }}
        backgroundColor={Colors.black}
        rightComponent={shareButton ? shareButton : closeButton}
      />
    </View>
  );
};

export default ModalHeader;

const styles = StyleSheet.create({
  container: {

    ...ifIphoneX(
      {
        //marginTop: Platform.OS === "ios" ? Constants.statusBarHeight : -Constants.statusBarHeight,
      },
      {
        marginTop: Platform.OS === "ios" ? Constants.statusBarHeight : -Constants.statusBarHeight,
      }
    ),

    // marginTop: Constants.statusBarHeight,
    // height: ScreenHeight / 10
  },
  iconStyles: {
    padding: 20
  },
  headerIconRight: {
    ...ifIphoneX(
      {
        //paddingBottom: Platform.OS === "ios" ? Constants.statusBarHeight : 0,
      },
      {
        paddingBottom: Platform.OS === "ios" ? Constants.statusBarHeight : 0,
      }
    ),
    width: 70
  },
  headerIconLeft: {
    ...ifIphoneX(
      {
        //paddingBottom: Platform.OS === "ios" ? Constants.statusBarHeight : 0,
      },
      {
        paddingBottom: Platform.OS === "ios" ? Constants.statusBarHeight : 0,
      }
    ),
    width: 70
  }
});
