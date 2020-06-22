import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { View, StyleSheet, Text } from "react-native";
import { Icon, Button, Input } from "react-native-elements";
import ModalLoader from "./../../components/ModalLoader";
import { dbPayments } from "../../firebase-db";
import { LogError } from "./../../global";
import { CreditCardInput } from "react-native-credit-card-input";
import { updateNextStep, updateActiveStep } from "../../actions/main";
import {
  updateEventReceiptUrl,
  updateEventTransactionKey,
  updateEventTransactionLoading,
  updateErrorMsg
} from "../../actions/advertise";
import { Colors } from "./../../styles";
import Constants from 'expo-constants';

class CreditCardPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CCNumber: "",
      CCExpiryMonth: "",
      CCExpiryYear: "",
      CCCvc: "",
      CCtype: "",
      CCname: "",
      CCpostalCode: "",
      CCdisabled: true,
      formValid : false
    };
  }

  componentDidMount() {
    this.props.updateErrorMsg('');
  }

  myValidatePostalCode = (postalCode) => {
    try {
      return postalCode.match(/^\d{5}$/) ? "valid" :
        postalCode.length > 5 ? "invalid" :
          "incomplete";
    } catch (error) {
      LogError('CreditCardPayment::myValidatePostalCode', error);
    }

  }

  _onChange = form => {
    try {
      if (_.isEqual("valid", form.status.number)) {
        this.setState({ CCNumber: form.values.number.trim() });
      }

      if (_.isEqual("valid", form.status.expiry)) {
        var expiry = _.split(form.values.expiry, "/");
        this.setState({
          CCExpiryMonth: expiry[0].trim(),
          CCExpiryYear: expiry[1].trim()
        });
      }

      if (_.isEqual("valid", form.status.cvc)) {
        this.setState({ CCCvc: form.values.cvc.trim() });
      }

      if (_.isEqual("valid", form.status.type)) {
        this.setState({ CCtype: form.values.type.trim() });
      }

      if (_.isEqual("valid", form.status.name)) {
        this.setState({ CCname: form.values.name.trim() });
      }

      if (_.isEqual("valid", form.status.postalCode)) {
        this.setState({ CCpostalCode: form.values.postalCode.trim() });
      }

      if (_.isEqual("valid", form.status.number)) {
        this.setState({ CCNumber: form.values.number });
      }

      if (_.isEqual("valid", form.status.expiry)) {
        var expiry = _.split(form.values.expiry, "/");
        this.setState({
          CCExpiryMonth: expiry[0].trim(),
          CCExpiryYear: expiry[1].trim()
        });
      }

      if (
        _.isEqual("valid", form.status.number) &&
        _.isEqual("valid", form.status.cvc) &&
        _.isEqual("valid", form.status.name) &&
        _.isEqual("valid", form.status.postalCode) &&
        _.isEqual("valid", form.status.expiry)
      ) {
        this.setState({ CCdisabled: false ,formValid : true});
      } else {
        this.setState({ CCdisabled: true , formValid : false });
      }
    } catch (error) {
      LogError('CreditCardPayment::_onChange', error);
    }
  };

  render() {
    const {
      CCNumber,
      CCExpiryMonth,
      CCExpiryYear,
      CCCvc,
      CCdisabled,
      CCpostalCode,
      CCname,
      formValid
    } = this.state;
    let { amount, transactionloading } = this.props;
    // amount = 2000;
    return (
      <View style={styles.container}>
        <View style={{ marginTop: 20 }}>
          <CreditCardInput
            autoFocus
            requiresName
            requiresCVC
            requiresPostalCode
            validColor={Colors.primaryColor}
            invalidColor={Colors.red}
            validatePostalCode={this.myValidatePostalCode}
            placeholderColor={Colors.white}
            onChange={this._onChange}
            inputStyle={{ color: Colors.white }}
            inputContainerStyle={{
              borderBottomWidth: 2, borderColor: Colors.primaryColor
            }}
            labelStyle={{ color: Colors.primaryColor }}
            placeholders={{ number: "card number", expiry: "MM/YY", cvc: "CVC", name: "cardholder name", postalCode: "Postal Code" }}
          />
        </View>
        {transactionloading ? (
          <ModalLoader loading={this.state.transactionloading} />
        ) : null}
        {amount ? (
          <Button
            disabled={CCdisabled}
            title={`Pay: $${amount / 100}.00`}
            titleStyle={styles.btnTextStyle}
            buttonStyle={styles.btnStyle}
            containerStyle={styles.containerStyle}
            onPress={() => {
              this.props.updateErrorMsg('');
              this.props.updateEventTransactionLoading(true);
              const { currentuser } = this.props;
              var stripe_url = Constants.manifest.extra.stripe.stripe_url;
              var secret_key = Constants.manifest.extra.stripe.secret_key;

              if (formValid){
                var cardDetails = {
                  "card[address_line1]": null,
                  "card[address_line2]": null,
                  "card[address_city]": null,
                  "card[address_country]": null,
                  "card[address_state]": null,
                  "card[address_zip]": CCpostalCode,
                  "card[number]": CCNumber,
                  "card[cvc]": CCCvc,
                  "card[exp_month]": CCExpiryMonth,
                  "card[exp_year]": CCExpiryYear,
                  "card[name]": CCname
                };

                const userInfo = {
                  name: CCname,
                  postalcode: CCpostalCode,
                  email: currentuser.email
                };

                var formBody = [];
                for (var property in cardDetails) {
                  var encodedKey = encodeURIComponent(property);
                  var encodedValue = encodeURIComponent(cardDetails[property]);
                  formBody.push(encodedKey + "=" + encodedValue);
                }
                formBody = formBody.join("&");

                fetch(stripe_url + "tokens", {
                  method: "post",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: "Bearer " + secret_key
                  },
                  body: formBody
                }).then(response => {
                  response
                    .json()
                    .then(token => {
                      var payment = { token, amount, userInfo };
                      dbPayments.child(`${currentuser.id}`).push(payment).then(snap => {
                          const key = snap.key;
                          this.props.updateEventTransactionKey(key);
                        });
                    })
                    .catch(error => {
                      this.props.updateEventTransactionLoading(false);
                      alert('We were not able to process your payment, please check you Credit Number information')
                    });
                });
              }
            }}
          />
        ) : null}
        <View><Text style={{ color: Colors.red, padding: 20 }}>{this.props.errormsg}</Text></View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentuser: state.main.contacts.currentuser,
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
    amount: state.product.selected.amount,
    bannerurl: state.advertise.order.bannerurl,
    transactionloading: state.advertise.order.transactionloading,
    errormsg: state.advertise.order.errormsg,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateNextStep: () => dispatch(updateNextStep()),
    updateActiveStep: activeStep => dispatch(updateActiveStep(activeStep)),
    updateEventReceiptUrl: url => dispatch(updateEventReceiptUrl(url)),
    updateEventTransactionKey: key => dispatch(updateEventTransactionKey(key)),
    updateEventTransactionLoading: isloading =>
      dispatch(updateEventTransactionLoading(isloading)),
    updateErrorMsg: errormsg => dispatch(updateErrorMsg(errormsg)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditCardPayment);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.black
  },
  inputError: {
    textAlign: "left",
    fontSize: 12,
    color: Colors.red
  },
  inputStyle: {
    marginRight: 10,
    color: Colors.white
  },
  rightIconContainerStyle: {
    paddingRight: 10
  },
  btnStyle: {
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: Colors.primaryColor,
    borderRadius: 12,
    marginTop: 20
  },
  btnTextStyle: {
    color: Colors.white
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 5
  }
});
