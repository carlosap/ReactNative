import React, { Component } from "react";
import _ from "lodash";
import {
  AsyncStorage,
  StyleSheet,
  ScrollView,
  View,
  Linking,
  Modal,
  Text
} from "react-native";
import { connect } from "react-redux";
import SettingsList from "react-native-settings-list";
import * as keys from "../constants/storageKeys";
import { updateScreen, updateCurrentUser, updateAppConstSettings } from "../actions/main";
import SimpleHeader from "../components/SimpleHeader";
import { dbUsers, dbErrors } from "../firebase-db";
import { Avatar, ListItem, Icon, Button, Input } from "react-native-elements";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import { Colors } from "../styles";
import ModalHeader from "../components/ModalHeader";
import { HobbiesItems, LogError } from "../global";
import LogoContainer from "./../components/LogoContainer";
import Constants from 'expo-constants';

class SettingScreen extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      switchNotificationValue: false,
      switchLocationValue: false,
      selectedItems: [],
      age: "",
      city: "",
      phone: "",
      zipcode: "",
      areacode: "",
    };

    this.onNotificationValueChange = this.onNotificationValueChange.bind(this);
    this.onLocationValueChange = this.onLocationValueChange.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.setCurrentUserInputs = this.setCurrentUserInputs.bind(this);
  }

  onSelectedHobbiesChange = selectedItems => {
    this.setState({ selectedItems });
  };

  componentDidMount() {
    const { currentuser } = this.props;
    if (currentuser && _.isBoolean(currentuser.enablenotificaiton)) {
      this.setState({
        switchNotificationValue: currentuser.enablenotificaiton
      });
    }

    if (currentuser && _.isBoolean(currentuser.enablenotificaiton)) {
      this.setState({ switchLocationValue: currentuser.enablelocation });
    }

    this.setCurrentUserInputs();
  }

  componentDidUpdate(prevPros) {
    const { currentuser } = this.props;
    if (
      !_.isEqual(
        currentuser.enablenotificaiton,
        prevPros.currentuser.enablenotificaiton
      )
    ) {
      this.setState({
        switchNotificationValue: currentuser.enablenotificaiton
      });
    }

    if (
      !_.isEqual(
        currentuser.enablelocation,
        prevPros.currentuser.enablelocation
      )
    ) {
      this.setState({ switchLocationValue: currentuser.enablelocation });
    }
  }

  setCurrentUserInputs() {
    const { currentuser } = this.props;
    this.setState({
      selectedItems: currentuser.hobbies || [],
      age: currentuser.age || "",
      city: currentuser.city || "",
      phone: currentuser.phone || "",
      zipcode: currentuser.zipcode || "",
      areacode: currentuser.areacode || "",
    });
  }

  setModalVisible(visible) {
    this.setCurrentUserInputs();
    this.setState({ modalVisible: visible });
  }

  closeModal() {
    this.setModalVisible(false);
  }

  onNotificationValueChange(value) {
    try {
      const { currentuser } = this.props;
      if (currentuser && !_.isEmpty(currentuser.id)) {
        if (_.isBoolean(value)) {
          dbUsers.child(currentuser.id).update({ enablenotificaiton: value });
          this.setState({ switchNotificationValue: value });
        }
      }
    } catch (error) {
      LogError('SettingScreen::onNotificationValueChange', error);
    }

  }

  onLocationValueChange(value) {
    try {
      const { currentuser } = this.props;
      if (currentuser && !_.isEmpty(currentuser.id)) {
        if (_.isBoolean(value)) {
          dbUsers.child(currentuser.id).update({ enablelocation: value });
          this.setState({ switchLocationValue: value });
        }
      }
    } catch (error) {
      LogError('SettingScreen::onLocationValueChange', error);
    }

  }

  render() {
    const { currentuser, settings } = this.props;
    const { modalVisible, city, phone, age, areacode, selectedItems } = this.state;
    const { contactustermofuse, contactusprivacy, contactusemail, contactusfacebook, contactustwitter } = settings[0];

    return (
      <View style={styles.container}>
        <SimpleHeader title="Settings" />
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 20,
            backgroundColor: Colors.black
          }}
          keyboardShouldPersistTaps={'handled'}
        >
          {/* edit component */}
          <Modal
            animationType="slide"
            transparent={false}
            swipeArea={20}
            visible={modalVisible}
            onRequestClose={() => {
              this.setModalVisible(false);
            }}
          >
            <ModalHeader
              title="EDIT PROFILE"
              showBackButton={false}
              showCloseButton={true}
              onBackPress={this.closeModal}
            />

            <View style={[styles.container]}>
              <ScrollView
                contentContainerStyle={{
                  paddingBottom: 20,
                  backgroundColor: Colors.black
                }}
                keyboardShouldPersistTaps={'handled'}
              >
                <LogoContainer />
                <View style={styles.viewInputStyle}>
                  <Input
                    inputStyle={styles.inputStyle}
                    onChangeText={city => this.setState({ city })}
                    value={city}
                    keyboardAppearance="light"
                    autoFocus={true}
                    placeholder="Enter Your City"
                    placeholderTextColor={Colors.orange}
                    autoCapitalize="none"
                    keyboardType="default"
                    returnKeyType="next"
                    autoCorrect={false}
                    blurOnSubmit={false}
                  />
                </View>


                {/* <View style={styles.viewInputStyle}>
                  <Input
                    placeholder="Your Zip Code"
                    placeholderTextColor={Colors.orange}
                    onChangeText={zipcode => {
                      this.setState({ zipcode });
                    }}
                    value={zipcode}
                    containerStyle={styles.containerStyle}
                    inputStyle={styles.inputStyle}
                    autoCapitalize="none"
                    keyboardType="numeric"
                    returnKeyType="next"
                    autoCorrect={false}
                    blurOnSubmit={false}
                  />
                </View> */}

                <View style={styles.viewInputStyle}>
                  <Input
                    placeholder="Your Area Code"
                    placeholderTextColor={Colors.orange}
                    onChangeText={areacode => {
                      this.setState({ areacode });
                    }}
                    value={areacode}
                    containerStyle={styles.containerStyle}
                    inputStyle={styles.inputStyle}
                    autoCapitalize="none"
                    keyboardType="numeric"
                    returnKeyType="next"
                    autoCorrect={false}
                    blurOnSubmit={false}
                  />
                </View>

                <View style={styles.viewInputStyle}>
                  <Input
                    placeholder="Your Age"
                    placeholderTextColor={Colors.orange}
                    onChangeText={age => {
                      this.setState({ age });
                    }}
                    value={age}
                    containerStyle={styles.containerStyle}
                    inputStyle={styles.inputStyle}
                    autoCapitalize="none"
                    keyboardType="numeric"
                    returnKeyType="next"
                    autoCorrect={false}
                    blurOnSubmit={false}
                  />
                </View>

                <View style={styles.viewInputStyle}>
                  <Input
                    placeholder="Phone Number"
                    placeholderTextColor={Colors.orange}
                    onChangeText={phone => {
                      this.setState({ phone });
                    }}
                    value={phone}
                    containerStyle={styles.containerStyle}
                    inputStyle={styles.inputStyle}
                    autoCapitalize="none"
                    keyboardType="numeric"
                    returnKeyType="next"
                    autoCorrect={false}
                    blurOnSubmit={false}
                    rightIcon={
                      <Icon
                        type="font-awesome"
                        name="phone"
                        size={25}
                        color={Colors.orange}
                      />
                    }
                    leftIcon={<Text style={styles.phonePrefix}>+1</Text>}
                  />
                </View>

                <View>
                  <SectionedMultiSelect
                    items={HobbiesItems}
                    styles={{
                      selectedItem: {
                        color: Colors.orange,
                      },
                      chipContainer: {
                        backgroundColor: Colors.orange,
                      },
                      chipText: {
                        color: Colors.black
                      },
                      chipIcon: {
                        color: Colors.black
                      },
                      selectToggleText: {
                        color: Colors.orange,
                      },
                      itemText: {
                        color: Colors.primaryColor
                      },
                      subItemText: {
                        color: Colors.black
                      },
                      item: {
                        color: Colors.white
                      },
                      selectedSubItemText: {
                        color: Colors.orange
                      },
                      button: {
                        backgroundColor: Colors.primaryColor
                      }
                    }}
                    uniqueKey="id"
                    subKey="children"
                    iconKey="icon"
                    selectText="Choose Hobbies"
                    showDropDowns={true}
                    readOnlyHeadings={true}
                    alwaysShowSelectText={true}
                    onSelectedItemsChange={this.onSelectedHobbiesChange}
                    selectedItems={selectedItems}
                  />
                </View>

                <Button
                  title="SAVE"
                  titleStyle={styles.btnTextStyle}
                  buttonStyle={styles.btnStyle}
                  onPress={() => {
                    try {
                      if (!_.isUndefined(currentuser.id)) {
                        currentuser.age = age;
                        currentuser.city = city;
                        currentuser.hobbies = selectedItems;
                        currentuser.phone = phone;
                        currentuser.zipcode = "";//zipcode;
                        currentuser.areacode = areacode;
                        this.props.updateCurrentUser(currentuser);
                        dbUsers.child(currentuser.id).update({
                          age: age,
                          city: city,
                          hobbies: selectedItems,
                          phone: phone,
                          zipcode: "",//zipcode,
                          areacode: areacode,
                        });
                        this.closeModal();
                      }
                    } catch (error) {
                      LogError('SettingScreen::Save', error);
                    }
                  }}
                />
              </ScrollView>
            </View>
          </Modal>
          {/* settings component */}
          <View>
            <SettingsList backgroundColor={Colors.orange} borderColor={Colors.primaryColor} defaultItemSize={50}>
              <ListItem
                leftAvatar={
                  <Avatar
                    overlayContainerStyle={{ backgroundColor: Colors.primaryColor }}
                    editButton={{ color: Colors.black }}
                    rounded
                    showEditButton
                    size="large"
                    icon={{ name: "user", type: "font-awesome", color: Colors.white }}
                    activeOpacity={0.7}
                    onPress={() => this.setModalVisible(true)}
                  />
                }


                containerStyle={{ backgroundColor: Colors.orange }}
                title={currentuser.email}
                hideChevron={true}
              />

              {/* <SettingsList.Header headerStyle={{ marginTop: 15 }} /> */}
              <SettingsList.Item
                hasNavArrow={false}
                title="User Settings"
                titleStyle={{
                  color: Colors.primaryColor,
                  marginBottom: 10,
                  fontWeight: "bold"
                }}
                itemWidth={70}
                borderHide={"Both"}
              />

              <SettingsList.Item
                icon={
                  <View style={styles.imageStyle}>
                    <Icon
                      type="entypo"
                      color={Colors.black}
                      size={24}
                      name="bell"
                    />
                  </View>
                }
                hasSwitch={true}
                switchState={this.state.switchNotificationValue}
                switchOnValueChange={this.onNotificationValueChange}
                hasNavArrow={false}
                title="Notifications"
              />

              <SettingsList.Item
                icon={
                  <View style={styles.imageStyle}>
                    <Icon
                      type="entypo"
                      color={Colors.black}
                      size={20}
                      name="map"
                    />
                  </View>
                }
                hasSwitch={true}
                switchState={this.state.switchLocationValue}
                switchOnValueChange={this.onLocationValueChange}
                hasNavArrow={false}
                title="Location"
              />

              {/* <SettingsList.Header headerStyle={{ marginTop: 15 }} /> */}

              <SettingsList.Item
                hasNavArrow={false}
                title="Support"
                titleStyle={{
                  color: Colors.primaryColor,
                  marginBottom: 10,
                  fontWeight: "bold"
                }}
                itemWidth={70}
                borderHide={"Both"}
              />

              <SettingsList.Item
                icon={
                  <View style={styles.imageStyle}>
                    <Icon
                      type="materialicon"
                      color={Colors.black}
                      size={24}
                      name="gavel"
                    />
                  </View>
                }
                title="View Privacy Policy"
                onPress={() => {
                  try {
                    Linking.openURL(contactusprivacy);
                  } catch (error) {
                    LogError('SettingScreen::ViewPrivacyPolicy', error);
                  }
                }}
                itemWidth={70}
                titleStyle={{ color: Colors.black, fontSize: 16 }}
                hasNavArrow={false}
              />
              <SettingsList.Item
                icon={
                  <View style={styles.imageStyle}>
                    <Icon
                      type="entypo"
                      color={Colors.black}
                      size={24}
                      name="text-document"
                    />
                  </View>
                }
                title="Term of Use"
                onPress={() => {
                  try {
                    Linking.openURL(contactustermofuse);
                  } catch (error) {
                    LogError('SettingScreen::TermOfUse');
                  }
                }}
                itemWidth={70}
                titleStyle={{ color: Colors.black, fontSize: 16 }}
                hasNavArrow={false}
              />
              {/* <SettingsList.Header headerStyle={{ marginTop: 15 }} />
             */}

              <SettingsList.Item
                hasNavArrow={false}
                title="Contact US"
                titleStyle={{
                  color: Colors.primaryColor,
                  marginBottom: 10,
                  fontWeight: "bold"
                }}
                itemWidth={70}
                borderHide={"Both"}
              />

              <SettingsList.Item
                icon={
                  <View style={styles.imageStyle}>
                    <Icon
                      type="entypo"
                      color={Colors.black}
                      size={24}
                      name="email"
                    />
                  </View>
                }
                onPress={() => {
                  try {
                    Linking.openURL(`mailto:${contactusemail}`);
                  } catch (error) {
                    LogError('SettingScreen::Email', error);
                  }
                }}
                title="Email"
                itemWidth={70}
                titleStyle={{ color: Colors.black, fontSize: 16 }}
                hasNavArrow={false}
              />

              <SettingsList.Item
                icon={
                  <View style={styles.imageStyle}>
                    <Icon
                      type="entypo"
                      color={Colors.black}
                      size={24}
                      name="facebook"
                    />
                  </View>
                }
                onPress={() => {
                  try {
                    Linking.openURL(contactusfacebook);
                  } catch (error) {
                    LogError('SettingScreen::facebook', errror.message);
                  }
                }}
                title="Facebook"
                itemWidth={70}
                titleStyle={{ color: Colors.black, fontSize: 16 }}
                hasNavArrow={false}
              />
              <SettingsList.Item
                icon={
                  <View style={styles.imageStyle}>
                    <Icon
                      type="entypo"
                      color={Colors.black}
                      size={24}
                      name="twitter"
                    />
                  </View>
                }
                onPress={() => {
                  try {
                    Linking.openURL(contactustwitter);
                  } catch (error) {
                    LogError('SettingScreen::Twitter', error);
                  }
                }}
                title="Twitter"
                itemWidth={70}
                titleStyle={{ color: Colors.black, fontSize: 16 }}
                hasNavArrow={false}
              />
              <SettingsList.Item
                hasNavArrow={false}
                title={"E-Flyer Junkie  v" + Constants.manifest.version}
                titleStyle={{
                  color: Colors.primaryColor,
                  marginBottom: 10,
                  fontWeight: "bold",
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  textAlign : "center"
                }}
                itemWidth={70}
                borderHide={"Both"}
              />
            </SettingsList>
            
          </View>
          <Button
            title="SIGN OUT"
            titleStyle={styles.btnTextStyle}
            buttonStyle={styles.btnStyle}
            onPress={() => {
              try {
                AsyncStorage.setItem(keys.CURRENTUSER, "", () => {
                  this.props.updateCurrentUser({});
                  this.props.updateScreen("Login");
                });
              } catch (error) {
                LogError('SettingScreen::SignOut', error)
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
    currentuser: state.main.contacts.currentuser,
    contacts: state.main.contacts.entities,
    settings: state.main.constsettings.settings
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateScreen: onboarded => dispatch(updateScreen(onboarded)),
    updateCurrentUser: currentuser => dispatch(updateCurrentUser(currentuser)),
    updateAppConstSettings: settings =>
      dispatch(updateAppConstSettings(settings))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.black,
    color: Colors.silverGray
  },
  imageStyle: {
    marginLeft: 15,
    marginRight: 20,
    alignSelf: "center",
    width: 20,
    height: 24,
    justifyContent: "center"
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
  },
  inputStyle: {
    marginRight: 10,
    color: Colors.white
  },
  rightIconContainerStyle: {
    paddingRight: 10
  },
  viewInputStyle: {
    marginBottom: 12
  },
  phonePrefix: {
    color: Colors.white,
    fontSize: 15,
    margin: 5
  }
});
