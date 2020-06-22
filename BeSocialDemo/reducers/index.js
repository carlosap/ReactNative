import { combineReducers } from 'redux';
import main from './main';
import advertise from './advertise';
import product from './product';

const appReducer = combineReducers({
  main,
  advertise,
  product,
});

export default appReducer;