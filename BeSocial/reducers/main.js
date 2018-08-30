import { combineReducers } from 'redux';
import {
  UPDATE_SCREEN,
} from '../actions/main';

const initialState = {
  screen: 'Login'
}

const navigation = (state = initialState, action) => {
  let retVal;
  const {type, payload} = action;

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

const main = combineReducers({
  navigation,
});
export default main;