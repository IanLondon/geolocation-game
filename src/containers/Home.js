import React from 'react'
import { Link } from 'react-router-dom'
// require('webrtc-adapter') // webrtc adapter.js

class GeolocationExamp extends React.Component {
  constructor (props) {
    super(props)
    this.state = { coords: null, timestamp: null }
  }

  updatePosition = (position) => {
    // A `Coordinates` object can't be unpacked, do it explicitly:
    this.setState({
      timestamp: position.timestamp,
      coords: {
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        speed: position.coords.speed
      }
    })
  }

  componentWillMount () {
    this.positionWatchId = navigator.geolocation.watchPosition(
      position => {
        this.updatePosition(position)
        console.log(position)
      },
      err => console.error('watchPosition error:', err))
  }

  componentWillUnmount () {
    navigator.geolocation.clearWatch(this.positionWatchId)
  }

  render () {
    return (
      <div>{JSON.stringify(this.state)}</div>
    )
  }
}

class CameraStream extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      audioDevices: null,
      videoDevices: null,
      cameraFacingMode: 'environment'
    }
    this.videoStream = null
    this.videoElement = null
  }

  componentWillMount () {
    // Get permissions for all video devices (no constraints)
    this.updateVideoDevices()
  }

  componentWillUnmount () {
    this.stopTracks()
  }

  stopTracks () {
    this.videoStream && this.videoStream.getTracks().forEach(track => track.stop())
  }

  toggleCameraFacingMode () {
    this.setState({
      cameraFacingMode: (this.state.cameraFacingMode === 'environment')
        ? 'user'
        : 'environment'
    }, this.updateVideoDevices)
  }

  updateVideoDevices () {
    navigator.mediaDevices.enumerateDevices().then(deviceInfoArray => {
      return this.setState({
        audioDevices: deviceInfoArray.filter(device => device.kind === 'audioinput'),
        videoDevices: deviceInfoArray.filter(device => device.kind === 'videoinput')
      }, this.updateVideoStream)
    })
  }

  updateVideoStream () {
    const { cameraFacingMode, videoDevices } = this.state

    // First, stop all tracks on videoStream
    this.stopTracks()

    const videoDeviceId = videoDevices[(cameraFacingMode === 'environment' && videoDevices.length > 1) ? 1 : 0].deviceId

    const options = {
      audio: false,
      video: { optional: [{sourceId: videoDeviceId}] }
    }

    navigator.mediaDevices.getUserMedia(options)
      .then(stream => {
        // Update the <video> el's stream
        this.videoStream = stream
        this.videoElement.srcObject = stream
      })
      .catch(err => {
        if (err.name === 'PermissionDeniedError') {
          window.alert('Permission denied, do something...')
        } else {
          window.alert('Unhanded error while updating video stream: "' + err.name + '" ' + err.message)
          throw err
        }
      })
  }

  render () {
    return (
      <div>
        <button onClick={e => this.toggleCameraFacingMode()}>Next Video Device!</button>
        <img style={{position: 'absolute'}} src='https://i.stack.imgur.com/JgHWH.gif' />
        <video ref={ref => { this.videoElement = ref }} />
        <p>
          Devices: {JSON.stringify(this.state)}
        </p>
      </div>
    )
  }
}

const Home = () => (
  <div>
    🗺<GeolocationExamp />
    <CameraStream />
    <p>You can go to the <Link to='/about'>About</Link> page</p>

  </div>
)

export default Home
