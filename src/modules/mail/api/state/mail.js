// Imports
import isEmpty from 'lodash/isEmpty'

// App Imports
import { SET_CHECK, SET_INIT } from '../actions/types'

// Mail (user)

// Initial State

export const initialState = {
  check: [],
}

// State
export default function mail(state = initialState, action) {
  switch (action.type) {
    case SET_CHECK:
      return {
        // ...state,
        check: action.payload,
      }

    case SET_INIT:
      return initialState

    default:
      return state
  }
}
