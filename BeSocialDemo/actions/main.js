export const UPDATE_SCREEN = 'UPDATE_SCREEN';
export const UPDATE_CONTACTS = 'UPDATE_CONTACTS';
export const UPDATE_USERS = 'UPDATE_USERS';
export const UPDATE_EVENTS = 'UPDATE_EVENTS';
export const UPDATE_APP_CONST_SETTINGS = 'UPDATE_APP_CONST_SETTINGS';
export const UPDATE_CURRENT_USER = 'UPDATE_CURRENT_USER';
export const UPDATE_CURRENT_NOTIFICATIONS = 'UPDATE_CURRENT_NOTIFICATIONS';
export const UPDATE_CURRENT_NOTIFICATIONS_COUNT = 'UPDATE_CURRENT_NOTIFICATIONS_COUNT';
export const UPDATE_ACTIVE_STEP = 'UPDATE_ACTIVE_STEP';
export const UPDATE_NEXT_STEP = 'UPDATE_NEXT_STEP';
export const UPDATE_BACK_STEP = 'UPDATE_BACK_STEP';
export const UPDATE_APP_LOADING_PROGRESS = 'UPDATE_APP_LOADING_PROGRESS';
export const UPDATE_APP_NETINFO_CONNECTED = 'UPDATE_APP_NETINFO_CONNECTED';
export const UPDATE_APP_NETINFO_TYPE = 'UPDATE_APP_NETINFO_TYPE';
export const UPDATE_APP_STATE = 'UPDATE_APP_STATE';
export const UPDATE_LOCATION_PERMISSION ='UPDATE_LOCATION_PERMISSION';
export const UPDATE_LOCATION_BACKGROUND ='UPDATE_LOCATION_BACKGROUND';


export function updateAppLoadingProgress(loadingflag) {
  return {
    type: UPDATE_APP_LOADING_PROGRESS,
    payload: loadingflag,
  }
}

export function updateAppConstSettings(settings) {
  return {
    type: UPDATE_APP_CONST_SETTINGS,
    payload: settings,
  }
}

export function updateScreen(screen) {
  return {
    type: UPDATE_SCREEN,
    payload: screen,
  }
}

export function updateContacts(contacts) {
  return {
    type: UPDATE_CONTACTS,
    payload: contacts,
  };
}

export function updateUsers(users) {
  return {
    type: UPDATE_USERS,
    payload: users,
  };
}

export function updateEvents(events) {
  return {
    type: UPDATE_EVENTS,
    payload: events,
  };
}

export function updateCurrentUser(currentuser) {
  return {
    type: UPDATE_CURRENT_USER,
    payload: currentuser,
  };
}

export function updateCurrentNotifications(currentnotifications) {
  return {
    type: UPDATE_CURRENT_NOTIFICATIONS,
    payload: currentnotifications,
  };
}
export function updateCurrentNotificationsCount(count) {
  return {
    type: UPDATE_CURRENT_NOTIFICATIONS_COUNT,
    payload: count,
  };
}

export function updateActiveStep(activeStep) {
  return {
      type: UPDATE_ACTIVE_STEP,
      payload: activeStep,
  }
}

export function updateNextStep() {
  return {
      type: UPDATE_NEXT_STEP,
  }
}

export function updateBackStep() {
  return {
      type: UPDATE_BACK_STEP,
  }
}

export function updateNetInfoConnected(isconnected) {
  return {
      type: UPDATE_APP_NETINFO_CONNECTED,
      payload: isconnected,
  }
}

export function updateNetInfoType(type) {
  return {
      type: UPDATE_APP_NETINFO_TYPE,
      payload: type,
  }
}

export function updateAppState(type) {
  return {
      type: UPDATE_APP_STATE,
      payload: type,
  }
}
export function updateLocationPermission(type) {
  return {
      type:UPDATE_LOCATION_PERMISSION,
      payload: type,  
  }
}
export function updateLocationBackGround(lastupdate) {
  return {
      type:UPDATE_LOCATION_BACKGROUND,
      payload: lastupdate,  
  }
}