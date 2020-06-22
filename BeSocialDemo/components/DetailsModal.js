import React, { Component } from "react";
import {
  View,
  Text,
  Platform,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Linking,
  ScrollView
} from "react-native";
import { Button, Icon, ListItem, Image, Input } from "react-native-elements";
import ImageZoom from "react-native-image-pan-zoom";
import _ from "lodash";
import { H3 } from "nachos-ui";
import MapView from 'react-native-maps';
import Constants from 'expo-constants';
import { Colors } from "./../styles";
import moment from "moment";
const { width, height } = Dimensions.get("window");
const CustomHeight = width * 0.8;
const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 0.03358723958820065; //Very high zoom level
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const DetailsModal = props => {
  const { selectedItem, type } = props;
  let {
    bannerurl,
    title,
    starteventat,
    endeventat,
    description,
    url,
    address,
    phone,
    coordinates,
    buyUrl,
    promocode,
    navigateto
  } = selectedItem;
  let { latitude, longitude } = coordinates ? coordinates : "";

  //data coming from notification is uniform
  if (navigateto) url = navigateto; 

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 20
      }}
      style={styles.container}
      keyboardShouldPersistTaps={'handled'}
    >
      {/* top image section */}
      {bannerurl ? (
        // removed Tile untill they have support for resizeMode
        // <Tile imageSrc={{ uri: bannerurl }} featured activeOpacity={1.0} imageContainerStyle={{ resizeMode:'contain'}} />
        <ImageZoom
          cropWidth={width}
          cropHeight={CustomHeight}
          imageWidth={width}
          imageHeight={CustomHeight}
        >
          <Image
            source={{ uri: bannerurl}}
            resizeMode= "contain"
            containerStyle={{
              width,
              height: CustomHeight,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ffffff",
              backgroundColor: Colors.black
            }}
            PlaceholderContent={
              <View style={styles.activityIndicatorWrapper}>
                <ActivityIndicator color={Colors.primaryColor} />
              </View>
            }
          />
        </ImageZoom>
      ) : null}

      {/* title section */}
      {title ? (
        <View>
          <H3 style={styles.eventTitle}>
            {title.length > 50
              ? `${title.toUpperCase().substr(0, 50)}...`
              : title.toUpperCase()}
          </H3>
        </View>
      ) : null}

      {/* description  section */}
      {description ? (
        <View>
          <ListItem
            containerStyle={styles.listContainerStyle}
            title="DESCRIPTION"
            titleStyle={{
              fontSize: 14,
              fontWeight: "bold",
              color: Colors.black
            }}
            leftIcon={
              <Icon
                type="ionicon"
                color={Colors.black}
                size={16}
                name="md-information-circle"
              />
            }
            hideChevron
          />
          <Text style={{ padding: 20, color: Colors.white }}>
            {" "}
            {description}
          </Text>
        </View>
      ) : null}

      {/* Date  section */}
      {_.isEqual(type.toLowerCase(), "events") ? (
        starteventat ? (
          <View
            style={{
              flexDirection: "row",
              backgroundColor: Colors.orange
            }}
          >
            <View style={styles.leftRowTextWrapper}>
              <Text style={styles.topItemRowText}>Start Date</Text>
              <Text style={styles.bottomItemRowText}>
                {moment(starteventat).format("MMMM Do YYYY, h:mm A")}
              </Text>
            </View>
            {endeventat ? (
              <View style={styles.rightRowTextWrapper}>
                <Text style={styles.topItemRowText}>End Date</Text>
                <Text style={styles.bottomItemRowText}>
                  {moment(endeventat).format("MMMM Do YYYY, h:mm A")}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null
      ) : (
        <View
          style={{
            flexDirection: "row",
            backgroundColor: Colors.orange
          }}
        >
          <View style={styles.leftRowTextWrapper}>
            <Text style={styles.topItemRowText}>Start Date</Text>
            <Text style={styles.bottomItemRowText}>{starteventat}</Text>
          </View>
        </View>
      )}

      {/* website  section */}
      {url ? (
        <View
          style={{
            margin: 10,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center"
          }}
        >
          <Button
            title="More Info"
            titleStyle={{ paddingLeft: 10, color: Colors.white }}
            icon={
              <Icon
                type="ionicon"
                color={Colors.white}
                size={18}
                name="md-link"
                paddingTop={3}
              />
            }
            buttonStyle={{
              width: "90%",
              backgroundColor: Colors.primaryColor,
              borderRadius: 12
            }}
            onPress={() => {
              Linking.openURL(url);
            }}
          />
        </View>
      ) : null}

      {/* promo  section */}
      {promocode ? (
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <ListItem
            containerStyle={styles.listContainerStyle}
            title="PROMOTION CODE"
            titleStyle={{
              fontSize: 14,
              fontWeight: "bold",
              color: Colors.black
            }}
            leftIcon={
              <Icon
                type="ionicon"
                color={Colors.black}
                size={16}
                name="md-cash"
              />
            }
            hideChevron
          />
          <Input
            placeholder="No Promotion Code Available"
            value={promocode}
            editable={false}
            leftIconContainerStyle={{ paddingRight: 10 }}
            inputStyle={{ color: Colors.white }}
          />
        </View>
      ) : null}

      {/* address  section */}
      {address ? (
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <ListItem
            containerStyle={styles.listContainerStyle}
            title="EVENT LOCATION"
            titleStyle={{
              fontSize: 14,
              fontWeight: "bold",
              color: Colors.black
            }}
            leftIcon={
              <Icon
                type="ionicon"
                color={Colors.black}
                size={16}
                name="md-locate"
              />
            }
            hideChevron
          />
          <Text
            style={{
              padding: 20,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              color: Colors.white
            }}
          >
            {" "}
            {address}
          </Text>
        </View>
      ) : null}

      {/* map  section */}
      {latitude && longitude ? (
        <View style={styles.containerMap}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
            }}
            pitchEnabled={false}
            rotateEnabled={false}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <MapView.Marker
              coordinate={{
                latitude: latitude,
                longitude: longitude
              }}
              title={title}
            />
          </MapView>
        </View>
      ) : null}

      {/* buttons  section */}
      <View style={{ flexDirection: "row", height: 50 }}>
        {phone ? (
          <View style={{ flex: 1, height: 50 }}>
            <Button
              title="CALL"
              titleStyle={{ paddingLeft: 10, color: Colors.white }}
              icon={
                <Icon
                  type="ionicon"
                  color={Colors.white}
                  size={18}
                  name="md-call"
                  paddingTop={4}
                />
              }
              buttonStyle={{
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                backgroundColor: Colors.primaryColor,
                borderRadius: 12,
                paddingLeft: 10,
                width: width / 2.4
              }}
              onPress={() => {
                const url = `${"tel://"}${phone}`;
                Linking.openURL(url);
              }}
            />
          </View>
        ) : null}

        {latitude && longitude ? (
          <View style={{ flex: 1, height: 50 }}>
            <Button
              title="Direction"
              titleStyle={{ paddingLeft: 10, color: Colors.white }}
              icon={
                <Icon
                  type="ionicon"
                  color={Colors.white}
                  size={18}
                  name="md-map"
                  paddingTop={4}
                  paddingTop={4}
                />
              }
              buttonStyle={{
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                backgroundColor: Colors.primaryColor,
                borderRadius: 12,
                width: width / 2.4
              }}
              onPress={() => {
                const url = Platform.select({
                  // ios: "maps:" + latitude + "," + longitude,
                  // android: "geo:" + latitude + "," + longitude
                  ios: "maps://app?daddr=" + latitude + "," + longitude,
                  android: "google.navigation:q=" + latitude + "," + longitude
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
            />
          </View>
        ) : null}
      </View>

      {/* get ticket  section */}
      {buyUrl ? (
        <View style={{ margin: 10 }}>
          <Button
            title="Buy Tickets"
            titleStyle={{ paddingLeft: 10, color: Colors.white }}
            icon={
              <Icon
                type="ionicon"
                color={Colors.white}
                size={18}
                name="md-cart"
                paddingTop={4}
              />
            }
            buttonStyle={{
              width: "70%",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              backgroundColor: Colors.primaryColor,
              borderRadius: 12,
              width: width / 2
            }}
            onPress={() => {
              Linking.openURL(buyUrl);
            }}
          />
        </View>
      ) : null}
    </ScrollView>
  );
};

export default DetailsModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.black
    // marginTop: Constants.statusBarHeight
  },
  listContainerStyle: {
    backgroundColor: Colors.orange,
    paddingTop: 8,
    paddingBottom: 8
  },
  containerMap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: Colors.secondaryColor,
    height: 200,
    width: 200,
    margin: 10
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  eventTitle: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    fontWeight: "bold",
    color: Colors.primaryColor
  },
  rightRowTextWrapper: {
    flex: 1,
    borderWidth: 1,
    height: 50,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: Colors.orange,
    color: Colors.black
  },
  leftRowTextWrapper: {
    flex: 1,
    borderWidth: 1,
    height: 50,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: Colors.orange,
    color: Colors.black
  },
  topItemRowText: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    fontSize: 10,
    ...Platform.select({ ios: { paddingTop: 5 }, android: { paddingTop: 5 } })
  },
  bottomItemRowText: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    fontSize: 12,
    ...Platform.select({ ios: { paddingTop: 10 }, android: { paddingTop: 5 } })
  },
  activityIndicatorWrapper: {
    backgroundColor: Colors.black,
    height: CustomHeight,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  }
});
