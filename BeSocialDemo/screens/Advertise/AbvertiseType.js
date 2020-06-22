import React, { Component } from "react";
import { connect } from "react-redux";
import {
  //ImageBackground,
  View,
  StyleSheet,
  ScrollView,
  //Dimensions
} from "react-native";
import { H1 } from "nachos-ui";
import { PricingCard } from "react-native-elements";
import {
  updateIsMobile,
  updateEventAddress,
  updateEventLongitude,
  updateEventLatitude
} from "../../actions/advertise";

import { updateNextStep } from "../../actions/main";
import {
  updateSelectedProductPrice,
  updateSelectedProduct
} from "../../actions/product";

import { Colors } from "./../../styles";
import { LogError } from "./../../global";

class AbvertiseType extends Component {
  handleLocation = () => {
    try {
      this.props.updateIsMobile(false);
      this.handleStep();
    } catch (error) {
      LogError('AbvertiseType::handleLocation', error);
    }
  };

  handleMobile = () => {
    try {
      this.props.updateIsMobile(true);
      this.props.updateEventAddress("");
      this.props.updateEventLatitude("");
      this.props.updateEventLongitude("");
      this.handleStep();
    } catch (error) {
      LogError('AbvertiseType::handleMobile', error);
    }
  };

  handleStep = () =>{  
    const{activeStep,isMobile,productlist} =this.props;
    if (productlist.length === 0  && activeStep === 1){
      // hack to skip to page 2
      this.props.updateSelectedProductPrice("000");
      var item = {
                "description": isMobile ? "FREE MOBILE GO LIVE ADVERTISEMENT" : "FREE FIXED LOCATION ADVERTISEMENT",
                "id": "0",
                "isandroidenabled": false,
                "isenabled": true,
                "isiosenabled": false,
                "ismobile": isMobile,
                "name": "FREE",
                "price": "000",
                "sku": "1"
              };
      this.props.updateSelectedProduct(item);
      this.props.updateNextStep();
      this.props.updateNextStep();
    }else{ 
      this.props.updateNextStep();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 20
          }}
          keyboardShouldPersistTaps={'handled'}
        >
          <PricingCard
            color={Colors.primaryColor}
            title="Location"
            price="Set Address!"
            info={["restaurants, night events.."]}
            button={{ title: "GET STARTED" }}
            onButtonPress={this.handleLocation}
            containerStyle={{ backgroundColor: Colors.black }}
            infoStyle={{ color: Colors.white }}
            pricingStyle={{ color: Colors.orange }}
            titleStyle={{ color: Colors.white }}
          />

          <View>
            <H1 align="center" style={{ color: Colors.white }}>
              OR
            </H1>
          </View>

          <PricingCard
            color={Colors.primaryColor}
            title="Mobile"
            price="Go Live!"
            info={["Caribbean Festivals events, Food truck.."]}
            button={{ title: "GET STARTED" }}
            onButtonPress={this.handleMobile}
            containerStyle={{ backgroundColor: Colors.black }}
            infoStyle={{ color: Colors.white }}
            pricingStyle={{ color: Colors.orange }}
            titleStyle={{ color: Colors.white }}
          />
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    activeStep: state.main.stepper.activeStep,
    productlist: state.product.list.items,
    isMobile: state.advertise.order.isMobile,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateNextStep: () => dispatch(updateNextStep()),
    updateIsMobile: ismobile => dispatch(updateIsMobile(ismobile)),
    updateEventAddress: address => dispatch(updateEventAddress(address)),
    updateEventLongitude: longitude =>
      dispatch(updateEventLongitude(longitude)),
    updateEventLatitude: latitude => dispatch(updateEventLatitude(latitude)),
    updateActiveStep: activeStep => dispatch(updateActiveStep(activeStep)),
    updateSelectedProductPrice: amount => dispatch(updateSelectedProductPrice(amount)),
  updateSelectedProduct: item => dispatch(updateSelectedProduct(item)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AbvertiseType);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.black
  }
});
