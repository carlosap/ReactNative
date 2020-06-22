import React, { Component } from "react";
import { connect } from "react-redux";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { P, H5 } from "nachos-ui";
import { Button } from "react-native-elements";
import { updateNextStep, updateAppConstSettings } from "../../actions/main";
import { updateAgreement } from "../../actions/advertise";
import { Colors } from "./../../styles";
import { LogError } from "./../../global";

class IntroAgreement extends Component {
  render() {
    const { settings } = this.props;
    const { advertismentText } = settings[0];
    const { text1, text2, text3 } = advertismentText;

    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 10
          }}
          keyboardShouldPersistTaps={'handled'}
        >
          <View style={styles.bodyText}>
            <P style={styles.headerText}>{text1.replace(/\s+/g, " ")}</P>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: 5,
                width: "100%",
                backgroundColor: Colors.primaryColor
              }}
            />
            <View>
              <H5 style={styles.advHeader}>Advertise Instructions</H5>
              <P style={styles.advText}>{text2.replace(/\s+/g, " ")}</P>
              <P style={styles.footerText}>
                <Text> {text3.replace(/\s+/g, " ")}</Text>
              </P>
            </View>
          </View>

          <Button
            title="Advertise Now"
            titleStyle={styles.btnTextStyle}
            buttonStyle={styles.btnStyle}
            onPress={() => {
              try {
                this.props.updateAgreement(true);
                this.props.updateNextStep();
              } catch (error) {
                LogError('IntroAgreement::AdvertiseNow', error);
              }
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.main.constsettings.settings
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateNextStep: () => dispatch(updateNextStep()),
    updateAgreement: agreement => dispatch(updateAgreement(agreement)),
    updateAppConstSettings: settings =>
      dispatch(updateAppConstSettings(settings))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntroAgreement);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 5,
    backgroundColor: Colors.black
  },
  bodyText: {
    paddingTop: 5
  },
  headerText: {
    fontStyle: "italic",
    fontSize: 14,
    fontWeight: "700",
    color: Colors.orange
  },
  advText: {
    fontStyle: "italic",
    fontSize: 12,
    fontWeight: "700",
    color: Colors.white
  },
  advHeader: {
    fontStyle: "italic",
    fontSize: 16,
    fontWeight: "700",
    color: Colors.white
  },
  footerText: {
    fontSize: 14,
    fontStyle: "italic",
    color: Colors.white
  },
  btnStyle: {
    marginTop: 20,
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: Colors.primaryColor,
    borderRadius: 12
  },
  btnTextStyle: {
    color: Colors.white
  }
});
