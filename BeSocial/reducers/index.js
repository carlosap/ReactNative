import { combineReducers } from 'redux';
import main from './main';

const appReducer = combineReducers({
  main,
});

export default appReducer;