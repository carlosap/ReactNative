import React, { Component } from 'react';
import ComponentView  from './view';
import {ActionNames, createAction} from '@app-redux/actions';
import preProcess from '../preprocess';
import {Toast,Modal,ActivityIndicator} from 'antd-mobile';
import Spinner from '../../components/spinner';
import { createForm } from 'rc-form';
import {save,load} from '../../utils/storage';
import {setActiveLanguage} from 'react-localize-redux';
import firebase from 'firebase';


/**
 * @description Login Container
 * @type Container
 * @author Inderdeep
 */
class Main extends Component {

    /**
     * Container
     * @param props
     */
    constructor(props){
        super(props);
        this.radio_props = [
            {label: 'English', value: "en" },
            {label: 'French', value: "fr" }
        ];
    }


    /**
     * ComponentDidMount Hook
     */
    componentDidMount(){
        Spinner.start();
	    const {changeLanguage} = this.props;
        load({
            key : "LANGUAGE"
        }).then((language)=>{
            console.log(language)
            let selectedIndex = 0;
            this.radio_props.map((lang,index)=>{
                if(lang.value==language){
                    selectedIndex = index
                }
            })
            this.refs.radioForm.updateIsActiveIndex(selectedIndex)
            changeLanguage(language)
        }).catch((e)=>{

        })
        setTimeout(this.checkLogin.bind(this),500)
    }
    componentWillUnmount(){
    }
    /**
     * Check login
     */
    checkLogin(){
        const {navigation,login,translate} = this.props;
        onAuthChanged((user)=> {
            if (user) {
                login(firebase.auth().currentUser.toJSON()).then(()=>{
                    setTimeout(()=>{
                        /**
                         * Changed it to secured because
                         * due to nested navigators, if i redirect to
                         * default INITIAL_SECURED_ROUTE, it loads the
                         * screen twice
                         * Reference -
                         * https://github.com/react-navigation/react-navigation/issues/2599
                         * Comment by javidjamae
                         */
                        navigation.navigate("secured");
                        Toast.success(translate("login.success"), 0.5);
                        Spinner.stop();
                    })
                })
            } else {
                // No user is signed in.
                Spinner.stop();
            }

        });
    }
   /**
     * Switch language
     * @param value
     */
    switchLanguage(language){
        language = language.value || language;
        const {changeLanguage} = this.props;
        save({
            key: "LANGUAGE",
            value: language
        });
        changeLanguage(language);
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
         * Login Action Creator
         * @param drawerId
         */
        login: (data) => {
            return dispatch(createAction(ActionNames.LOGIN,data))
        },
	/**
         * Change Language Action Creator
         * @param drawerId
         */
        changeLanguage: (language) => {
            return dispatch(setActiveLanguage(language))
        }
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
Main.displayName = "Splash";
export default preProcess(createForm()(Main), {
    connect: [mapStateToProps, bindAction],
    localize: true
});
/**
 * This is done in order to avoid registering
 * multiple callbacks on Auth Changed
 * It results in call of multiple callbacks
 * @param callback
 */
let onAuthChangedUnsubscribe = null;
function onAuthChanged(callback){
    onAuthChangedUnsubscribe?onAuthChangedUnsubscribe():null
    onAuthChangedUnsubscribe = firebase.auth().onAuthStateChanged(callback);
}
