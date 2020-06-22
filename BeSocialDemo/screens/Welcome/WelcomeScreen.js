import React, { Component } from 'react';
import _ from "lodash";
import { View, Dimensions, AsyncStorage, Image } from 'react-native';
// import * as Permissions from 'expo-permissions';
// import * as TaskManager from 'expo-task-manager';
// import * as Location from 'expo-location';
import Swiper from 'react-native-swiper';
import { Button } from "react-native-elements";
import { Colors } from "./../../styles";
// import { dbUsers, dbBackGroundTrigger } from "../../firebase-db"
// import { LogError } from "../../global"

const { width, height } = Dimensions.get('window');
const splashes = [
  require('../../assets/welcome/1.png'),
  require('../../assets/welcome/2.png'),
  require('../../assets/welcome/3.png'),
];

// Background
// const LOCATION_TASK_NAME = '@eflyerjunkieapp:background-location-task';
// const CURRENT_USER = '@eflyerjunkieapp:currentuser';


class Welcome extends Component {

  // componentDidMount = async () => {
  //   //this.registerTaskAsync();
  // }
  
  // registerTaskAsync = async () => {

  //   try {
  //     const permission = await Permissions.askAsync(Permissions.LOCATION);
  //     if (permission.status === "granted") {
  //       Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, { 
  //         accuracy: Location.Accuracy.Balanced 
  //       });
  //     }  
      
  //   } catch (error) {
  //     LogError('WelcomeScreen::registerTaskAsync', error);
  //   }
  // };

  render() {
    const swiperConfig = {
      loop: false,
      showsButtons: false,
      dot: <View style={styles.dot} />,
      activeDot: <View style={[styles.dot, styles.activeDot]} />
    }

    return (
      <Swiper style={styles.wrapper} {...swiperConfig}>
        <View style={styles.slide}>
          <Image style={styles.image} source={splashes[0]} />
        </View>

        <View style={styles.slide}>
          <Image style={styles.image} source={splashes[1]} />
        </View>

        <View style={styles.slide}>
          <Image style={styles.image} source={splashes[2]} /> 

          <Button
            title="Get Started Now"
            titleStyle={styles.btnTextStyle}
            containerStyle={styles.btnContainerStyle}
            buttonStyle={styles.btnStyle}
            onPress={this.props.onPress}
            />
        </View>
      </Swiper>
    )
  }
}

// TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data: { locations }, error }) => {
//   if (error) return;

//   try {
//     dbBackGroundTrigger.on("value", snap => {
//       const trigger = snap.val();
//       AsyncStorage.getItem(CURRENT_USER).then((id) => {
//         if (id) {
//           if (trigger.enableLocation && !_.isEmpty(locations[0])) {
//             GetDeltaDimensions().then((delta) => {
//               const userinfo = {
//                 isliveuser: true,
//                 coordinates: {
//                   latitude: locations[0]["coords"].latitude,
//                   longitude: locations[0]["coords"].longitude,
//                   latitudeDelta: delta.LATITUDE_DELTA,
//                   longitudeDelta: delta.LONGITUDE_DELTA
//                 },
//                 updatesource: `background-location`,
//                 lastupdatesource: new Date().getTime(),
//               }
//               //console.log(`Background update for userid........ ${id}`);
//               dbUsers.child(id).update(userinfo);
//             });
//           }
//         }
//       })
//     });
//   } catch (error) {
//     LogError('WelcomeScreen::LOCATION_TASK_NAME', error);
//   }
// });

// async function GetDeltaDimensions() {
//   let retVal = {};
//   const { width, height } = Dimensions.get("window");
//   const ASPECT_RATIO = width / height;
//   const LATITUDE_DELTA = 0.055;
//   const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
//   retVal.LATITUDE_DELTA = LATITUDE_DELTA;
//   retVal.LONGITUDE_DELTA = LONGITUDE_DELTA;
//   return retVal;
// }



const styles = {
  wrapper: { 
  },
  slide: {
    flex: 1,
    //alignItems: 'center',
    // flexDirection: "column",
  },
  image: {
    resizeMode: 'contain',
    width,
    height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  logo: {
    width: '70%',
    resizeMode: 'contain',
  },
  text: {
    color: Colors.black,
    fontSize: 30,
    marginTop: 190,
    alignSelf: 'center'
  },
  dot: {
    backgroundColor: Colors.primaryColor,
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3
  },
  activeDot: {
    backgroundColor: Colors.yellow,
    width: 12,
    height: 12,
    borderRadius: 6
  },
  btnContainerStyle :{
    position: 'absolute',
    bottom: 45,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  btnStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: 12,
    width: "70%",
  },
  btnTextStyle: {
    color: Colors.white
  }
}

export default Welcome