/**
 * Helper for analytics
 */
import Expo from 'expo';
/**
 * Configure analytics
 * @param android
 * @param ios
 */
export function configure({android,ios}){
    Expo.Segment.initialize( {
        androidWriteKey : android,
        iosWriteKey : ios
    } )
}
/**
 * Identify logged in user
 * @param userId
 * @param traits
 */
export function identifyUser(userId,traits){
    Expo.Segment.identifyWithTraits(userId, traits)
}
/**
 * Clears user
 */
export function clearUser(){
    Expo.Segment.reset();
}
/**
 * Track event with or without properties
 * @param event
 * @param properties
 */
export function trackEvent(event,properties){
    if(properties){
        Expo.Segment.trackWithProperties(event,properties)
    } else {
        Expo.Segment.track(event)
    }
}
/**
 * track screen with properties or without it
 * @param screenName
 * @param properties
 */
export function recordScreenTransition(screenName,properties){
    if(properties){
        Expo.Segment.screenWithProperties(screenName,properties)
    } else {
        Expo.Segment.screen(screenName)
    }

}