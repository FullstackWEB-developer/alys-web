// Imports
import { configureStore, combineReducers } from '@reduxjs/toolkit';
// import createReducer from './rootReducer';
// App imports
import message from './messageSlice'
import auth from '../modules/user/api/loginSlice'
import mail from '../modules/mail/api/state'

// Root Reducer
const createReducer = (asyncReducers) => (state, action) => {
  const combinedReducer = combineReducers({
    message,
    auth,
    ...mail
  });

  /*
  Reset the redux store when user logged out
   */
  if (action.type === 'auth/user/userLoggedOut') {
    state = undefined;
  }

  return combinedReducer(state, action);
};

const middlewares = [];

// if (process.env.NODE_ENV === 'development') {
//   const { createLogger } = require(`redux-logger`);
//   const logger = createLogger({ collapsed: (getState, action, logEntry) => !logEntry.error });

//   middlewares.push(logger);
// }

const store = configureStore({
  reducer: createReducer(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(middlewares),
  devTools: process.env.NODE_ENV === 'development',
});

store.asyncReducers = {};

export default store;