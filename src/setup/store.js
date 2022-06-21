// Imports
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

// App imports
import user from '../modules/user/api/state'
import mail from '../modules/mail/api/state'

// Root Reducer
const rootReducer = combineReducers({
  ...user,
  ...mail
})

// Store
export const store = createStore(rootReducer, applyMiddleware(thunk))
