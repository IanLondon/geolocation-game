import { createActions } from 'redux-actions'

export const {
  reportCameraPermissions,
  reportPosition
} = createActions(
  'REPORT_CAMERA_PERMISSIONS',
  'REPORT_POSITION'
)
