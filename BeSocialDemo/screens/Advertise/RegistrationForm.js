import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Icon, Input, Button } from "react-native-elements";
import { updateNextStep, updateAppConstSettings } from "../../actions/main";
import {
  updateEventTitle,
  updateEventStartDate,
  updateEventEndDate,
  updateEventAddress,
  updateEventLongitude,
  updateEventLatitude,
  updateEventDescription,
  updateEventPhone,
  updateEventWebSite,
  updateEventBuyNow,
  updateEventPromoCode,
  updateEventExpirationDate,
  updateValidSelectedAddress,
  updateEventDuration,
} from "../../actions/advertise";
import { updateSelectedProductPrice, updateSelectedProduct} from '../../actions/product';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import { Colors } from "./../../styles";
import { LogError } from "./../../global";

import Constants from 'expo-constants';

// FIX ME GET THIS KEY OUT OF HERE!!!
const key = Constants.manifest.extra.apiKey;//"AIzaSyAH6lG5C2PmdipCUJbsK_d_U_h0y6gAVNw";

const EXPIRTATION_THRESHOLD = 3600000 * 4;

class RegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationPredictions: [],
      isStartDateTimePickerVisible: false,
      advertise_mobile: false,
      isEndDateTimePickerVisible: false,
      address_valid: true,
      startdate_valid: true,
      enddate_valid: true,
      title_valid: true,
      phone_valid: true,
      website_valid: true,
      buynow_valid: true,
      description_valid: true
    };

    this.onChangeDestinationDebounced = _.debounce(
      this.onChangeDestination,
      1000
    );
  }
  
  _showStartDateTimePicker = () =>
    this.setState({ isStartDateTimePickerVisible: true });

  _hideStartDateTimePicker = () =>
    this.setState({ isStartDateTimePickerVisible: false });

  _showEndDateTimePicker = () =>
    this.setState({ isEndDateTimePickerVisible: true });

  _hideEndDateTimePicker = () =>
    this.setState({ isEndDateTimePickerVisible: false });

  _handleStartDatePicked = date => {
    try {
      this.props.updateEventStartDate(date.getTime());
      this._hideStartDateTimePicker();
    } catch (error) {
      LogError('RegistrationForm::_handleStartDatePicked', error);
    }
  };

  _handleEndDatePicked = date => {
    try {
      this.props.updateEventEndDate(date.getTime());
      this._hideEndDateTimePicker();
    } catch (error) {
      LogError('RegistrationForm::_handleEndDatePicked', error);
    }
  };

  handleEventDates() {
    try {
      const { startdate, enddate } = this.props;
      let duration = enddate - startdate; //milliseconds
      this.props.updateEventExpirationDate(enddate + EXPIRTATION_THRESHOLD);
      this.props.updateEventDuration(duration);
    } catch (error) {
      LogError('RegistrationForm::handleEventDates', error);
    }
  }

  validateForm = () => {
    var retVal = false;
    const {
      title,
      address,
      startdate,
      enddate,
      description,
      phone,
      //website,
      //buynowurl,
      isMobile,
      isValidAddressSelection,
      //latitude,
      //longitude,

    } = this.props;

    try {
      /*check for title */
      if (_.isEmpty(title)) {
        this.setState({ title_valid: false });
        return retVal;
      } else {
        this.setState({ title_valid: true });
      }

      /* IF NOT MOBILE VALIDATE THESE OPTIONS */
      if (!isMobile) {
        /*check for address */
        if (_.isEmpty(address) || /^\s*$/.test(address)) {
          this.setState({ address_valid: false });
          return retVal;
        } else {
          this.setState({ address_valid: true });
        }

        if (!isValidAddressSelection && /^\s*$/.test(address)) {
          this.setState({ address_valid: false });
          return retVal;
        } else {
          this.setState({ address_valid: true });
        }
      }

      /*check for startdate */
      if (!_.isNumber(startdate)) {
        this.setState({ startdate_valid: false });
        return retVal;
      } else {
        this.setState({ startdate_valid: true });
      }

      /*check for enddate */
      if (!_.isNumber(enddate)) {
        this.setState({ enddate_valid: false });
        return retVal;
      } else {
        // make sure dates in the valid range
        if (enddate > startdate) this.setState({ enddate_valid: true });
        else this.setState({ enddate_valid: false });
      }

      /*check for description */
      if (_.isEmpty(description) || /^\s*$/.test(description)) {
        this.setState({ description_valid: false });
        return retVal;
      } else {
        this.setState({ description_valid: true });
      }

      // /*check for phone */
      // if (_.isEmpty(phone) || !phone.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)) {
      //   this.setState({ phone_valid: false });
      //   return retVal;
      //     } else {
      //   this.setState({ phone_valid: true });
      // }

      /*check for website */
      // if (_.isEmpty(website)) {
      //   this.setState({ website_valid: false });
      //   return retVal;
      // } else {
      //     this.setState({ website_valid: true });
      // }

      /*check for buynowurl */
      // if (_.isEmpty(buynowurl)) {
      //   this.setState({ buynow_valid: false });
      //   return retVal;
      // } else {
      //   this.setState({ buynow_valid: true });
      // }

      retVal = true;
      //set event duration and expiration date
      if (retVal) {
        this.handleEventDates();
      }

      return retVal;
    } catch (error) {
      LogError('RegistrationForm::validateForm', error);
    }
  };

  isValidURL = string => {
    var res = string.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    return res !== null;
  };

  async pressedPrediction(addressSelected) {
    Keyboard.dismiss();


    //for more details https://developers.google.com/maps/documentation/javascript/places#place_details
    //    const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${addressSelected.place_id.trim()}` + 
    //                          `&fields=geometry,address_component,formatted_address,icon,name,opening_hours,permanently_closed,plus_code&key=${key}`;

    const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${addressSelected.place_id.trim()}` +
      `&fields=geometry,address_component&key=${key}`;
    try {
      const result = await fetch(apiUrl);
      const jsonResult = await result.json();
      const longitude = jsonResult.result.geometry.location.lng;
      const latitude = jsonResult.result.geometry.location.lat;
      let zip, streetnumber, route, city, state, country;

      if (jsonResult && _.isArray(jsonResult.result.address_components)) {
        //console.log('PlaceID description: ' + JSON.stringify(jsonResult.result.address_components));
        for (let index = jsonResult.result.address_components.length - 1; index >= 0; index--) {
          const element = jsonResult.result.address_components[index];
          if (element.types.indexOf("street_number") != -1) streetnumber = element.long_name;
          if (element.types.indexOf("route") != -1) route = element.long_name;
          if (element.types.indexOf("locality") != -1) city = element.long_name;
          if (element.types.indexOf("administrative_area_level_1") != -1) state = element.short_name;
          if (element.types.indexOf("postal_code") != -1) zip = element.long_name;
          if (element.types.indexOf("country") != -1) country = element.short_name;
        }
      }

      if (addressSelected.description.length > 0 && !isNaN(latitude) && latitude.toString().indexOf(".") != -1) {
        //console.log('Address selected: ' + JSON.stringify(addressSelected));
        //this.props.updateEventAddress(addressSelected.description);
        const detailedAddress = `${streetnumber} ${route}, ${city}, ${state}, ${zip}`; // - ${country}`;
        this.props.updateEventAddress(detailedAddress);
        this.props.updateEventLongitude(jsonResult.result.geometry.location.lng);
        this.props.updateEventLatitude(jsonResult.result.geometry.location.lat);
        this.props.updateValidSelectedAddress(true);

        // clearing locationPredictions to dismiss dropdown
        this.setState({
          locationPredictions: []
        });
      }

    } catch (error) {
      LogError('RegistrationForm::pressedPrediction', error);
    }
    //Keyboard;
  }

  async onChangeDestination(address) {
    const { currentuser } = this.props;

    if (address.length > 0) {
      this.props.updateValidSelectedAddress(false);
      this.setState({ address });
      const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${key}&input=${address}
        &location=${(currentuser.coordinates.latitude,
          currentuser.coordinates.longitude)}&radius=50`;

      try {
        const result = await fetch(apiUrl);
        const jsonResult = await result.json();

        //console.log('found locations: ' + JSON.stringify(jsonResult));
        this.setState({
          locationPredictions: jsonResult.predictions
        });
      } catch (error) {
        LogError('RegistrationForm::onChangeDestination', error);
      }
    }
  }

  onPhoneNumberChange = phone => {
    try {
      var cleaned = ("" + phone).replace(/\D/g, "");
      var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        var intlCode = match[1] ? "+1 " : "",
          number = [
            intlCode,
            "(",
            match[2],
            ") ",
            match[3],
            "-",
            match[4]
          ].join("");
        this.props.updateEventPhone(number);
        return;
      }
      this.props.updateEventPhone(phone);
    } catch (error) {
      LogError('RegistrationForm::onPhoneNumberChange', error);
    }
  };

  onTilteChange = title =>{
    if (_.isEmpty(title)) {
      this.setState({ title_valid: false });
      return retVal;
    } else {
      this.setState({ title_valid: true });
    }
  }

  render() {
    const {
      address_valid,
      //website_valid,
      startdate_valid,
      enddate_valid,
      title_valid,
      phone_valid,
      //buynow_valid,
      description_valid,
      isStartDateTimePickerVisible,
      isEndDateTimePickerVisible
    } = this.state;
    const {
      isMobile,
      title,
      startdate,
      enddate,
      address,
      description,
      phone,
      website,
      buynowurl,
      promocode,
      settings,
      isValidAddressSelection
    } = this.props; 
    const { advertismentText, producttimeinterval } = settings[0];
    const { text3 } = advertismentText;

    const startdateValue = !_.isNumber(startdate)
      ? ""
      : moment(startdate).format("MMMM Do YYYY, h:mm:ss a");

    const enddateValue = !_.isNumber(enddate)
      ? ""
      : moment(enddate).format("MMMM Do YYYY, h:mm:ss a");

    const locationPredictions = this.state.locationPredictions.map(
      prediction => (
        <TouchableHighlight
          key={prediction.id}
          onPress={() => this.pressedPrediction(prediction)}
        >
          <Text style={styles.locationSuggestion}>
            {prediction.description}
          </Text>
        </TouchableHighlight>
      )
    );

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.viewInputStyle}>
          <View style={{ padding: 10 }}>
            <Text
              style={{
                fontSize: 14,
                fontStyle: "italic",
                color: Colors.white
              }}
            >
              {text3.replace(/\s+/g, ' ')}
            </Text>
          </View>
          <Input
            inputStyle={styles.inputStyle}
            containerStyle={styles.containerStyle}
            onChangeText={title => this.props.updateEventTitle(title)}
            value={title}
            keyboardAppearance="light"
            autoFocus={true}
            placeholder="Event Title"
            placeholderTextColor={Colors.lightGray}
            autoCapitalize="none"
            keyboardType={Platform.OS === 'android' ? 'email-address' : 'ascii-capable'}
            returnKeyType="next"
            autoCorrect={false}
            blurOnSubmit={false}
            rightIcon={
              <Icon
                type="font-awesome"
                name="user"
                size={25}
                color={Colors.orange}
              />
            }
            rightIconContainerStyle={styles.rightIconContainerStyle}
            errorStyle={styles.inputError}
            errorMessage={title_valid ? "" : "event title can not be empty"}
          />
        </View>
        {!isMobile ? (
          <View style={styles.viewInputStyle}>
            <Input
              inputStyle={styles.inputStyle}
              containerStyle={styles.containerStyle}
              onChangeText={address => {
                this.props.updateValidSelectedAddress(false);
                this.props.updateEventAddress(address);
                this.onChangeDestinationDebounced(address);
              }}
              onFocus={() => {
                this.props.updateValidSelectedAddress(false);
                this.props.updateEventAddress("");
              }}
              value={address}
              keyboardAppearance="light"
              placeholder="Event Location"
              placeholderTextColor={Colors.lightGray}
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
              rightIcon={
                <Icon
                  type="font-awesome"
                  name="address-card"
                  size={25}
                  color={Colors.orange}
                />
              }
              rightIconContainerStyle={styles.rightIconContainerStyle}
              errorStyle={styles.inputError}
              errorMessage={
                address_valid ? "" : "Valid address and it can not be empty"
              } 
              {...(isValidAddressSelection ? { selection: { start: 0, end: 0 } } : {})}
            />
            {locationPredictions}
          </View>
        ) : null}

        <View style={styles.viewInputStyle}>
          <Input
            inputStyle={styles.inputStyle}
            placeholder="Event Start Date"
            placeholderTextColor={Colors.lightGray}
            editable={false}
            containerStyle={styles.containerStyle}
            rightIconContainerStyle={styles.rightIconContainerStyle}
            value={startdateValue}
            rightIcon={
              <Icon
                type="font-awesome"
                color={Colors.orange}
                size={28}
                name="calendar"
                paddingTop={4}
                onPress={this._showStartDateTimePicker}
              />
            }
            errorStyle={styles.inputError}
            errorMessage={
              startdate_valid ? "" : "event start date and time is require"
            }

            errorMessage={
              startdate > 0
                ? startdate_valid
                  ? Math.ceil(Math.abs(moment(startdate).valueOf() - moment().valueOf()) / (1000 * 60 * 60 * 24)) <= producttimeinterval
                    ? ""
                    : "Please make sure end date comes after start date and no futher then " + producttimeinterval + " days"
                  : "event start date and time is required"
                : ""
            }
          />
          <DateTimePicker
            isVisible={isStartDateTimePickerVisible}
            onConfirm={this._handleStartDatePicked}
            onCancel={this._hideStartDateTimePicker}
            mode={"datetime"}
            is24Hour={false}
          />
        </View>

        <View style={styles.viewInputStyle}>
          <Input
            inputStyle={styles.inputStyle}
            placeholder="Event End Date"
            placeholderTextColor={Colors.lightGray}
            editable={false}
            containerStyle={styles.containerStyle}
            rightIconContainerStyle={styles.rightIconContainerStyle}
            value={enddateValue}
            errorStyle={styles.inputError}
            errorMessage={
              enddate > 0 && startdate > 0
                ? enddate_valid
                  ? (enddate > startdate
                    && Math.ceil(Math.abs(moment(enddate).valueOf() - moment().valueOf()) / (1000 * 60 * 60 * 24)) <= producttimeinterval)
                    ? ""
                    : "Please make sure end date comes after start date and no futher then " + producttimeinterval + " days"
                  : "event end date and time is required"
                : ""
            }
            rightIcon={
              <Icon
                type="font-awesome"
                color={Colors.orange}
                size={28}
                name="calendar"
                paddingTop={4}
                onPress={this._showEndDateTimePicker}
              />
            }
          />
          <DateTimePicker
            isVisible={isEndDateTimePickerVisible}
            onConfirm={this._handleEndDatePicked}
            onCancel={this._hideEndDateTimePicker}
            mode={"datetime"}
            is24Hour={false}
          />
        </View>

        <View style={styles.viewInputStyle}>
          <Input
            keyboardAppearance="light"
            inputStyle={styles.inputStyle}
            onChangeText={description => {
              this.props.updateEventDescription(description);
            }}
            value={description}
            placeholder="Event Description"
            placeholderTextColor={Colors.lightGray}
            autoCapitalize="none"
            keyboardType="default"
            returnKeyType="next"
            autoCorrect={false}
            blurOnSubmit={false}
            rightIcon={
              <Icon
                type="font-awesome"
                name="sticky-note"
                size={25}
                color={Colors.orange}
              />
            }
            rightIconContainerStyle={styles.rightIconContainerStyle}
            multiline={true}
            numberOfLines={3}
            errorStyle={styles.inputError}
            errorMessage={
              description_valid ? "" : "description can not be empty"
            }
          />
        </View>

        <View style={styles.viewInputStyle}>
          <Input
            placeholder="Event Phone"
            placeholderTextColor={Colors.lightGray}
            onChangeText={phone => this.onPhoneNumberChange(phone)}
            value={phone}
            containerStyle={styles.containerStyle}
            inputStyle={styles.inputStyle}
            autoCapitalize="none"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            dataDetectorTypes="phoneNumber"
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
            rightIconContainerStyle={styles.rightIconContainerStyle}
            // errorStyle={styles.inputError}
            // errorMessage={
            //   phone_valid ? "" : "Valid Phone number and it can not be empty"
            // }
          />
        </View>

        <View style={styles.viewInputStyle}>
          <Input
            keyboardAppearance="light"
            containerStyle={styles.containerStyle}
            onChangeText={website => {
              this.props.updateEventWebSite(website);
            }}
            value={website}
            inputStyle={styles.inputStyle}
            placeholder="Do you have an Event link? (optional)"
            placeholderTextColor={Colors.lightGray}
            autoCapitalize="none"
            keyboardType="default"
            returnKeyType="next"
            autoCorrect={false}
            blurOnSubmit={false}
            rightIcon={
              <Icon
                type="font-awesome"
                name="globe"
                size={25}
                color={Colors.orange}
              />
            }
            rightIconContainerStyle={styles.rightIconContainerStyle}
          // errorStyle={styles.inputError}
          // errorMessage={website_valid ? "" : "Website link can not be empty"}
          />
        </View>

        <View style={styles.viewInputStyle}>
          <Input
            keyboardAppearance="light"
            containerStyle={styles.containerStyle}
            onChangeText={buynowurl => {
              this.props.updateEventBuyNow(buynowurl);
            }}
            value={buynowurl}
            inputStyle={styles.inputStyle}
            placeholder="Do you have a Buy Now link? (optional)"
            placeholderTextColor={Colors.lightGray}
            autoCapitalize="none"
            keyboardType="default"
            returnKeyType="next"
            autoCorrect={false}
            blurOnSubmit={false}
            rightIcon={
              <Icon
                type="font-awesome"
                name="globe"
                size={25}
                color={Colors.orange}
              />
            }
          // rightIconContainerStyle={styles.rightIconContainerStyle}
          // errorStyle={styles.inputError}
          // errorMessage={buynow_valid ? "" : "buy now url can not be empty"}
          />
        </View>

        <View style={styles.viewInputStyle}>
          <Input
            keyboardAppearance="light"
            containerStyle={styles.containerStyle}
            onChangeText={promocode => {
              this.props.updateEventPromoCode(promocode);
            }}
            value={promocode}
            inputStyle={styles.inputStyle}
            placeholder="Do you have a Promo Code? (optional)"
            placeholderTextColor={Colors.lightGray}
            autoCapitalize="none"
            keyboardType="default"
            returnKeyType="next"
            autoCorrect={false}
            blurOnSubmit={false}
            rightIcon={
              <Icon
                type="font-awesome"
                name="barcode"
                size={25}
                color={Colors.orange}
              />
            }
            rightIconContainerStyle={styles.rightIconContainerStyle}
          />
        </View>

        <Button
          title={"Next"}
          titleStyle={styles.btnTextStyle}
          buttonStyle={styles.btnStyle}
          onPress={() => {
            try {
              const form_valid = this.validateForm();
              if (form_valid) {
                this.props.updateNextStep();
              }
            } catch (error) {
              LogError('RegistrationForm::PickServiceSelection', error);
            }
          }}
        />
      </KeyboardAvoidingView>
    );
  }
}

function mapStateToProps(state) {
  return {
    isMobile: state.advertise.order.isMobile,
    title: state.advertise.order.title,
    startdate: state.advertise.order.startdate,
    enddate: state.advertise.order.enddate,
    address: state.advertise.order.address,
    longitude: state.advertise.order.longitude,
    latitude: state.advertise.order.latitude,
    description: state.advertise.order.description,
    phone: state.advertise.order.phone,
    website: state.advertise.order.website,
    buynowurl: state.advertise.order.buynowurl,
    promocode: state.advertise.order.promocode,
    expirationdate: state.advertise.order.expirationdate,
    duration: state.advertise.order.duration,
    currentuser: state.main.contacts.currentuser,
    isValidAddressSelection: state.advertise.order.isValidAddressSelection,
    settings: state.main.constsettings.settings,
    productlist: state.product.list.items,
    activeStep: state.main.stepper.activeStep,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateNextStep: () => dispatch(updateNextStep()),
    updateCurrentUser: currentuser => dispatch(updateCurrentUser(currentuser)),
    updateEventTitle: title => dispatch(updateEventTitle(title)),
    updateEventStartDate: date => dispatch(updateEventStartDate(date)),
    updateEventEndDate: date => dispatch(updateEventEndDate(date)),
    updateEventAddress: address => dispatch(updateEventAddress(address)),
    updateEventLongitude: longitude =>
      dispatch(updateEventLongitude(longitude)),
    updateEventLatitude: latitude => dispatch(updateEventLatitude(latitude)),
    updateEventDescription: description =>
      dispatch(updateEventDescription(description)),
    updateEventPhone: phone => dispatch(updateEventPhone(phone)),
    updateEventWebSite: website => dispatch(updateEventWebSite(website)),
    updateEventBuyNow: buynowurl => dispatch(updateEventBuyNow(buynowurl)),
    updateEventPromoCode: code => dispatch(updateEventPromoCode(code)),
    updateEventExpirationDate: expirationdate =>
      dispatch(updateEventExpirationDate(expirationdate)),
    updateEventDuration: duration => dispatch(updateEventDuration(duration)),
    updateAppConstSettings: settings =>
      dispatch(updateAppConstSettings(settings)),
      updateSelectedProductPrice: amount =>
      dispatch(updateSelectedProductPrice(amount)),
    updateSelectedProduct: item => dispatch(updateSelectedProduct(item)),
    updateValidSelectedAddress: isValidAddressSelection => dispatch(updateValidSelectedAddress(isValidAddressSelection))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationForm);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.black
  },
  phonePrefix: {
    color: Colors.white,
    fontSize: 15,
    margin: 5
  },
  inputError: {
    textAlign: "left",
    fontSize: 12,
    color: Colors.red
  },
  inputStyle: {
    marginRight: 10,
    textAlignVertical: "top",
    color: Colors.white
  },
  rightIconContainerStyle: {
    paddingRight: 10
  },
  viewInputStyle: {
    marginBottom: 12,
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
  },
  locationSuggestion: {
    color: Colors.black,
    backgroundColor: Colors.silverGray,
    padding: 3,
    fontSize: 18,
    borderWidth: 0.5,
    marginLeft: 5,
    marginRight: 5
  }
});
