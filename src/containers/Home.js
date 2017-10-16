import React from 'react'
import { Link } from 'react-router-dom'
import { Howl } from 'howler'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import exampSound from '../../sounds/church-bell-large.mp3'
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
      position => this.updatePosition(position),
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

class LoopingSound extends React.Component {
  constructor (props) {
    super(props)
    this.sound = null
    this.state = {gapTimeMillis: props.initialGapTime || 0}
  }

  componentWillMount () {
    console.log({exampSound})
    const sound = new Howl({
      src: [exampSound]
    })
    sound.on('load', () => console.log('loaded sound'))
    sound.on('play', () => console.log('play sound'))
    sound.on('stop', () => console.log('stop sound'))
    sound.on('end', () => console.log('end sound'))
    this.sound = sound
  }

  updateVolume ({rate, volume, fadeTimeMillis = 100}) {
    fadeTimeMillis
      ? this.sound.fade(this.sound.volume(), volume, fadeTimeMillis)
      : this.sound.volume(volume)
    rate !== undefined &&
      this.sound.rate(rate)
  }

  playWithLoopGap () {
    const duration = this.sound.duration()
    this.sound.loop(false)
    this.sound.on(
      'end', () => setTimeout(() => this.sound.play(), duration + this.state.gapTimeMillis)
    )
    !this.sound.playing() && this.sound.play()
  }

  render () {
    return (
      <div>
        <button onClick={e => this.playWithLoopGap(500)}>Play Sound</button>
        <button onClick={e => {
          this.sound.off('end')
        }}>
          Stop Looping
        </button>
        <cite>Sound effects obtained from https://www.zapsplat.com</cite>
      </div>
    )
  }
}

class Map extends React.Component {
  constructor (props) {
    super(props)
    this.state = { initialPosition: {} }
  }

  componentWillMount () {
    navigator.geolocation.getCurrentPosition(
      pos => {
        console.log('map initial pos', pos)
        this.setState({
          initialPosition: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          }
        })
      },
      err => console.error('Map initial position error:', err)
    )
  }

  render () {
    const { initialPosition } = this.state
    if (!('lat' in initialPosition)) {
      return <div>Getting initial position for map...</div>
    }

    const MyMap = (
      withScriptjs(withGoogleMap((props) =>
        <GoogleMap
          defaultZoom={16}
          defaultCenter={initialPosition}
        >
          <Marker position={initialPosition} />
        </GoogleMap>
      ))
    )

    return <MyMap
      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}`}
      loadingElement={<div style={{height: '400px'}}>Loading!</div>}
      containerElement={<div style={{ height: '400px', width: '100%', backgroundColor: 'pink' }} />}
      mapElement={<div style={{ height: '100%' }} />}
    />
  }
}

const Home = () => (
  <div>
    <LoopingSound initialGapTime={1000} />
    🗺<GeolocationExamp />
    <CameraStream />
    <Map />
    <p>You can go to the <Link to='/about'>About</Link> page</p>

  </div>
)

export default Home
