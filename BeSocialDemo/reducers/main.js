import { combineReducers } from 'redux';
import {
    UPDATE_SCREEN,
    UPDATE_CONTACTS,
    UPDATE_USERS,
    UPDATE_CURRENT_USER,
    UPDATE_EVENTS,
    UPDATE_CURRENT_NOTIFICATIONS,
    UPDATE_CURRENT_NOTIFICATIONS_COUNT,
    UPDATE_ACTIVE_STEP,
    UPDATE_NEXT_STEP,
    UPDATE_BACK_STEP,
    UPDATE_APP_CONST_SETTINGS,
    UPDATE_APP_LOADING_PROGRESS,
    UPDATE_APP_NETINFO_CONNECTED,
    UPDATE_APP_NETINFO_TYPE,
    UPDATE_APP_STATE,
    UPDATE_LOCATION_PERMISSION,
    UPDATE_LOCATION_BACKGROUND,
} from '../actions/main';


export const initialLoadingProgressState = {
    loadingflag : false
}

export const initialAppState = {
    isForeground : true
}

export const initialConstSettingsState = {
    settings:{}
}

const initialState = {
    screen: 'Login'
}

export const initialUsersState = {
    entities: [],
    users: [],
    events: [],
    currentuser: {},
    currentnotifications: [],
    currentnotificationscount: 0,
};

const stepperInitialState = {
    activeStep: 0,

}

const netInfoInitialState = {
    type: null,
    isConnected: null,

}

const initialLocationPermissionState = {
    type: null,
    LocationPermission: null,

}

const initialLocationBackGroundState = {
    enableLocation: true,
    lastupdate: 0
}

const loadingprogress = (state = initialLoadingProgressState, action) => {
    const { type, payload } = action;
   
    switch (type) {

        case UPDATE_APP_LOADING_PROGRESS:
            {
                return {
                    ...state,
                    loadingflag: payload,
                }
            }

        default:
            {
                return state;
            }
    }
}

const appState = (state = initialAppState, action) => {
    const { type, payload } = action;
   
    switch (type) {

        case UPDATE_APP_STATE:
            {
                return {
                    ...state,
                    isForeground: payload,
                }
            }

        default:
            {
                return state;
            }
    }
}

const locationPermissionState = (state = initialLocationPermissionState, action) => {
    const { type, payload } = action;
   
    switch (type) {

        case UPDATE_LOCATION_PERMISSION:
            {
                return {
                    ...state,
                    LocationPermission : payload,
                }
            }

        default:
            {
                return state;
            }
    }
}

const backGroundTrigger = (state = initialLocationBackGroundState, action) => {
    const { type, payload } = action;
   
    switch (type) {

        case UPDATE_LOCATION_BACKGROUND:
            {
                return {
                    ...state,
                    lastupdate : payload,
                }
            }

        default:
            {
                return state;
            }
    }
}

const constsettings = (state = initialConstSettingsState, action) => {
    const { type, payload } = action;
   
    switch (type) {

        case UPDATE_APP_CONST_SETTINGS:
            {
                return {
                    ...state,
                    settings: payload,
                }
            }

        default:
            {
                return state;
            }
    }
}

const navigation = (state = initialState, action) => {
    let retVal;
    const { type, payload } = action;

    switch (type) {

        case UPDATE_SCREEN:
            retVal = { ...state };
            retVal.screen = payload;
            break;

        default:
            retVal = state;
            break;
    }
    return retVal;
}

const netinfo = (state = netInfoInitialState, action) => {
    const { type, payload } = action;

    switch (type) {

        case UPDATE_APP_NETINFO_CONNECTED:
            {
                return {
                    ...state,
                    isConnected: payload,
                }
            }
        case UPDATE_APP_NETINFO_TYPE:
            {
                return {
                    ...state,
                    type: payload,
                }
            }
        default:
            {
                return state;
            }
    }
}

const stepper = (state = stepperInitialState, action) => {
    const { type, payload } = action;

    switch (type) {

        case UPDATE_ACTIVE_STEP:
            {
                return {
                    ...state,
                    activeStep: payload,
                }
            }
        case UPDATE_NEXT_STEP:
            {
                const currentStep = state.activeStep + 1;
                return {
                    ...state,
                    activeStep: currentStep,
                }
            }
        case UPDATE_BACK_STEP:
            {

                const currentStep = (state.activeStep <= 0) ? 0 : state.activeStep - 1;
                return {
                    ...state,
                    activeStep: currentStep,
                }
            }
        default:
            {
                return state;
            }
    }
};

const contacts = (state = initialUsersState, action) => {
    const { type, payload } = action;

    switch (type) {
        case UPDATE_CONTACTS:
            {
                return {
                    ...state,
                    entities: payload,
                }
            }
        case UPDATE_USERS:
            {
                return {
                    ...state,
                    users: payload,
                }
            }
        case UPDATE_EVENTS:
            {
                return {
                    ...state,
                    events: payload,
                }
            }
        case UPDATE_CURRENT_USER:
            {
                return {
                    ...state,
                    currentuser: payload,
                }
            }
        case UPDATE_CURRENT_NOTIFICATIONS:
            {
                return {
                    ...state,
                    currentnotifications: payload,
                }
            }
        case UPDATE_CURRENT_NOTIFICATIONS_COUNT:
            {
                return {
                    ...state,
                    currentnotificationscount: payload,
                }
            }
        default:
            {
                return state;
            }
    }
};

const main = combineReducers({
    navigation,
    contacts,
    stepper,
    constsettings,
    loadingprogress,
    netinfo,
    appState,
    locationPermissionState,
    backGroundTrigger,
});
export default main;