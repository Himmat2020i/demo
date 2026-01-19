import {combineReducers} from 'redux';
import authApi from '../services/authService';
import {clearAll} from '../helpers/localstorage';
import authSlice from './auth/authSlice';
import appSlice from './app/appSlice';
import appApi from '../services/appServices';
import {LOGOUT} from './auth/authAction';
import addressSearch from '../services/addressSearch';

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [appApi.reducerPath]: appApi.reducer,
  [addressSearch.reducerPath]: addressSearch.reducer,
  auths: authSlice.reducer,
  apps: appSlice.reducer,
  address: addressSearch.reducer,
});

export default (state: any, action: any) => {
  if (action.type === LOGOUT) {
    state = undefined;
    clearAll();
  }
  return rootReducer(state, action);
};
