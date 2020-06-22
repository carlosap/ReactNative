import React, { Component } from "react";
import { Text, View,  StyleSheet } from "react-native";
import { Icon} from "react-native-elements";
import { Colors } from "./../../styles";

export default class NotificationItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      title,
      description,
      icon,
      isRead,
      height,
      width,
      roundCorners
    } = this.props;
    return (
      <View style={[styles.wraper,  styles.notReadStyle  ]} >
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
              isRead ? 
              <Icon type="material" color={Colors.primaryColor} size={30} name="notifications" marginTop={12} />  :
              <Icon type="material" color={Colors.primaryColor} size={30} name="notifications-none" marginTop={12} /> 
            ) : null}
          </View>
          <View style={{ flex: 1, padding: 10, paddingLeft: 0 }}>
            {title ? (
                <Text numberOfLines={1} style={[styles.titleinStyle]}>
                  {title}
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
    shadowColor: Colors.white,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    flexDirection: "row",
    borderRadius:12
  },
  readStyle:{
    backgroundColor:Colors.silverGray 
  },
  notReadStyle:{
   backgroundColor:Colors.orange
  },
  descriptionStyle: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 4,
    marginRight: 0,
    fontWeight: "200",
    color:Colors.black
  },
  titleinStyle: {
    fontSize: 18,
    marginLeft: 4,
    marginRight: 0,
    fontWeight: "700",
    color:Colors.black
  },
  dateStyle: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 2,
    marginLeft: 4,
    marginRight: 0,
    fontWeight: "200",
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
  }
});
