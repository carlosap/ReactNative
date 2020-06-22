import React, { Component } from 'react';
import { Colors } from "../styles";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Platform,
  Linking,
  Modal
} from "react-native";
import _ from "lodash";
import { Button, Icon } from "react-native-elements";
import ModalHeader from "../components/ModalHeader";
import DetailsModal from "../components/DetailsModal";
import { LogError } from './../global';
import moment from "moment";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const titleSplitIndex = 14;

class OverlayDialog extends Component {
  constructor(props) {
    super(props);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      modalVisible: false
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  closeModal() {
    this.setModalVisible(false);
  }

  openItemDetail = (item) => {
    if (!_.isEmpty(item)) {

      this.setState({
        selectedItem: item
      });

      this.setModalVisible(true);

    } else {
      this.setState({
        selectedItem: {},
      })
    }
  }

  //TODO:::duplicate code? move to global please
  isDoubleByte = (str) => {
    try {
      for (var i = 0, n = str.length; i < n; i++) {
        if (str.charCodeAt(i) > 255) { return i; }
      }
      
    } catch (error) {
      LogError('OverlayDiaglo::isDoubleByte', error);
    }

    return -1;
  }

  //TODO:::duplicate code? move to global
  unicodeEscape = (str) => {
    try {
      if (this.isDoubleByte(str) >= titleSplitIndex - 1)
        return str.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');
      
    } catch (error) {
      LogError('OverlayDialog::unicodeEscape', error);
    }
      return str;    
  }

  render() {
    try {
      const { modalVisible } = this.state;
      const { selectedItem, count } = this.props;
      const { bannerurl, title, createddate, description, url, starteventat, coordinates, mobileevent } = selectedItem;
      const { latitude, longitude } = coordinates;
      const latitudeLocal = latitude ? latitude : 27.8582758;  //????
      const longitudeLocal = longitude ? longitude : -82.6953062;
      let createddateLocal = createddate ? createddate : "10:00 AM";
      let decriptionSanitized = description.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, " ");

      return (
        <View style={{ flex: 1, margin: 10 }}>
          {/* info  section */}
          <View style={{ flex: 1, flexDirection: "row", alignSelf: 'flex-start', justifyContent: "space-between" }}>
            {/* side image section */}
            <View style={{ width: "30%" }}>
              <Image style={{ width: 100, height: 100 }} source={{ uri: bannerurl }} />
            </View>
  
            <View style={{ width: "70%", paddingLeft: 20, paddingBottom: 20, flexDirection: "column" }}>
              {/* title  section */}
              {title ?
                <Text style={styles.titleStyle}>
                  {title.length > titleSplitIndex ? `${this.unicodeEscape(title).toUpperCase().substr(0, titleSplitIndex)}...` : title.toUpperCase()}
                </Text>
                : null}
  
              {/* date section */}
              {starteventat ?
                <Text
                  style={{ fontSize: 16, fontWeight: "700", color: Colors.white }}
                >
                  {moment(starteventat).format("MMMM Do YYYY")}
                </Text>
                : null}
  
              {/* Population section */}
              <Text style={{ color: Colors.orange, fontWeight: "700", marginTop: 3, marginBottom: 3 }}>
                App users in radius : <Text style={{ color: Colors.white }}> {count}</Text>
              </Text>
  
              {/* description section */}
              {decriptionSanitized ?
                <Text numberOfLines={1} style={{ fontSize: 16, color: Colors.white, marginTop: 3, marginBottom: 3 }}>
                  {decriptionSanitized.length > 50 ?
                    `${decriptionSanitized.substr(0, 50)}...`
                    : `${decriptionSanitized}`
                  }
                </Text>
                : null}
  
              {/* mobile section */}
              {mobileevent ?
                <Text style={{ fontSize: 16, color: Colors.green, marginTop: 3, marginBottom: 3 }}>
                  *** Mobile ***</Text>
                : null}
            </View>
          </View>
          {/* button  section */}
          <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-end", alignSelf: "flex-end" }}>
            {/* More Info  section */}
            <View style={{ flex: 1, height: 50, paddingTop: 16 }}>
              <Modal
                animationType="slide"
                transparent={false}
                swipeArea={20}
                visible={modalVisible}
                onRequestClose={() => {
                  this.setModalVisible(false);
                }}
              >
                <ModalHeader title="Events" showBackButton={false} showCloseButton={true} onBackPress={this.closeModal} />
                <DetailsModal selectedItem={selectedItem} promocode={true} type="events" />
              </Modal>
  
              <Button
                title="More Info"
                titleStyle={{ paddingLeft: 10, color: Colors.white }}
                icon={<Icon type="ionicon" color={Colors.white} size={18} name="md-link" paddingTop={3} />}
                buttonStyle={{
                  justifyContent: 'center', alignItems: 'center', alignSelf: 'center', paddingTop: 3,
                  backgroundColor: Colors.primaryColor, paddingLeft: 10, width: width / 3, height: 36
                }}
                onPress={() => {
                  this.openItemDetail(selectedItem)
                  // Linking.openURL(url);
                }}
              /></View>
  
            {/* direction   section */}
            {latitudeLocal && longitudeLocal ? <View style={{ flex: 1, height: 50, paddingTop: 16 }}>
              <Button
                title="Direction"
                titleStyle={{ paddingLeft: 10, color: Colors.white }}
                icon={<Icon type="ionicon" color={Colors.white} size={18} name="md-map" paddingTop={4} paddingTop={3} />}
                buttonStyle={{
                  justifyContent: 'center', alignItems: 'center', alignSelf: 'center', paddingTop: 3,
                  backgroundColor: Colors.primaryColor, paddingLeft: 10, width: width / 3, height: 36
                }}
                onPress={() => {
                  const url = Platform.select({
                    // ios: "maps:" + latitudeLocal + "," + longitudeLocal,
                    // android: "geo:" + latitudeLocal + "," + longitudeLocal
                    ios: "maps://app?daddr=" + latitudeLocal + "," + longitudeLocal,
                    android: "google.navigation:q=" + latitudeLocal + "," + longitudeLocal
                  });
                  Linking.openURL(url).then(supported => {
                    if (supported) {
                      return Linking.openURL(url);
                    } else {
                      browser_url =
                        // "https://www.google.de/maps/@" +
                        "https://www.google.com/maps/place" +
                        latitude +
                        "," +
                        longitude;
                      return Linking.openURL(browser_url);
                    }
                  });
                }}
              /></View> : null}
          </View>
        </View>
      )

    } catch (error) {
      LogError('OverlayDialog::render', error);
      return null;
    }
  }
}

export default OverlayDialog;

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: Colors.white,
    borderRadius: 5,
    paddingVertical: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  titleStyle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 3,
    marginBottom: 3,
    color: Colors.primaryColor
  },
  shortTitleStyle: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
    marginBottom: 3,
    color: Colors.primaryColor
  }

});

