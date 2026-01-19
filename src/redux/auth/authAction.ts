import {createAction} from '@reduxjs/toolkit';

export const LOGOUT = 'auth/logout';

export const logoutAction = createAction(LOGOUT);
