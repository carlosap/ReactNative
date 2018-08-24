/**
 * In title put the translation key from drawer.json
 * in config/translations folder
 *
 * onPress - function to be called that is exposed via getDrawerFunctions in
 * main.js
 * @type {[*]}
 */
var drawerItems = [{
  title : 'drawer.home',
  route : 'home',
  icon : 'ios-home-outline'
},{
  title : 'drawer.profile',
  route : 'profile',
  icon : 'ios-person-outline'
},{
    title : 'drawer.analytics',
    route : 'analytics',
    icon : 'ios-stats-outline'
},{
    title : 'drawer.admob',
    route : 'admob',
    icon : 'ios-bookmark-outline'
},{
    title : 'drawer.facebookAds',
    route : 'facebookAds',
    icon : 'ios-podium-outline'
},{
    title : 'drawer.pushnotifications',
    route : 'pushNotifications',
    icon : 'ios-notifications-outline'
},{
    title : 'drawer.map',
    route : 'map',
    icon : 'ios-map-outline'
},{
    title : 'drawer.changePassword',
    route : 'changePassword',
    icon : 'ios-lock-outline',
    hidden : (user)=>{
        return !user.email;
    }
},{
    title : 'drawer.logout',
    onPress : 'logout',
    icon : 'ios-redo-outline'
}];

export default drawerItems;
