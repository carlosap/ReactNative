import Expo from 'expo';
import {askPermission} from './permissions'
import {Platform} from 'react-native';
const { Permissions, Notifications } = Expo;
/**
 * Schedule the notification
 * @param notification
 * @param delay - in seconds
 */
export function scheduleLocalNotification(notification,delay){
    Expo.Notifications.scheduleLocalNotificationAsync(notification, {
        time : (new Date()).getTime() + delay*1000
    });
}
/**
 * Get Expo Server Token for Pushing notification
 * You can use it on server to send notifications to this client
 * @returns {Promise.<*>}
 */
export async function getExpoPushServerToken() {
    const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await askPermission(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if(Platform.OS =='ios'){
        //For Ios it returns undetermined even if there is permission
        if (['granted','undetermined'].indexOf(finalStatus)==-1) {
            return;
        }
    } else {
        if (finalStatus !== 'granted') {
            return;
        }
    }
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    console.log(token)
    return token;

}