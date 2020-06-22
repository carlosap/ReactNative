import React, { Component } from "react";
import { StyleSheet, View, Dimensions, Image } from "react-native";
import * as Location from 'expo-location';
import { PROVIDER_GOOGLE } from "expo";
import * as Permissions from 'expo-permissions';
import MapView from 'react-native-maps';
// import Constants from 'expo-constants';
import _ from "lodash";
import { connect } from "react-redux";
import {
  updateContacts,
  updateUsers,
  updateEvents,
  updateCurrentUser,
  updateAppConstSettings,
  updateAppState
} from "../actions/main";
import OverlayDialog from "../components/OverlayDialog";
import BubbleMarker from "../components/BubbleMarker";
import CurrentUserMapMarker from "../components/CurrentUserMapMarker";
import { dbUsers, dbEvents } from "../firebase-db";
import { LogError } from "../global";
import { Colors } from "./../styles";
import { getDistance } from "geolib"; // 2.0.24
import { NavigationActions, NavigationEvents } from "react-navigation";
import ModalLoader from "./../components/ModalLoader";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;

//fix starting point
const LATITUDE = 27.864183787629607; //37.4220;
const LONGITUDE = -82.6496086597111; //-122.0840;
const LATITUDE_DELTA = 0.055;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

let locationFixed = {
  latitude: LATITUDE,
  longitude: LONGITUDE,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA
};


const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 1000
};

const flagAll = require("../assets/red-dot.png");

class MapScreen extends Component {
  constructor(props) {
    super(props);
    this.mounted = false;
    this.heartBeat = null;
    this.heartBeatCount= 0;
    this.watchID = null;
    this.state = {
      events: [],
      users: [],
      constSettings: {},
      bubbleData: [],
      myPosition: null,
      region: null,
      radius: 0,
      showPopup: false,
      hasLocationPermissions: true,
      mapIsReady: false,
      selectedMarkerId: "",
      selectedItem: [],
      lastupdate: new Date().getTime(),
      errorMessage: null
    };
  }

  setNotificationCount = () => {
    try {
      const { currentnotificationscount, navigation } = this.props;
      if (navigation) {
        const setParamsAction = NavigationActions.setParams({
          key: "Notify",
          params: { notifyCount: currentnotificationscount }
        });
        navigation.dispatch(setParamsAction);
      }
    } catch (error) {
      LogError('MapScreen::setNotificationCount', errror.message);
    }
  };
  
  _getConstSettings = async () => {
    const { settings } = this.props;
    this.setState({
      constSettings: settings
    });
  }
  
  componentDidMount = async () => { 
    this.mounted = true;

    // get current user location
    await this._getCurrentUserLocationAsync();      
        
    this.setNotificationCount();

    // force first load update
    this.updateCoordinates();
 
  }

  componentDidUpdate(prevProps) {
   
    const { currentuser, events, users, settings, lastbgupdate } = this.props;
    const { enablelocation } = currentuser;

    //background override
    if(!_.isEqual(lastbgupdate, prevProps.lastbgupdate)) {
      this.watchLocation();
      this.updateEventCounter();
      this.updateCurrentUserCoordinates();
        //console.log('updateing....db');
        // this.watchLocation().then(() =>{
        //   this.updateEventCounter().then(() =>{
        //     this.updateCurrentUserCoordinates()
        //   });
        // });
    }

    prevProps = null; //added to address Closure scope leaks
  } 
  
  //Moved this logic here to avoid so much rendering.
  //we are just rendering on time base to avoid timers
  updateEventCounter = async () => {
    const { currentuser, events, users, settings } = this.props;
    const { enablelocation } = currentuser;

    // if ((!_.isEqual(currentuser, prevProps.currentuser) || !_.isEqual(events, prevProps.events) ||
    //   !_.isEqual(users, prevProps.users) || !_.isEqual(settings, prevProps.settings))) {

    // extra user based on location and settings
    const usersDB = _.filter(users, function (user) {
      return user.isActive === true && user.enablelocation;
    });

    this.setState(
      {
        events: events,
        users: usersDB,
        constSettings: settings,
        radius: settings[0].mapcirculeradius
      },
      () => {
        if (this.mounted) {
          if (enablelocation) {
            this._showUserLocationAsync();
          }
          this._countEventPopulationAsync();
          this._getConstSettings();
        }
      }
    );
  }


