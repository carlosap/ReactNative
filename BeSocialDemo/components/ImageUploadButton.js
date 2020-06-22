import React, { Component } from "react";
import _ from "lodash";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
  ImageBackground,
  ScrollView,
  Dimensions
} from "react-native";
import { Button } from "react-native-elements";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { storageImage } from "../firebase-db";
import { H5 } from "nachos-ui";
import { Colors } from "./../styles";
const BG_IMAGE = require("../assets/citybg.png");
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

class ImageUploadButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      bgImage: BG_IMAGE
    };
    this.onChooseImagePress = this.onChooseImagePress.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.uriToBlob = this.uriToBlob.bind(this);
  }

  onChooseImagePress = async () => {
    const { status: cameraRollPerm } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    // only if user allows permission to camera roll
    if (cameraRollPerm === "granted") {
      // let result = await ImagePicker.launchCameraAsync();
      const { onUploading } = this.props;
      this.setState({ bgImage: "" });
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        onUploading();
        this.setState({
          loading: true,
          bgImage: BG_IMAGE
        });

        this.uploadImage(result.uri)
          .then(() => {
            this.setState({
              loading: false,
              bgImage: ""
            });
          })
          .catch(error => {
            this.setState({
              loading: false,
              bgImage: ""
            });
            reject(error);
          });
      }
    }
  };

  uploadImage = async (uri, mime = "application/octet-stream") => {
    const { onError, onSuccess } = this.props;
    let { userid } = this.props;
    let sessionId = "";
    const uploadUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri;
    if (_.includes(uploadUri, ".")) {
      if (_.isEmpty(userid)) {
        sessionId = new Date().getTime();
      }

      let fileName = uploadUri.split("/").pop();
      fileName = `${userid ? userid : sessionId}_${fileName}`;
      const imageRef = storageImage.child(fileName);
      const responseBlob = await this.uriToBlob(uploadUri);
      return imageRef
        .put(responseBlob, { contentType: mime })
        .then(() => {
          imageRef
            .getDownloadURL()
            .then(url => {
              onSuccess(url);
            })
            .catch(error => {
              onError(error);
            });
        })
        .catch(error => {
          onError(error);
        });
    }
  };

  uriToBlob(uri) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onerror = reject;
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          resolve(xhr.response);
        }
      };
      xhr.open("GET", uri);
      xhr.responseType = "blob";
      xhr.send();
    });
  }

  render() {
    const { loading, bgImage } = this.state;
    const title = this.props.title || "";
    const activityTitle = this.props.activityIndicatorText || "";

    if (loading) {
      return (
        <ImageBackground source={bgImage} style={styles.bgImage}>
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 20
            }}
            keyboardShouldPersistTaps={'handled'}
          >
            <View style={[styles.horizontal]}>
              <ActivityIndicator size="large" color={Colors.primaryColor} />
            </View>
            <View>
              <H5>{activityTitle}</H5>
            </View>
          </ScrollView>
        </ImageBackground>
      );
    }

    return (
      <View>
        <Button
          title={title}
          buttonStyle={styles.btnStyle}
          titleStyle={styles.btnTextStyle}
          onPress={this.onChooseImagePress}
        />
      </View>
    );
  }
}

export default ImageUploadButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor :Colors.black,
    alignItems: "center",
    justifyContent: "center"
  },
  btnStyle: {
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: Colors.primaryColor,
    borderRadius:12,
  },
  btnTextStyle: {
    color: Colors.white
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  bgImage: {
    flex: 1,
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center"
  }
});
