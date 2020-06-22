import { combineReducers } from 'redux';
import {
    UPDATE_AGREEMENT_FLAG,
    UPDATE_ISMOBILE_FLAG,
    UPDATE_BANNER_URL,
    UPDATE_EVENT_TITLE,
    UPDATE_EVENT_START_DATE,
    UPDATE_EVENT_END_DATE,
    UPDATE_EVENT_ADDRESS,
    UPDATE_EVENT_LONGITUDE,
    UPDATE_EVENT_LATITUDE,
    UPDATE_EVENT_DESCRIPTION,
    UPDATE_EVENT_PHONE,
    UPDATE_EVENT_WEBSITE,
    UPDATE_EVENT_BUY_NOW,
    UPDATE_EVENT_PROMO_CODE,
    UPDATE_EVENT_RECEIPT_URL,
    UPDATE_EVENT_TRANSACTION_KEY,
    UPDATE_EVENT_TRANSACTION_LOADING,
    UPDATE_EVENT_EXPIRATION_DATE,
    UPDATE_VALID_SELECTION_ADDRESS,
    UPDATE_EVENT_DURATION,
    UPDATE_ERROR_MSG,
} from '../actions/advertise';

const orderInitialState = {
    agreenment: false,
    isMobile: false,
    bannerurl: '',
    title: '',
    startdate: '',
    enddate: '',
    address: '',
    longitude: '',
    latitude: '',
    description: '',
    phone: '',
    website: '',
    buynowurl: '',
    promocode: '',
    receipturl: '',
    transactionkey: null,
    transactionloading: false,
    isValidAddressSelection: false,
    expirationdate:'',
    duration:'',
    errormsg:''
}

const order = (state = orderInitialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case UPDATE_AGREEMENT_FLAG:
            {
                return {
                    ...state,
                    agreenment: payload,
                }
            }
        case UPDATE_ISMOBILE_FLAG:
            {
                return {
                    ...state,
                    isMobile: payload,
                }
            }
        case UPDATE_BANNER_URL:
            {
                return {
                    ...state,
                    bannerurl: payload,
                }
            }
        case UPDATE_EVENT_TITLE:
            {
                return {
                    ...state,
                    title: payload,
                }
            }
        case UPDATE_EVENT_START_DATE:
            {
                return {
                    ...state,
                    startdate: payload,
                }
            }
        case UPDATE_EVENT_END_DATE:
            {
                return {
                    ...state,
                    enddate: payload,
                }
            }
        case UPDATE_EVENT_ADDRESS:
            {
                return {
                    ...state,
                    address: payload,
                }
            }
        case UPDATE_EVENT_LONGITUDE:
            {
                return {
                    ...state,
                    longitude: payload,
                }
            }
        case UPDATE_EVENT_LATITUDE:
            {
                return {
                    ...state,
                    latitude: payload,
                }
            }
        case UPDATE_EVENT_DESCRIPTION:
            {
                return {
                    ...state,
                    description: payload,
                }
            }
        case UPDATE_EVENT_PHONE:
            {
                return {
                    ...state,
                    phone: payload,
                }
            }
        case UPDATE_EVENT_WEBSITE:
            {
                return {
                    ...state,
                    website: payload,
                }
            }
        case UPDATE_EVENT_BUY_NOW:
            {
                return {
                    ...state,
                    buynowurl: payload,
                }
            }
        case UPDATE_EVENT_PROMO_CODE:
            {
                return {
                    ...state,
                    promocode: payload,
                }
            }
        case UPDATE_EVENT_RECEIPT_URL:
            {
                return {
                    ...state,
                    receipturl: payload,
                }
            }
        case UPDATE_EVENT_TRANSACTION_KEY:
            {
                return {
                    ...state,
                    transactionkey: payload,
                }
            }
        case UPDATE_EVENT_TRANSACTION_LOADING:
            {
                return {
                    ...state,
                    transactionloading: payload,
                }
            }
            case UPDATE_EVENT_DURATION:
            {
                return {
                    ...state,
                    duration: payload,
                }
            }
            case UPDATE_EVENT_EXPIRATION_DATE:
            {
                return {
                    ...state,
                    expirationdate: payload,
                }
            }
            case UPDATE_VALID_SELECTION_ADDRESS:
            {
                return {
                    ...state,
                    isValidAddressSelection: payload,
                }
            }
            case UPDATE_ERROR_MSG:
            {
                return {
                    ...state,
                    errormsg: payload,
                }
            }
            
        default:
            {
                return state;
            }
    }
}

const advertise = combineReducers({
    order,
});

export default advertise;