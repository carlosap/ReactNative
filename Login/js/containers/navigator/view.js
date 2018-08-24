import React from 'react';
import {INITIAL_ROUTE} from '../../routing';
import {
    StackNavigator,
} from 'react-navigation';
import {Routes} from '../../routing';

const Navigator = StackNavigator(Routes,{
    initialRouteName : INITIAL_ROUTE,
    headerMode : 'none'
});
/**
 * Returns the JSX Markup for the view
 * @returns {XML}
 */
var view = function () {
    return (
        <Navigator onNavigationStateChange = {this.onNavigationStateChange.bind(this)}/>
    );
}
module.exports = view;
