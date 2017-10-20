import React from 'react'
import { connect } from 'react-redux'

import { reportPosition, reportCameraPermissions } from '../actions'

export class PermissionsRequester extends React.Component {
  constructor (props) {
    super(props)

    const { reportPosition, reportCameraPermissions } = props

    // TODO LATER use props to toggle permission requests

    // Geolocation
    navigator.geolocation.getCurrentPosition(
      pos => {
        reportPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        })
      },
      err => reportPosition(err)
    )

    // Camera permission
    navigator.mediaDevices.getUserMedia({audio: false, video: true})
      .then(_ => reportCameraPermissions(true))
      .catch(reportCameraPermissions)
  }

  render () {
    return null
  }
}

export default connect(undefined, {
  reportPosition,
  reportCameraPermissions
})(PermissionsRequester)
