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
            visible : false
        }
    }
    /**
     * ComponentDidMount Hook
     */
    componentDidMount(){

    }

    /**
     * On trigger press
     */
    onPress(onPress){
        this.setState({
            visible: true
        },()=>{
            if(onPress instanceof Function){
                onPress()
            }
        })
    }

    /**
     * Hide Modal
     */
    hideModal(){
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

Main.displayName = "ModalTrigger";
