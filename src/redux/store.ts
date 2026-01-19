import {configureStore} from '@reduxjs/toolkit';
import appReducer from './rootReducer';
import {setupListeners} from '@reduxjs/toolkit/query';
import {getMiddleware} from './middlewares';

const store = configureStore({
  reducer: appReducer,
  middleware: getMiddleware,
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
