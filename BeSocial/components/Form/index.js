import React, { Component } from 'react';
import { Button, List, View, Text } from 'antd-mobile-rn';
import { showMessage, getFirstError, numberValidator, integerValidator } from './validation';
import { createForm } from 'rc-form';
import Input from './input'

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.elementRefs = [];
  }

  modifyRules(rules) {
    return (rules || []).map((rule) => {
      let newRule = {
        ...rule
      };
      switch ((rule.type || '').toLowerCase()) {
        case 'number':
          delete newRule.type;
          return {
            validator: numberValidator,
            ...newRule
          };
        case 'integer':
          delete newRule.type;
          return {
            validator: integerValidator,
            ...newRule
          };

        default:
          return rule;
      }
    })
  }

  onSubmit() {
    const { onSubmit, onError } = this.props;
    const { validateFields } = this.props.form;
    validateFields((errors, values) => {

      if (errors) {
        showMessage(getFirstError(errors));
        if (onError) {
          onError(errors);
        }
        return;
      }
      if (onSubmit) {
        onSubmit(values);
      }
    });
  }

  getExposedConfig() {
    const { form } = this.props.form;
    return {
      form
    }
  }

  render() {
    const { elements, style, submitTrigger, form } = this.props;
    // const { getFieldDecorator } = form;
    let submitBtn = this.props;
    if (typeof submitTrigger != 'undefined') {
      if (!submitTrigger) {
        submitBtn = null;
      } else {
        const { getTrigger, buttonProps, textProps, text } = submitTrigger;
        if (typeof getTrigger != 'undefined' && getTrigger instanceof Function) {
          submitBtn = getTrigger(this.getExposedConfig())
        } else {
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
          (elements || []).map((element, index) => {
            const { type, name, inputProps, after, before, options, customElement } = element;
            return (
              <View key={index}>
                {before}
                <Input
                  name={name}
                  type={type}
                  inputProps={inputProps}
                />


                {after}
              </View>
            )
          })
        }
        {submitBtn}
      </List>
    );
  }
}
//export default createForm()(Form);