import React, { Component } from "react";
import { Text, View, ActivityIndicator, StyleSheet } from "react-native";
import { Image } from "react-native-elements";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Colors } from "./../../styles";

import moment from "moment";

export default class EventsItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      title,
      description,
      starteventat,
      image,
      icon,
      isRead,
      height,
      width,
      roundCorners
    } = this.props;
    return (
      <View style={[styles.wraper]}>
        <View
          style={[
            styles.listRow,
            {
              borderRadius: roundCorners ? 10 : 0
            }
          ]}
        >
          <View
            style={{
              height: height ? height : 50,
              width: width ? width : 50,
              alignItems: "center"
            }}
          >
            {/*  Icon  */}
            {icon ? (
              <MaterialIcons
                name={isRead ? "notifications-none" : "notifications"}
                size={30}
                style={styles.icon}
              />
            ) : null}

            {/*  Image  */}
            {image ? (
              <Image
                resizeMode= "contain"
                containerStyle={{ 
                  height: height ? height : 50,
                  width: width ? width : 50,
                  borderRadius: roundCorners ? 10 : 0,
                  backgroundColor: Colors.black
                }}
                source={{ uri: image }}
                PlaceholderContent={
                  <View style={styles.activityIndicatorWrapper}>
                  <ActivityIndicator color={Colors.primaryColor} />
                  </View>
                }
              />
            ) : null}
          </View>
          <View style={{ flex: 1, padding: 10, paddingLeft: 0 }}>
            {title ? (
                <Text numberOfLines={1} style={[styles.titleinStyle]}>
                  {title}
                </Text>
              ) : null}
            {starteventat ? (
                <Text style={[styles.dateStyle]}>
                  {moment(starteventat).format("MMMM Do YYYY")}
                </Text>
            ) : null}
            {description ? (
              <Text numberOfLines={3} style={[styles.descriptionStyle]}>
                 {description.length > 50 ? `${description.substr(0, 50)}...` : description}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wraper: {
    marginTop: 8,
    marginRight: 8,
    marginBottom: 8,
    marginLeft: 8,
    flexDirection: "row"
  },
  descriptionStyle: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 4,
    marginRight: 0,
    fontWeight: "200",
    color:Colors.orange
  },
  titleinStyle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 3,
    marginBottom: 3,
    color: Colors.primaryColor
  },
  dateStyle: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 2,
    marginLeft: 4,
    marginRight: 0,
    fontWeight: "700",
    color: Colors.white
  },
  timeStyle: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 2,
    marginLeft: 4,
    marginRight: 0,
    fontWeight: "200",
    color: Colors.secondaryColor
  },
  listRow: {
    flex: 1,
    flexDirection: "row"
  },
  icon: {
    marginTop: 12,
    color: Colors.darkGray
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
