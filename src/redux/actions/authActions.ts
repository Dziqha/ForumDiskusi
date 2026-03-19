/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dispatch } from 'redux';
import { ActionType } from './actionTypes';
import { User } from '@/src/types';
import { api } from '@/src/lib/api';

export const setAuthUserActionCreator = (authUser: User) => ({
  type: ActionType.SET_AUTH_USER,
  payload: { authUser },
});

export const unsetAuthUserActionCreator = () => ({
  type: ActionType.UNSET_AUTH_USER,
});

export const setLoadingActionCreator = (isLoading: boolean) => ({
  type: ActionType.SET_LOADING,
  payload: { isLoading },
});

export const asyncRegisterUser = ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  return async (dispatch: Dispatch) => {
    dispatch(setLoadingActionCreator(true));
    try {
      await api.register(name, email, password);
      alert('Registrasi berhasil! Silakan login.');
    } catch (error: any) {
      alert(error.message);
    }
    dispatch(setLoadingActionCreator(false));
  };
};

export const asyncPreloadProcess = () => {
  return async (dispatch: Dispatch) => {
    dispatch(setLoadingActionCreator(true));
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }

      const user = await api.getOwnProfile(token);
      dispatch(setAuthUserActionCreator(user));
      return user;
    } catch (error) {
      dispatch(unsetAuthUserActionCreator());
      localStorage.removeItem('token');
      return null;
    } finally {
      dispatch(setLoadingActionCreator(false));
    }
  };
};

export const asyncSetAuthUser = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return async (dispatch: Dispatch) => {
    dispatch(setLoadingActionCreator(true));
    try {
      const token = await api.login(email, password);
      localStorage.setItem('token', token);
      const user = await api.getOwnProfile(token);
      dispatch(setAuthUserActionCreator(user));
      return user;
    } catch (error: any) {
      alert(error.message);
      throw error;
    } finally {
      dispatch(setLoadingActionCreator(false));
    }
  };
};

export const asyncUnsetAuthUser = () => {
  return (dispatch: Dispatch) => {
    localStorage.removeItem('token');
    dispatch(unsetAuthUserActionCreator());
    return true;
  };
};
