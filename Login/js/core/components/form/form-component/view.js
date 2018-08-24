import React from 'react';
import {Button,List,View,Text} from 'antd-mobile';
import Input from '../input';
/**
 * Returns the JSX Markup for the view
 * @returns {XML}
 */
var view = function () {
    const {elements, style, submitTrigger,form} = this.props;
    const {getFieldDecorator} = form;
    let submitBtn = this.props;
    if (typeof submitTrigger != 'undefined') {
        if (!submitTrigger) {
            submitBtn = null;
        } else {
            const {getTrigger, buttonProps,textProps,text} = submitTrigger;
            /**
             * A function get Trigger can be exposed to get a submit trigger
             * except the button, All the exposed configuration is passed to trigger
             */
            if (typeof getTrigger != 'undefined' && getTrigger instanceof Function) {
                submitBtn = getTrigger(this.getExposedConfig())
            } else {
                /**
                 * Default onPress property not allowed
                 * @type {XML}
                 */
                submitBtn = (
                    <Button
                        {...buttonProps}
                        onClick={this.onSubmit.bind(this)}
                    >
                        <Text {...textProps}>{text || "Submit"}</Text>
                    </Button>
                )
            }
        }
    } else {
        submitBtn = (
            <Button
                type="default"
                onClick={this.onSubmit.bind(this)}
            >
                Submit
            </Button>
        )
    }

    return (
        <List styles={style}>
            {
                (elements || []).map((element,index)=>{
                    /**
                     * Supports custom elements
                     */
                    const {type,name,inputProps,after,before,options,customElement} = element;
                    return (
                        <View key = {index}>
                            {before}
                            {
                                getFieldDecorator(name,{
                                    ...options,
                                     rules : this.modifyRules(options?options.rules:null)
                                    } || {})(
                                        customElement?customElement:(
                                            <Input
                                                name = {name}
                                                type = {type}
                                                inputProps = {inputProps}
                                            />
                                        )
                                )
                            }
                            {after}
                        </View>
                    )
                })
            }
            {submitBtn}
        </List>
    )
}
module.exports = view;
