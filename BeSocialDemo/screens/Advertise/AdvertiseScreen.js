/*Wizard Wiget and component definitions
      1- IntroAgreement: Ensure the User knows the policies
      2- AbvertiseType: User Selects the Type of Advertising they need (Mobile or Location)
      3- ProductList: User selects product
      4- RegistrationForm: User Provide registration form
      5- UploadBanner: Provides ability to Upload the Banner to backend Blob
      6- ReviewOrder: Provides a view for all global state variables
      7- PaymentView: Provides the Credit card Payment forms
      8- EventReview: Final detailed page about the Event.

  notes: If you need to debug a modal child view, you must move the component to the 
  top most view. otherwise you will not be able to see the errors.
*/
import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { NavigationEvents } from "react-navigation";
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  Text,
  Linking
} from "react-native";
import ModalHeader from "../../components/ModalHeader";
import SimpleHeader from "../../components/SimpleHeader";
import { Button } from "react-native-elements";
import AbvertiseType from "./AbvertiseType";
import IntroAgreement from "./IntroAgreement";
import ProductList from "./ProductList";
import CreditCardPayment from "./CreditCardPayment";
import RegistrationForm from "./RegistrationForm";
import UploadBanner from "./UploadBanner";
import ReviewOrder from "./ReviewOrder";
import { dbPayments, dbEvents } from "../../firebase-db";
import { LogError } from "./../../global";
import {
  updateBackStep,
  updateNextStep,
  updateActiveStep
} from "../../actions/main";
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
  updateIsMobile,
  updateBannerUrl,
  updateAgreement,
  updateEventPromoCode,
  updateEventReceiptUrl,
  updateEventTransactionKey,
  updateEventTransactionLoading,
  updateEventExpirationDate,
  updateValidSelectedAddress,
  updateEventDuration,
  updateErrorMsg
} from "../../actions/advertise";

import {
  updateSelectedProductPrice,
  updateSelectedProduct
} from "../../actions/product";

import { Colors } from "./../../styles";

getSteps = () => {
  return [
    "Advertise",
    "Advertisement Type",
    "Selection",
    "Registration Form",
    "Upload Banner",
    "Review Order",
    "Payment",
    "Congratulations!"
  ];
};

