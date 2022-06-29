// Imports
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import { createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'setup/messageSlice';

// App imports
import { URL_API } from 'setup/config/env'

// App Imports
import logoutUnsetUserLocalStorage from './logoutUnsetUserLocalStorage'
import loginSetUserLocalStorage from './loginSetUserLocalStorage'

// Initial State

// Authorize
export function authorize(query) {
  return axios.post(URL_API, {
    operation: 'userAuthorize',
    params: query,
  })
}

export function profile() {
  return axios.post(URL_API, {
    operation: 'userProfile',
  })
}
// export const submitLogin =
//   ({ email, password }) =>
//     async (dispatch, getState) => {
//       // const { userName, userSurname } = getState().auth.user;
//       return jwtService
//         .signInWithEmailAndPassword(email, password)
//         .then((user) => {
//           dispatch(setUserData(user));
//           dispatch(
//             showMessage({
//               message: `Hello ${email}!`,
//               autoHideDuration: 2000,
//               variant: 'success',
//             })
//           );

//           return dispatch(loginSuccess());
//         })
//         .catch((errors) => {
//           dispatch(
//             showMessage({
//               anchorOrigin: {
//                 vertical: 'top',
//                 horizontal: 'center',
//               },
//               message: `${errors === '401' ? 'Incorrect Credential or Password!' : errors}`,
//               variant: 'error',
//             })
//           );
//           // if (errors.errors !== '401') {
//           //   return dispatch(loginError(errors));
//           // }
//           return null;
//         });
//     };

const initialState = {
  isAuthenticated: false,
  user: null,
}

// State
const loginSlice = createSlice({
  name: 'auth/login',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.success = true;
      state.errors = [];
    },
    loginError: (state, action) => {
      state.success = false;
      state.errors = action.payload;
    },
    setUserData: (state, action) => {
      state.isAuthenticated = !isEmpty(action.payload);
      state.user = action.payload;
    },
    logout: (state, action) => {
      logoutUnsetUserLocalStorage()
      delete axios.defaults.headers.common['Authorization']
      state = initialState;
      // Clear cache
      for (let key in localStorage) {
        if (key.indexOf('CACHE.KEY/') !== -1) {
          window.localStorage.removeItem(key)
        }
      }

    }
  }
});

// Export Auth Slice
export const { loginSuccess, loginError, setUserData, logout } = loginSlice.actions;

export default loginSlice.reducer;