import React, {Component} from 'react';
import {connect} from 'react-redux';
import ComponentView from './view';
import {ActionNames, createAction} from '@app-redux/actions';
import preProcess from '../preprocess';
import {Toast} from 'antd-mobile';
import {Notifications} from 'expo';
import {scheduleLocalNotification,getExpoPushServerToken} from '../../utils/notifications'
class Main extends Component {

    /**
     * Container
     * @param props
     */
    constructor(props){
        super(props);
        this.state = {
            token : null,
            notification: null
        }
    }
    /**
     * ComponentDidMount Hook
     */
    componentDidMount(){
        // Handle notifications that are received or selected while the app
        // is open. If the app was closed and then opened by tapping the
        // notification (rather than just tapping the app icon to open it),
        // this function will fire on the next tick after the app starts
        // with the notification data.
        this._notificationSubscription = Notifications.addListener(this.handleNotification.bind(this));
    }

    /**
     * Schedule Local Notification
     */
    scheduleLocalNotification(){
        scheduleLocalNotification({
            title : "Check this!",
            body : "Arivaa Basic is awesome. Click me to check awesomeness"
        },5);
        Toast.success("Please exit the app to receive the notification");
    }

    /**
     * Register for expo notification
     */
    async registerForExpoNotification(){
        const token = await getExpoPushServerToken();
        this.setState({token})
    }

    /**
     * Handle Notification Received
     */
    handleNotification(notification){
        this.setState({notification});
    }

    getCurlString(){
        return `
        curl -H "Content-Type: application/json" -X POST [https://exp.host/--/api/v2/push/send](https://exp.host/--/api/v2/push/send) -d '{
                                    "to": "ExponentPushToken[${this.state.token}]",
                                    "title":"hello",
                                    "body": "world"
                                }'
        
        `
    }
    /**
     * Render Method
     * @returns {*}
     */
    render() {
        return (ComponentView.bind(this))();
    }
}

/**
 * Bind Redux Actions
 * @param dispatch
 * @returns {{Object}}
 */
const bindAction = (dispatch) => {
    return {
    }
};
/**
 * Bind State to props
 * @param dispatch
 * @returns {{Object}}
 */
const mapStateToProps = (state) => {
    const {auth} = state;
    return {
        auth
    };
};
Main.displayName = "Push-Notifications";
export default preProcess(Main, {
    connect: [mapStateToProps, bindAction],
    localize: true
});