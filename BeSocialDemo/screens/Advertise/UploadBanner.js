import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Text } from 'react-native';
import ImageUploadButton from '../../components/ImageUploadButton';
import { updateBannerUrl } from '../../actions/advertise';
import { updateNextStep } from '../../actions/main';
import { Tile } from "react-native-elements";
import { Colors } from './../../styles';
import LogoContainer from "../../components/LogoContainer";
import { LogError } from "./../../global";


class UploadBanner extends Component {

  onUploadSuccess = (url) => {
    try {
      this.props.updateBannerUrl(url);
      this.props.updateNextStep();
    } catch (error) {
      LogError('UploadBanner::onUploadSuccess', error);
    }

  }

  onUploadError = (error) => {
    LogError('UploadBanner::onUploadError', error);
  }

  onUploading = () => {
    try {
      this.props.updateBannerUrl('');
    } catch (error) {
      LogError('UploadBanner::onUploading', error);
    }
  }

  render() {
    const { bannerurl, currentuser } = this.props;

    return (
      <View style={styles.container}>
        <LogoContainer />
        <Text style={styles.uploadText}>The use of profanity, pornographic images or copy right materials are strictly prohibited and is
          subject to removal without a refund. For more information please see Our “Terms of Use”
          located under “Settings”</Text>
        {bannerurl ?
          <Tile
            imageSrc={{ uri: bannerurl }}
            featured
            activeOpacity={1.0}
          /> : null}
        <View >
          <ImageUploadButton
            title="Upload Image"
            activityIndicatorText="Uploading image. Please wait..."
            folder=""
            userid={currentuser.id}
            onSuccess={this.onUploadSuccess}
            onError={this.onUploadError}
            onUploading={this.onUploading}
          />
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentuser: state.main.contacts.currentuser,
    bannerurl: state.advertise.order.bannerurl,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateBannerUrl: (bannerurl) => dispatch(updateBannerUrl(bannerurl)),
    updateNextStep: () => dispatch(updateNextStep()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadBanner)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    padding: 20,
    color: Colors.white,
  }
});