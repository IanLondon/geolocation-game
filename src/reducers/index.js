import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions'

// REDUCERS

const permissions = handleActions({
  REPORT_CAMERA_PERMISSIONS: (state, action) => ({...state, cameraPermission: action.payload}),
  REPORT_POSITION: (state, action) => state.haveInitialLocation
    ? state // ignore future position updates
    : ({...state, haveInitialLocation: !!(action.payload.lat && action.payload.lng)})
  // TODO LATER: sounds loaded
}, {
  haveInitialLocation: undefined,
  cameraPermission: undefined,
  soundsLoaded: undefined
})

const rootReducer = combineReducers({
  permissions
})

// SELECTORS

export const selectors = {
  permissions: state => state.default.permissions
}

export default rootReducer