  updateCurrentUserCoordinates = () => {
    try {
      const { currentuser } = this.props;
      const { enablelocation } = currentuser;
      const { myPosition } = this.state;
      if (
        !_.isUndefined(currentuser) &&
        !_.isUndefined(myPosition) &&
        enablelocation
      ) {
          this.updateCoordinates();
      }
    } catch (error) {
      LogError('MapScreen::updateCurrentUserCoordinates', error);
    }
  };

  updateCoordinates = () => {
    try {
      this.updatetUser();         //current user
      this.updateMobileEvents();  //mobile events

    } catch (error) {
      LogError('MapScreen::updateCoordinates', error);
    }

  };

  updatetUser = () => {
    try {
      const dateobj = new Date();
      const { currentuser } = this.props;
      if(!_.isEmpty(currentuser.id)){
        dbUsers.child(currentuser.id).update({
          isliveuser: true,
          coordinates: currentuser.coordinates,
          showCurrentUser: currentuser.showCurrentUser,
          lastupdate: currentuser.lastupdate,
          updatesource: 'map-screen',
          lastupdatesource: dateobj.toString(),
        });
      }
    }catch(error) {
      LogError('MapScreen::updatetUser', error);
    }
  }

  updateMobileEvents = () => {
    try {
      const dateobj = new Date();
      const { currentuser, events } = this.props;
      const mobileEvents = _.filter(events, function (event) {
        return event.userid === currentuser.id && event.mobileevent;
      });
  
      if (!_.isEmpty(mobileEvents)) {
        _.forEach(mobileEvents, function (event) {
          //console.log('updating mobile eventID: ', event.id)
          dbEvents.child(event.id).update({
            coordinates: currentuser.coordinates,
            lastupdate: currentuser.lastupdate,
            updatesource: 'map-screen',
            lastupdatesource: dateobj.toString(),
          });
        });
      }
    }catch(error) {
      LogError('MapScreen::updateMobileEvents', error);
    }

  }

  checkHeartMapBeat = () => {
    try {
      this.heartBeatCount++;
      if(this.heartBeatCount === 3) {
            
            let { settings } = this.props;
            const { maprefreshrate }  = settings[0];
            clearInterval(this.heartBeat);
            this.heartBeat = null;
            this.heartBeatCount = 0;
            this.heartBeat = setInterval(this.checkHeartMapBeat, 20000);      
      }

      this.updateCurrentUserCoordinates();
      
    }catch(error) {
      LogError('MapScreen::checkHeartMapBeat', error);
    }
  
  }

  _showUserLocationAsync = async () => {
    try {
      const { events, constSettings } = this.state;
      let { currentuser } = this.props;
      const { mapcirculeradius } = constSettings[0];

      // reset showCurrentUser flag
      this.props.updateCurrentUser({
        ...currentuser,
        showCurrentUser: false
      });

      // ****** this should real be in server *****
      // calculating distance current user to each event
      // and returns the event that is closer to current user
      // to determine if current user will show in the map
      let distances = events
        .map(event => {
          return {
            id: event.id,
            withinBorder: getDistance(event.coordinates, currentuser.coordinates) < parseInt(mapcirculeradius),
            userid: event.userid
          };
        })
        .filter(item => {
          return item.withinBorder === true;
        });

      // set showCurrentUser flag
      if (distances.length > 0 && distances[0].withinBorder) {
        this.props.updateCurrentUser({
          ...currentuser,
          showCurrentUser: true
        });
      };

    } catch (error) {
      LogError('MapScreen::_showUserLocationAsync', error);
    }
  };

  _countEventPopulationAsync = async () => {
    try {
      const { users, events, constSettings } = this.state;
      const { mapcirculeradius } = constSettings[0];

      // count users in event based on distance
      // TODO potential issue not counting current user
      let arrayCount = events.map(event => {
        return {
          id: event.id,
          userid: event.userid,
          count: users.filter(user => {
            return (
              getDistance(event.coordinates, user.coordinates) < mapcirculeradius && event.userid !== event.id
            );
          }).length
        };
      });

      this.setState({
        bubbleData: arrayCount
      });
    } catch (error) {
      LogError('MapScreen::_countEventPopulationAsync', error);
    }

  };

