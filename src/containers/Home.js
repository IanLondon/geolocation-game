import React from 'react'
import { Link } from 'react-router-dom'

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
      selectedVideoDevice: null
    }
  }

  componentWillMount () {
    this.updateVideoDevices()
  }

  selectNextVideoDevice () {
    const { videoDevices, selectedVideoDevice } = this.state
    // Go to next, looping back
    this.setState({
      selectedVideoDevice: videoDevices[(videoDevices.findIndex(d => d.deviceId === selectedVideoDevice) + 1) % videoDevices.length]
    }, this.updateVideoStream)
  }

  updateVideoDevices () {
    navigator.mediaDevices.enumerateDevices().then(deviceInfoArray => {
      const videoDevices = deviceInfoArray.filter(device => device.kind === 'videoinput')
      return this.setState({
        audioDevices: deviceInfoArray.filter(device => device.kind === 'audioinput'),
        videoDevices,
        selectedVideoDevice: videoDevices[0]
      }, this.updateVideoStream)
    })
  }

  updateVideoStream () {
    const { selectedVideoDevice } = this.state
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: (selectedVideoDevice)
      ? true
      : {
        optional: [{ sourceId: this.state.videoDevices.map(d => d.deviceId)[1] }]
      }
    })
      .then(stream => {
        // Update the <video> el's stream
        this.videoElement.srcObject = stream
      })
      .catch(err => {
        if (err.name === 'PermissionDeniedError') {
          window.alert('Permission denied, do something...')
        } else {
          window.alert('Unhanded Error: "' + err.name + '" ' + err.message)
          throw err
        }
      })
  }

  render () {
    return (
      <div>
        <button onClick={e => this.selectNextVideoDevice}>Next Video Device</button>
        <img style={{position: 'absolute'}} src='https://i.stack.imgur.com/JgHWH.gif' />
        <video ref={ref => { this.videoElement = ref }} muted autoPlay />
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
