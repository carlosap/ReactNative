import React, {Component} from 'react';
import ComponentView  from './view';
import {ActionNames, createAction} from '@app-redux/actions';
import preProcess from '../preprocess';
/**
 * @description Header With Menu
 * @type Container
 * @author Inderdeep
 */
class Main extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
    }
    /**
     * ComponentDidMount Hook
     */
    componentDidMount() {
        this.props.getProfile();
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
         * Save Profile Action Creator
         * @param drawerId
         */
        getProfile: (data) => {
            return dispatch(createAction(ActionNames.GET_PROFILE, data))
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
    }
};
Main.displayName = "Header-With-Menu";
export default preProcess(Main, {
    connect: [mapStateToProps, bindAction],
    localize: true
});