  _getCurrentUserLocationAsync = async () => {

    try {
      this.mounted = true;
      const permission = await Permissions.askAsync(Permissions.LOCATION);
      const { locationServicesEnabled } = await Location.getProviderStatusAsync();

      if (permission.status === "granted" && locationServicesEnabled && this.mounted) {
        
        //if(this.watchID === null)
        await this.watchLocation();
      }  
      
    } catch (error) {
      LogError('MapScreen::_getCurrentUserLocationAsync', error);
    }
  };

  watchLocation = async () => {
    try {
      const { status } = await Permissions.getAsync(Permissions.LOCATION);
      if (status === 'granted') {
        this.watchID = navigator.geolocation.watchPosition(
          position => {
            const myLastPosition = this.state.myPosition ? this.state.myPosition : locationFixed;
            const myPosition = position.coords;
            if (!_.isUndefined(myLastPosition) && !_.isUndefined(myPosition) && !_.isEqual(myPosition.latitude, myLastPosition.latitude)) {
              this.setState({ myPosition });
              this.setCurrentUserLocation(myPosition);
              this.updateMobileEvents();  //mobile events
            }
          },
          null,
          GEOLOCATION_OPTIONS
        );
      }

    } catch (error) {
      LogError('MapScreen::watchLocation', error);
    }
  }

