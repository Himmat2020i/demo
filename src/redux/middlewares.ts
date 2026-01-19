import {CurriedGetDefaultMiddleware} from '@reduxjs/toolkit/dist/getDefaultMiddleware';
import authApi from '../services/authService';
import {AnyAction, Dispatch, Middleware} from 'redux';
import appApi from '../services/appServices';
import addressSearch from '../services/addressSearch';

export const getMiddleware = (
  getDefaultMiddleware: CurriedGetDefaultMiddleware,
) => {
  const devMiddlewares: Middleware<any, any, Dispatch<AnyAction>>[] = [];
  if (__DEV__) {
    // devMiddlewares.push(logger);
  }
  return getDefaultMiddleware({
    serializableCheck: false,
  }).concat(
    ...devMiddlewares,
    authApi.middleware,
    appApi.middleware,
    addressSearch.middleware,
  );
};
