import React, { Component } from "react";
import { connect } from "react-redux";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import { updateNextStep, updateActiveStep } from "../../actions/main";
import { Tile } from "react-native-elements";
import { Button } from "react-native-elements";
import { Table, Row, Rows } from "react-native-table-component";
import { Colors } from "./../../styles";
import LogoContainer from "./../../components/LogoContainer";
import moment from "moment";
import { dbEvents } from "../../firebase-db";
import { LogError } from "./../../global";


class ReviewOrder extends Component {

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
      duration,
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
      updatesource: 'reviewOrder-screen',
      lastupdatesource: new Date().getTime(),
    };

    try {
      dbEvents.push(eventItem);
      this.props.updateActiveStep(7);
    } catch (error) {
      LogError('ReviewOrder::addEvent', error);
    }
  };

  render() {
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
      //longitude,
      //latitude,
      amount,
      bannerurl,
      promocode
    } = this.props;

    const tableHead = [];
    const tableData = [];
    tableData.push(["Selection:", `$${amount / 100}.00`]);
    tableData.push(["Event Title:", title]);
    tableData.push(["Description:", description]);
    tableData.push(["Mobile Event:", isMobile ? "Yes" : "No"]);
    tableData.push([
      "Start Date/Time:",
      moment(startdate).format("MMMM Do YYYY, h:mm:ss a")
    ]);
    tableData.push([
      "End Date/Time:",
      moment(enddate).format("MMMM Do YYYY, h:mm:ss a")
    ]);

    /* Add these options only if NOT mobile */
    if (!isMobile) {
      tableData.push(["Address:", address]);
      // tableData.push(["Longitude:", longitude]);
      // tableData.push(["Latitude:", latitude]);
    }

    tableData.push(["Tel:", phone]);
    tableData.push(["Website:", website]);
    tableData.push(["Buy Now URL:", buynowurl]);
    tableData.push(["Promo Code:", promocode]);

    /* No charges Skip process */
    let isNoCharge = false;
    let bTitle = "Proceed to Payment";
    if (amount === "000") {
      isNoCharge = true;
      bTitle = "Next"
    }

    return (
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 20
        }}
        style={styles.container}
        keyboardShouldPersistTaps={'handled'}
      >
        <LogoContainer />
        {bannerurl ? (
          <Tile imageSrc={{ uri: bannerurl }} featured activeOpacity={1.0} />
        ) : null}
        <View>
          <Text style={styles.reviewTextHeader}> Event Review </Text>
          <Table borderStyle={{ borderWidth: 0, borderColor: Colors.black }}>
            <Row data={tableHead} style={styles.head} textStyle={styles.text} />
            <Rows data={tableData} textStyle={styles.text} />
          </Table>
        </View>
        <Button
          title={bTitle}
          titleStyle={styles.btnTextStyle}
          buttonStyle={styles.btnStyle}
          onPress={() => {
            try {
              if (isNoCharge) {
                //skip to last step
                this.addEvent();

              } else {
                //next step is payment
                this.props.updateNextStep();
              }

            } catch (error) {
              LogError('ReviewOrder::ProceedToPayment', error);
            }
          }}
        />
      </ScrollView>
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
    amount: state.product.selected.amount,
    bannerurl: state.advertise.order.bannerurl,
    promocode: state.advertise.order.promocode,
    currentuser: state.main.contacts.currentuser,
    receipturl: state.advertise.order.receipturl,
    expirationdate: state.advertise.order.expirationdate,
    duration: state.advertise.order.duration,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateNextStep: () => dispatch(updateNextStep()),
    updateActiveStep: activeStep => dispatch(updateActiveStep(activeStep)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewOrder);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.black
  },
  head: {
    height: 30,
    backgroundColor: Colors.black
  },
  text: {
    margin: 6,
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
  btnTextStyle: {
    color: Colors.white
  },
  reviewTextHeader: {
    paddingTop: 30,
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  }
});
