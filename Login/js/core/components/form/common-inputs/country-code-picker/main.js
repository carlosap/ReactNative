import React, { Component } from 'react';
import ComponentView  from './view';
import countryData from 'country-data';
/**
 * @description Component for country code picker
 * @type Component
 * @author Inderdeep
 */
export default class Main extends Component {

    /**
     * Container
     * @param props
     */
    constructor(props){
        super(props);
        this.state = {
            value : props.value || ["+91"]
        };
    }
    /**
     * ComponentDidMount Hook
     */
    componentDidMount(){

    }

    /**
     * Component Will Receive props hook
     * Set updated value in state
     */
    componentWillReceiveProps(nextProps){
        if(JSON.stringify(nextProps.value)!=JSON.stringify(this.state.value)){
            this.setState({
                value : nextProps.value
            })
        }
    }
    /**
     * on Change to be implemented
     * for it to work with rc-form
     */
    onChange(value){
        this.setState({value});
        const {onChange} = this.props;
        if(onChange){
            onChange(value);
        }
    }
    /**
     * Get Country Code Map for country picker
     */
    getCountryCodeMap() {
        const callingCountries = countryData.callingCountries.all;
        let output = Object.values(callingCountries).map((data) => {
            return {
                value: data.countryCallingCodes[0],
                label: data.countryCallingCodes[0] + " - " + data.name
            }
        });
        return [output];
    }

    /**
     * Render Method
     * @returns {*}
     */
    render() {
        return (ComponentView.bind(this))();
    }
}

Main.displayName = "Sample-Component";
