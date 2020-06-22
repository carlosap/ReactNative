export const UPDATE_ISMOBILE_FLAG = 'UPDATE_ISMOBILE_FLAG';
export const UPDATE_AGREEMENT_FLAG = 'UPDATE_AGREEMENT_FLAG';
export const UPDATE_BANNER_URL = 'UPDATE_BANNER_URL';
export const UPDATE_EVENT_TITLE = 'UPDATE_EVENT_TITLE';
export const UPDATE_EVENT_START_DATE = 'UPDATE_EVENT_START_DATE';
export const UPDATE_EVENT_END_DATE = 'UPDATE_EVENT_END_DATE';
export const UPDATE_EVENT_ADDRESS = 'UPDATE_EVENT_ADDRESS';
export const UPDATE_EVENT_LONGITUDE = 'UPDATE_EVENT_LONGITUDE';
export const UPDATE_EVENT_LATITUDE = 'UPDATE_EVENT_LATITUDE';
export const UPDATE_EVENT_DESCRIPTION = 'UPDATE_EVENT_DESCRIPTION';
export const UPDATE_EVENT_PHONE = 'UPDATE_EVENT_PHONE';
export const UPDATE_EVENT_WEBSITE = 'UPDATE_EVENT_WEBSITE';
export const UPDATE_EVENT_BUY_NOW = 'UPDATE_EVENT_BUY_NOW';
export const UPDATE_EVENT_PROMO_CODE = 'UPDATE_EVENT_PROMO_CODE';
export const UPDATE_EVENT_RECEIPT_URL = 'UPDATE_EVENT_RECEIPT_URL';
export const UPDATE_EVENT_TRANSACTION_KEY = 'UPDATE_EVENT_TRANSACTION_KEY';
export const UPDATE_EVENT_TRANSACTION_LOADING = 'UPDATE_EVENT_TRANSACTION_LOADING';
export const UPDATE_EVENT_EXPIRATION_DATE = 'UPDATE_EVENT_EXPIRATION_DATE';
export const UPDATE_EVENT_DURATION = 'UPDATE_EVENT_DURATION';
export const UPDATE_VALID_SELECTION_ADDRESS = 'UPDATE_VALID_SELECTION_ADDRESS';
export const UPDATE_ERROR_MSG = 'UPDATE_ERROR_MSG';

export function updateIsMobile(ismobile) {
    return {
        type : UPDATE_ISMOBILE_FLAG,
        payload: ismobile,
    }
}

export function updateAgreement(agreement) {
    return {
        type: UPDATE_AGREEMENT_FLAG,
        payload: agreement,
    }
}

export function updateBannerUrl(url) {
    return {
        type: UPDATE_BANNER_URL,
        payload: url,
    }
}

export function updateEventTitle(title) {
    return {
        type: UPDATE_EVENT_TITLE,
        payload: title,
    }
}

export function updateEventStartDate(date) {
    return {
        type: UPDATE_EVENT_START_DATE,
        payload: date,
    }
}

export function updateEventEndDate(date) {
    return {
        type: UPDATE_EVENT_END_DATE,
        payload: date,
    }
}


export function updateEventAddress(address) {
    return {
        type: UPDATE_EVENT_ADDRESS,
        payload: address,
    }
}

export function updateEventLongitude(longitude) {
    return {
        type: UPDATE_EVENT_LONGITUDE,
        payload: longitude,
    }
}

export function updateEventLatitude(latitude) {
    return {
        type: UPDATE_EVENT_LATITUDE,
        payload: latitude,
    }
}

export function updateEventDescription(description) {
    return {
        type: UPDATE_EVENT_DESCRIPTION,
        payload: description,
    }
}

export function updateEventPhone(phone) {
    return {
        type: UPDATE_EVENT_PHONE,
        payload: phone,
    }
}

export function updateEventWebSite(website) {
    return {
        type: UPDATE_EVENT_WEBSITE,
        payload: website,
    }
}

export function updateEventBuyNow(buynowurl) {
    return {
        type: UPDATE_EVENT_BUY_NOW,
        payload: buynowurl,
    }
}

export function updateEventPromoCode(code) {
    return {
        type: UPDATE_EVENT_PROMO_CODE,
        payload: code,
    }
}

export function updateEventReceiptUrl(url) {
    return {
        type: UPDATE_EVENT_RECEIPT_URL,
        payload: url,
    }
}

export function updateEventTransactionKey(key) {
    return {
        type: UPDATE_EVENT_TRANSACTION_KEY,
        payload: key,
    }
}


export function updateEventTransactionLoading(isloading) {
    return {
        type: UPDATE_EVENT_TRANSACTION_LOADING,
        payload: isloading,
    }
}

export function updateEventExpirationDate(expirationdate) {
    return {
        type: UPDATE_EVENT_EXPIRATION_DATE,
        payload: expirationdate,
    }
}

export function updateEventDuration(duration) {
    return {
        type: UPDATE_EVENT_DURATION,
        payload: duration,
    }
}

export function updateValidSelectedAddress(isValidAddressSelection) {
    return {
        type: UPDATE_VALID_SELECTION_ADDRESS,
        payload: isValidAddressSelection,
    }
}


export function updateErrorMsg(errormsg) {
    return {
        type: UPDATE_ERROR_MSG,
        payload: errormsg,
    }
}