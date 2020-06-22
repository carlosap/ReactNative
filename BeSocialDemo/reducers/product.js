import { combineReducers } from 'redux';
import {
    UPDATE_PRODUCT_LIST,
    UPDATE_SELECTED_PRODUCT_PRICE,
    UPDATE_SELECTED_ITEM,
} from '../actions/product';


const initState = {
    items: [],
}

const initSelectedProduct = {
    amount: '',
    item: {},
}

const selected = (state = initSelectedProduct, action) => {
    const { type, payload } = action;

    switch(type) {
        case UPDATE_SELECTED_ITEM:
            {
                return {
                    ...state,
                    item: payload,
                }
            }
        case UPDATE_SELECTED_PRODUCT_PRICE:
            {
                return{
                    ...state,
                    amount: payload,
                }
            }
        default:
            {
                return state;
            }
    }
}

const list = (state = initState, action) => {
    const { type, payload } = action;
    
    switch(type) {
        case UPDATE_PRODUCT_LIST:
            {
                return {
                    ...state,
                    items: payload,
                }
            }
        default:
            {
                return state;
            }
    }
}

const product = combineReducers({
    list,
    selected,
});

export default product;