  setCurrentUserLocation = location => {
    try {
      let { currentuser, lastupdate } = this.props;

      // update current user coords
      this.props.updateCurrentUser({
        ...currentuser,
        isliveuser: true,
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        },
        lastupdate: lastupdate ? lastupdate : new Date().getTime(),
        updatesource: 'map-screen'
      });

      // set region = view map
      this.setState({
        region: {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }
      });
    } catch (error) {
      LogError('MapScreen::setCurrentUserLocation', error);
    }

  };

  //#region START - FUNCTION THAT HANDLE MAP COMPONENT
  _handleMapRegionChange = region => {
    // handler for map region change
    if (this.mounted)
      this.setState({
        region: region
      });
  };

  storeMapReference = map => {
    this.map = map;
  };

  onMapReady = () => {
    try {
      let { coordinates } = this.props.currentuser;
      let { mapIsReady } = this.state;
      if (!mapIsReady && this.mounted) {
        this.setState({ mapIsReady: true }, () => {
          // this.animateToMapcoordinates(this.props.userLocationObj.selectedMarkerId,this.props.userLocationObj.dataDB);
          // this.map.animateCamera(coordinates);
          this.map.animateCamera({
            center: coordinates,
            duration: 100,
            zoom: 15,
          });
        });
      }
    } catch (error) {
      LogError('MapScreen::onMapReady', error);
    }
  };

  onMarkerPress = e => {
    try {
      e.stopPropagation(); //it is a bug in react native map
      let selectedMarkerId = e.nativeEvent.id;
      let { events } = this.state;

      // Get selected event
      const selectedMarker = events.find(m => m.id === selectedMarkerId);

      if (!(this.map && selectedMarker)) {
        return;
      }

      if (this.mounted)
        this.setState({
          selectedItem: selectedMarker,
          selectedMarkerId: selectedMarkerId,
          showPopup: true
        });

      // this.map.animateCamera(selectedMarker.coordinates);

      this.map.animateCamera({
        center: selectedMarker.coordinates,
        duration: 100,
        zoom: 15,
      });
    } catch (error) {
      LogError('MapScreen::onMarkerPress', error);
    }

  };

  getPopulationCount = pinCount => {
    try {
      const { constSettings } = this.state;
      const { mappopulationcount } = constSettings[0];
      const { count1, count2, count3, count4 } = mappopulationcount;

      //Helper function for user count to set circle colors
      if (pinCount > 0 && pinCount <= count1) {
        return {
          pinCount: pinCount.toString(),
          styleDisplay: styles.bubble1,
          fillColorPin: Colors.brown
        };
      }

      if (pinCount > count1 && pinCount <= count2) {
        return {
          pinCount: 4,
          styleDisplay: styles.bubble2,
          fillColorPin: Colors.yellow
        };
      }

      if (pinCount > count2 && pinCount <= count3) {
        return {
          pinCount: 8,
          styleDisplay: styles.bubble3,
          fillColorPin: Colors.green
        };
      }

      if (pinCount > count3 && pinCount <= count4) {
        return {
          pinCount: 12,
          styleDisplay: styles.bubble4,
          fillColorPin: Colors.blue
        };
      }

      if (pinCount > count4) {
        return {
          pinCount: 16,
          styleDisplay: styles.bubble5,
          fillColorPin: Colors.red
        };
      }
    } catch (error) {
      LogError('MapScreen::getPopulationCount', error);
    }

  };

  renderCircle = marker => {
    try {
      let { bubbleData, constSettings } = this.state;
      // mapradiussize is meter => 1 mile = 1609.34 meters
      const { mapradiussize } = constSettings[0] || 1600; 
      let eventArray = _.head(
        _.filter(bubbleData, function (x) {
          return marker.id === x.id;
        })
      );

      if (!_.isEmpty(eventArray) && eventArray.count > 0) {
        //returns count
        let countObj = this.getPopulationCount(eventArray.count);

        if (!_.isEmpty(countObj)) {
          return (
            <MapView.Circle
              key={marker.id}
              identifier={marker.id}
              center={marker.coordinates}
              radius={parseInt(mapradiussize)}
              fillColor={countObj.fillColorPin}
            />
          );
        }
      }
    } catch (error) {
      LogError('MapScreen::renderCircle', error);
    }

  };

  storeMarkerReference = Marker => {
    this.Marker = Marker;
  };

  renderUsersMarker = marker => {
    try {
      const { showCurrentUser } = marker;
      return showCurrentUser ? (
        <MapView.Marker.Animated
          ref={this.storeMarkerReference}
          key={marker.id}
          identifier={marker.id}
          coordinate={marker.coordinates}
          onPress={this.onMarkerPress}
          opacity={0.2}
          anchor={{ x: 0.5, y: 1 }}
          centerOffset={{ x: 1, y: 1 }}
        >
          <Image
            source={flagAll}
            style={{ width: 20, height: 20, zIndex: 1000 }}
          />
        </MapView.Marker.Animated>
      ) : null;
    } catch (error) {
      LogError('MapScreen::renderUsersMarker', error);
    }
  };

  renderEventsMarker = marker => {
    try {
      const banner = marker.bannerurl ? { uri: marker.bannerurl } : "";
      return banner ? (
        <MapView.Marker.Animated
          ref={this.storeMarkerReference}
          key={marker.id}
          identifier={marker.id}
          coordinate={marker.coordinates}
          onPress={this.onMarkerPress}
          opacity={1}
          anchor={{ x: 0.5, y: 1 }}
          centerOffset={{ x: 1, y: 1 }}
        >
          <BubbleMarker banner={banner} mobileevent={marker.mobileevent} />
        </MapView.Marker.Animated>
      ) : null;
    } catch (error) {
      LogError('MapScreen::renderEventsMarker', error);
    }

  };

  renderCurrentLocationMarker = () => {
    try {
      let { heading, coordinate } = this.state;
      if (!coordinate) {
        const { myPosition } = this.state;
        if (_.isUndefined(myPosition)) return null;
        coordinate = myPosition;
        heading = myPosition.heading;
      }

      return (
        <CurrentUserMapMarker
          heading={heading}
          coordinate={coordinate}
          flag={flagCurrent}
        />
      );
    } catch (error) {
      LogError('MapScreen::renderCurrentLocationMarker', error);
    }
  };

  handleMapPressed = () => {
    if (this.mounted)
      this.setState({
        showPopup: false
      });
  };

  //#endregion
  
  render = () => {
    let {
      selectedItem,
      showPopup,
      events,
      region,
      bubbleData,
      users,
      mapIsReady      
    } = this.state;
    
    let { currentuser, settings } = this.props;
    const { enablelocation,showCurrentUser } = currentuser;
    let { id } = selectedItem;
    const { maprefreshrate }  = settings[0];

    //console.log('.......mparefresh');
    return (
      <View style={styles.container}>
        {!mapIsReady ? <ModalLoader loading={mapIsReady} /> : null}


        <NavigationEvents
          onWillFocus={payload => {

            this.watchLocation();
            this.updateEventCounter();
            this.updateCurrentUserCoordinates();
            
            
            

            if (maprefreshrate) {
              this.heartBeat = setInterval(this.checkHeartMapBeat, 20000);

            }

          }}

          onDidBlur={payload => {

            //console.log('leaving the map page ')
            clearInterval(this.heartBeat);
            navigator.geolocation.clearWatch(this.watchID);
            this.heartBeat = null;
            this.heartBeatCount = 0;
            this.watchID = null;
          }}
        
        /> 

        {users && events && region && region.latitude && region.longitude ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            ref={this.storeMapReference}
            style={styles.map}
            initialRegion={region}
            // region={region}
            onPress={this.handleMapPressed}
            // onRegionChange={this._handleMapRegionChange}
            onRegionChangeComplete={this._handleMapRegionChange}
            onUserLocationChange={this._setMyLocation}
            onMapReady={
              currentuser && currentuser.coordinates ? this.onMapReady : null
            }
            showsUserLocation={enablelocation ? (showCurrentUser ? false : true) : false} //iOS only
            // followsUserLocation={true} //iOS only
            // minZoomLevel={2}
            // maxZoomLevel={15}
            zoomControlEnabled
            zoomEnabled
            showsBuildings
            loadingEnabled
          >
            {/* render DB users */}
            {users.map(this.renderUsersMarker)}
            {events.map(this.renderEventsMarker)}
            {events.map(this.renderCircle)}
          </MapView>
        ) : null}

        {selectedItem && showPopup ? (
          <View
            style={{
              position: "absolute",
              bottom: 30,
              alignSelf: "center",
              height: 190,
              width: 337,
              backgroundColor: Colors.black,
              borderWidth: 2,
              borderRadius: 16,
              borderColor: Colors.black
            }}
          >
            <OverlayDialog
              selectedItem={selectedItem}
              count={
                bubbleData.find(x => {
                  return x.id === id;
                }).count
              }
            />
          </View>
        ) : null}
      </View>
    );
  };
}

