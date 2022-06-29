/* eslint import/no-extraneous-dependencies: off */
import { createSlice } from '@reduxjs/toolkit';
import history from '@history';
import _ from '@lodash';
import { setInitialSettings } from 'app/store/fuse/settingsSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import jwtService from 'app/auth/jwtService';
import { getUser } from 'app/main/user-management/store';

export const setUserData = (user) => async (dispatch, getState) => {
  /*
        You can redirect the logged-in user to a specific route depending on his role
         */
  switch (user.role) {
    case 'Admin':
      history.location.state = {
        redirectUrl: '/users',
      };
      break;

    case 'Treasury':
      history.location.state = {
        redirectUrl: '/contracts',
      };
      break;

    case 'ContractManagement':
      history.location.state = {
        redirectUrl: '/proposals',
      };
      break;

    default:
      history.location.state = {
        redirectUrl: '/estates',
        // redirectUrl: user.redirectUrl, // for example 'apps/academy'
      };
      break;
  }
  // if (user.role === 'Sales') {
  //   history.location.state = {
  //     redirectUrl: '/dashboard/sales',
  //   };
  // } else {
  //   history.location.state = {
  //     redirectUrl: '/estates',
  //     // redirectUrl: user.redirectUrl, // for example 'apps/academy'
  //   };
  // }
  /*
    Set User Settings
     */
  // dispatch(setDefaultSettings(user.data.settings));

  dispatch(setUser(user));
  // dispatch(getUser(user.userID))
  //   .unwrap()
  //   .then((payload) => {
  //     if (payload) {
  //       dispatch(setUser(payload[0]));
  //     }
  //   });
};

export const updateUserSettings = (settings) => async (dispatch, getState) => {
  const oldUser = getState().auth.user;
  const user = _.merge({}, oldUser, { data: { settings } });

  dispatch(updateUserData(user));

  return dispatch(setUserData(user));
};

export const logoutUser = () => async (dispatch, getState) => {
  const { user } = getState().auth;

  history.push({
    pathname: '/',
  });

  jwtService.logout();

  dispatch(setInitialSettings());

  return dispatch(userLoggedOut());
};

export const updateUserData = (user) => async (dispatch, getState) => {
  jwtService
    .updateUserData(user)
    .then(() => {
      dispatch(showMessage({ message: 'User data saved with api' }));
    })
    .catch((error) => {
      dispatch(showMessage({ message: error.message }));
    });
};

const initialState = {
  role: [], // guest
  userID: null,
  // data: {
  //   name: null,
  //   surname: null,
  //   photoURL: '',
  //   email: '',
  // },
};

const userSlice = createSlice({
  name: 'auth/user',
  initialState,
  reducers: {
    setUserID: (state, action) => {
      state.userID = action.payload;
    },
    setUserRole: (state, action) => {
      state.role = action.payload;
    },
    setUser: (state, action) => action.payload,
    userLoggedOut: (state, action) => initialState,
  },
  extraReducers: {},
});

export const { setUser, setUserID, setUserRole, userLoggedOut } = userSlice.actions;

export default userSlice.reducer;