class AdvertiseScreen extends Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.ctr = 0;
    this.ctrRetry = 7;
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  getStepContent = step => {
     try {
      switch (step) {
        case 1:
          return <AbvertiseType />;
        case 2:
          return <ProductList ismobile={this.props.isMobile} />;
        case 3:
          return <RegistrationForm />;
        case 4:
          return <UploadBanner />;
        case 5:
          return <ReviewOrder />;
        case 6:
          return <CreditCardPayment />;
        default:
          return null;
      }
    } catch (error) {
      LogError('AdvertiseScreen::getStepContent', errror.message);
    }
  };

  addEvent = () => {
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
      longitude,
      latitude,
      currentuser,
      bannerurl,
      promocode,
      receipturl,
      expirationdate,
      duration
    } = this.props;

    const createdDateTime = new Date().getTime();
    const eventItem = {
      title: title || "",
      address: address || "",
      bannerurl: bannerurl || "",
      coordinates: isMobile
        ? currentuser.coordinates
        : {
          latitude: latitude || 0,
          longitude: longitude || 0
        },
      createddate: createdDateTime || "",
      lastupdate: createdDateTime || "",
      description: description || "",
      starteventat: startdate || "",
      endeventat: enddate || "",
      mobileevent: isMobile || "",
      url: website || "",
      buyUrl: buynowurl || "",
      promocode: promocode || "",
      notes: "",
      phone: phone || "",
      userid: currentuser.id,
      receipt: receipturl,
      duration: duration || "",
      expirationdate: expirationdate || "",
      errormsg: "",
      updatesource: 'advertise-screen',
      lastupdatesource: new Date().getTime(),
    };

    try {
      dbEvents.push(eventItem);
      this.props.updateNextStep();
    } catch (error) {
      LogError('AdvertiseScreen::addEvent', error);
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    const { activeStep, receipturl } = this.props;
    const showModal = activeStep > 0;
    const steps = getSteps();
    const title = steps[activeStep];
    const isLastStep = activeStep === steps.length - 1;

    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => {
            this.timer = setInterval(() => {
              const { transactionkey, transactionloading, currentuser } = this.props;
              //console.log(`Waiting for Retries... ${this.ctr} of ${this.ctrRetry}`);
              if (transactionloading && transactionkey) {
                //console.log(`Loading with a TransactionKey... ${transactionkey}`);
                //1- Watcher Detected a onClick Event from the Credit Card Submition 
                //   we are waiting now for the firebase response 
                this.ctr++;
                if (this.ctr > this.ctrRetry) {
                  //2- If the Server and Firebase are taking too long
                  //console.log(`Waited too long for the server ... ${this.ctr} of ${this.ctrRetry}`);
                  //clearInterval(this.timer);
                  this.props.updateEventTransactionKey(null);
                  this.props.updateEventTransactionLoading(false);
                  this.props.updateErrorMsg("Waited too long...please retry again");
                  this.ctr = 0;
                } else {
                  //3- We have a transaction key we are fetching now and see the response value from the credit card company
                  dbPayments.child(`${currentuser.id}/${transactionkey}`).once("value").then(snapshot => {
                      const data = snapshot.val();
                      //4- OnClick Credit Card Submition An Error returned from the vendor
                      if (data && data.error && data.error.message) {
                        //console.log(`User entered some wrong data ... ${data.error.message}`);
                        this.props.updateEventTransactionKey(null);
                        this.props.updateEventTransactionLoading(false);
                        this.props.updateErrorMsg(data.error.message);
                        this.ctr = 0;
                      }

                      //5- OncClick Credit Card Submition All went well.
                      if (data && data.charge && data.charge.status) {
                        if (data.charge.status === "succeeded") {
                          //console.log(`Great Job. the credit card succeded the payment - ${data.charge.status}`);
                          this.props.updateEventReceiptUrl(data.charge.receipt_url);
                          clearInterval(this.timer);
                          this.props.updateEventTransactionKey(null);
                          this.props.updateEventTransactionLoading(false);
                          this.ctr = 0;
                          this.addEvent();
                        }
                      }
                    })
                    .catch(error => {
                      LogError('AdvertiseScreen::onWillFocus', error);
                      this.props.updateEventTransactionKey(null);
                      this.props.updateEventTransactionLoading(false);
                      this.ctr = 0;
                    });
                }
              }
            }, 2000);
          }}
          onDidBlur={payload => {
            try {
              clearInterval(this.timer);
              this.props.updateEventTransactionLoading(false);
              this.props.updateEventTransactionKey(null);
              this.ctr = 0;
            } catch (error) {
              LogError('AdvertiseScreen::onWillFocus', error);
            }
          }}
        />
        {activeStep === 0 ? (
          <View style={{ flex: 1 }}>
            <SimpleHeader title={title} />
            <IntroAgreement />
          </View>
        ) : null}

        {showModal ? (
          <View style={styles.container}>
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 20
              }}
              keyboardShouldPersistTaps={'handled'}
            >
              <Modal
                animationType="slide"
                transparent={false}
                visible={showModal}
                onRequestClose={this.props.updateBackStep}
              >
                <ModalHeader
                  title={title}
                  showBackButton={isLastStep ? false : true}
                  showCloseButton={false}
                  onBackPress={() => {
                    if (this.props.productlist.length === 0  && this.props.activeStep === 3){
                      // hack to skip to page 2
                      this.props.updateBackStep();
                      this.props.updateBackStep();
                    }else{ 
                      this.props.updateBackStep();
                    }
                  }
                }
                />
                <View style={styles.container}>
                  <ScrollView
                    contentContainerStyle={{
                      paddingBottom: 20
                    }}
                    keyboardShouldPersistTaps={'handled'}
                  >
                    {isLastStep ? (
                      <View style={styles.container}>
                        <ScrollView
                          contentContainerStyle={{
                            paddingBottom: 20
                          }}
                          keyboardShouldPersistTaps={'handled'}
                        >
                          <Text style={{ color: Colors.white, padding: 20 }}>
                            Your Advertisement is now available to be view.
                            Thank you for Advertising with E-flyer Junkie
                          </Text>

                          <Button
                            title="Done"
                            buttonStyle={styles.btnStyle}
                            titleStyle={styles.btnTextStyle}
                            onPress={() => {
                              try {
                                this.props.updateAgreement(false);
                                this.props.updateIsMobile(false);
                                this.props.updateEventTitle("");
                                this.props.updateEventDescription("");
                                this.props.updateEventStartDate("");
                                this.props.updateEventEndDate("");
                                this.props.updateBannerUrl("");
                                this.props.updateEventAddress("");
                                this.props.updateEventBuyNow("");
                                this.props.updateEventLatitude("");
                                this.props.updateEventLongitude("");
                                this.props.updateEventPhone("");
                                this.props.updateEventWebSite("");
                                this.props.updateSelectedProduct({});
                                this.props.updateSelectedProductPrice("");
                                this.props.updateEventPromoCode("");
                                this.props.updateEventReceiptUrl("");
                                this.props.updateEventTransactionKey(null);
                                this.props.updateEventTransactionLoading(false);
                                this.props.updateEventExpirationDate("");
                                this.props.updateValidSelectedAddress(false);
                                this.props.updateEventDuration("");
                                this.props.updateErrorMsg("");
                                this.props.updateActiveStep(0);
                                navigate("Events");
                              } catch (error) {
                                LogError('AdvertiseScreen::Navigate::Events', error);
                              }
                            }}
                          />
                          {receipturl ? (
                            <Button
                              title="View Receipt"
                              buttonStyle={[
                                styles.btnStyle,
                                { backgroundColor: Colors.silverGray }
                              ]}
                              titleStyle={[
                                styles.btnTextStyle,
                                { backgroundColor: Colors.silverGray }
                              ]}
                              onPress={() => {
                                try {
                                  Linking.openURL(receipturl);
                                } catch (error) {
                                  LogError('AbvertiseType::ViewReceipt', error);
                                }
                              }}
                            />
                          ) : null}
                        </ScrollView>
                      </View>
                    ) : (
                        <View style={styles.container}>
                          <View style={styles.container}>
                            {this.getStepContent(activeStep)}
                          </View>
                        </View>
                      )}
                  </ScrollView>
                </View>
              </Modal>
            </ScrollView>
          </View>
        ) : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    screen: state.main.navigation.screen,
    currentuser: state.main.contacts.currentuser,
    activeStep: state.main.stepper.activeStep,
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
    receipturl: state.advertise.order.receipturl,
    transactionkey: state.advertise.order.transactionkey,
    transactionloading: state.advertise.order.transactionloading,
    expirationdate: state.advertise.order.expirationdate,
    isValidAddressSelection: state.advertise.order.isValidAddressSelection,
    duration: state.advertise.order.duration,
    errormsg: state.advertise.order.errormsg, 
    productlist: state.product.list.items,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateBackStep: () => dispatch(updateBackStep()),
    updateNextStep: () => dispatch(updateNextStep()),
    updateActiveStep: activeStep => dispatch(updateActiveStep(activeStep)),
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
    updateIsMobile: ismobile => dispatch(updateIsMobile(ismobile)),
    updateAgreement: agreement => dispatch(updateAgreement(agreement)),
    updateSelectedProductPrice: amount =>
      dispatch(updateSelectedProductPrice(amount)),
    updateSelectedProduct: item => dispatch(updateSelectedProduct(item)),
    updateBannerUrl: bannerurl => dispatch(updateBannerUrl(bannerurl)),
    updateEventReceiptUrl: url => dispatch(updateEventReceiptUrl(url)),
    updateEventTransactionKey: key => dispatch(updateEventTransactionKey(key)),
    updateEventTransactionLoading: isloading =>
      dispatch(updateEventTransactionLoading(isloading)),
    updateEventExpirationDate: expirationdate =>
      dispatch(updateEventExpirationDate(expirationdate)),
    updateEventDuration: duration => dispatch(updateEventDuration(duration)),
    updateErrorMsg: errormsg => dispatch(updateErrorMsg(errormsg)),
    updateValidSelectedAddress: isValidAddressSelection =>
      dispatch(updateValidSelectedAddress(isValidAddressSelection))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdvertiseScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.black
  },
  textStyle: {
    margin: 15,
    color: Colors.white
  },
  headerStyle: {
    marginTop: 0,
    marginLeft: 15,
    marginBottom: 2,
    color: Colors.white
  },
  bodyStyle: {
    marginTop: 0,
    marginLeft: 15,
    marginBottom: 0,
    color: Colors.white
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
  btnCalendarStyle: {
    width: 50,
    margin: 15
  },
  btnTextStyle: {
    color: Colors.white
  },
  phonePrefix: {
    color: Colors.silverGray,
    fontSize: 15,
    margin: 5
  },
  findPlacesView: {
    paddingTop: 0,
    paddingBottom: 50,
    margin: 0
  },
  locationSuggestion: {
    backgroundColor: Colors.silverGray,
    padding: 3,
    fontSize: 18,
    borderWidth: 0.5,
    marginLeft: 5,
    marginRight: 5
  },
  destinationInput: {
    height: 40,
    borderWidth: 0.5,
    marginTop: 50,
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
    backgroundColor: Colors.silverGray
  },
  inputError: {
    textAlign: "left",
    fontSize: 12,
    color: Colors.red
  },
  inputStyle: {
    marginRight: 10,
    color: Colors.black
  },
  rightIconContainerStyle: {
    paddingRight: 10
  },
  viewInputStyle: {
    marginBottom: 12
  },
  containerStyle: {
    marginVertical: 10
  }
});
