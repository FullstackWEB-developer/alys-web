import { createSlice } from '@reduxjs/toolkit';
// import { showMessage } from 'app/store/fuse/messageSlice';
// import firebaseService from 'app/services/firebaseService';
// import jwtService from 'app/auth/jwtService';
import { setUserData } from './userSlice';
// import { createUserSettingsFirebase, setUserData } from './userSlice';

// export const submitRegister =
//   ({ name, surname, password, email }) =>
//   async (dispatch) => {
//     return jwtService
//       .createUser({
//         name,
//         surname,
//         password,
//         email,
//       })
//       .then((user) => {
//         dispatch(setUserData(user));
//         return dispatch(registerSuccess());
//       })
//       .catch((errors) => {
//         return dispatch(registerError(errors));
//       });
//   };

const initialState = {
  success: false,
  errors: [],
};

const registerSlice = createSlice({
  name: 'auth/register',
  initialState,
  reducers: {
    registerSuccess: (state, action) => {
      state.success = true;
      state.errors = [];
    },
    registerError: (state, action) => {
      state.success = false;
      state.errors = action.payload;
    },
  },
  extraReducers: {},
});

export const { registerSuccess, registerError } = registerSlice.actions;

export default registerSlice.reducer;
