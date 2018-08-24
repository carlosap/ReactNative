import {Toast} from 'antd-mobile';
/**
 * Get First error
 * @param errors
 */
export function getFirstError(errors){
    //console.log(errors)
    const keys = Object.keys(errors || {});
    if(keys.length>0){
        return errors[keys[0]].errors[0].message;
    } else {
        return null;
    }
}


/**
 * Show Validation messages
 * @param messages
 */
export function showMessage(message) {
    Toast.fail(message,0.5,null,false);
}

export function numberValidator(rule, value, callback){
    if (isNaN(value)) {
        callback(new Error(rule.message || "Invalid Number Value"));
    } else {
        callback();
    }
};
export function integerValidator(rule, value, callback){
    if (isNaN(value) || !Number.isInteger(parseFloat(value))) {
        callback(new Error(rule.message || "Invalid Integer Value"));
    } else {
        callback();
    }
};
