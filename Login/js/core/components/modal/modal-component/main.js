import React, { Component } from 'react';
import ComponentView  from './view';
/**
 * @description Modal Trigger Component
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
            visible : props.visible && true
        }
    }
    /**
     * ComponentDidMount Hook
     */
    componentDidMount(){

    }

    componentWillReceiveProps(newProps){
        if(this.state.visible!=newProps.visible){
            this.setState({
                visible : newProps.visible
            })
        }
    }

    /**
     * Hide Modal
     */
    hideModal(){
        const {onHide} = this.props;
        this.setState({
            visible: false
        });
    }
    /**
     * Render Method
     * @returns {*}
     */
    render() {
        return (ComponentView.bind(this))();
    }
}

Main.displayName = "Modal";