function mapStateToProps(state) {
  return {
    users: state.main.contacts.users,
    events: state.main.contacts.events,
    currentuser: state.main.contacts.currentuser,
    entities: state.main.contacts.entities,
    settings: state.main.constsettings.settings,
    isForeground : state.main.appState.isForeground,
    lastbgupdate: state.main.backGroundTrigger.lastupdate,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateUsers: users => dispatch(updateUsers(users)),
    updateEvents: events => dispatch(updateEvents(events)),
    updateCurrentUser: currentuser => dispatch(updateCurrentUser(currentuser)),
    updateContacts: contacts => dispatch(updateContacts(contacts)),
    updateAppConstSettings: settings => dispatch(updateAppConstSettings(settings)),
    updateAppState : isForeground => dispatch(updateAppState(isForeground))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapScreen);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    marginTop: 20
  },
  textcontainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    marginTop: 20,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    width: width
  },
  buttonStyle: {
    backgroundColor: "white",
    borderRadius: 5,
    paddingVertical: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  bubble1: {
    flex: 0,
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffbbbb",
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    borderColor: "#ffbbbb",
    borderWidth: 1,
    opacity : 0.5
  },
  bubble2: {
    flex: 0,
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#bbffff",
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    borderColor: "#bbffff",
    borderWidth: 1,
    opacity : 0.5
  },
  bubble3: {
    flex: 0,
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffbbbb",
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    borderColor: "#ffbbbb",
    borderWidth: 1,
    opacity : 0.5
  },
  bubble4: {
    flex: 0,
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffbbff",
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    borderColor: "#ffbbff",
    borderWidth: 1,
    opacity : 0.5
  },
  bubble5: {
    flex: 0,
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#c7d2ff",
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    borderColor: "#c7d2ff",
    borderWidth: 1,
    opacity : 0.5
  },
  count: {
    textAlign: "center",
    color: "#fff",
    fontSize: 13
  }
});
