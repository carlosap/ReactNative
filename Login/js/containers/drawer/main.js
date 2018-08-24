import React, {Component} from 'react';
import ComponentView  from './view';
import {ActionNames, createAction} from '@app-redux/actions';
import preProcess from '../preprocess';
import firebase from 'firebase';
/**
 * @description Drawer Panel
 * @type Container
 * @author Inderdeep
 */
class Main extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
    }
    /**
     * ComponentDidMount Hook
     */
    componentDidMount() {

    }

    /**
     * Logout a user
     */
    logout(){
        const {logout,navigation} = this.props;
        firebase.auth().signOut().then(()=>{
            logout().then(()=>{
                navigation.navigate("login");
            });
        })
    }

    /**
     * Functions that are to be passed to drawer items
     * @returns {{logout: (function(this:Main))}}
     */
    getDrawerFunctions(){
       return {
           logout : this.logout.bind(this)
       }
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
        /**
         * Logout Action Creator
         * @param drawerId
         */
        logout: (data) => {
            return dispatch(createAction(ActionNames.LOGOUT,data))
        }
    }
};
/**
 * Bind State to props
 * @param dispatch
 * @returns {{Object}}
 */
const mapStateToProps = (state) => {
    return {
        user : state.user,
        drawer : !!state.ui.drawer
    }

};
Main.displayName = "Drawer-Panel";
export default preProcess(Main, {
    connect: [mapStateToProps, bindAction],
    localize: true
});
