import { combineReducers, createStore } from "redux"

// actions.js
export const loginUser = (user) => ({
  type: "LOGIN",
  user,
})

export const logoffUser = () => ({
  type: "LOGOFF",
})

// reducers.js
const initialState = {
  user: null,
}
export const logging = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.user
      }
    case "LOGOFF":
      return {
        ...state,
        user: null
      }
    default:
      return state
  }
}

export const reducers = combineReducers({
  logging,
})

// store.js
export function configureStore(initialState = {}) {
  const store = createStore(reducers, initialState)
  return store
}

export const store = configureStore()
