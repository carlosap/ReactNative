import { combineReducers } from 'redux';
import {
  ENABLE_ONBOARDED,
  DISABLE_ONBOARDED,
} from '../actions/main';

const initialState = {
  onboarded: false
}

const navigation = (state = initialState, action) => {
  let retVal;
  const {type, payload} = action;

  switch (type) {
    case ENABLE_ONBOARDED:
      retVal = { ...state };
      retVal.onboarded = true;
      break;

    case DISABLE_ONBOARDED:
      retVal = { ...state };
      retVal.onboarded = false;
      break;
    
    default:
      retVal = state;
      break;
  }
  return retVal;
}

const main = combineReducers({
  navigation,
});
export default main;