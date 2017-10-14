import React from 'react'
import { Link } from 'react-router-dom'

class CameraStream extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      audioDevices: null,
      videoDevices: null
    }
  }

  componentWillMount () {
    this.updateVideoDevices()
  }

  updateVideoDevices () {
    navigator.mediaDevices.enumerateDevices().then(deviceInfoArray =>
      this.setState({
        audioDevices: deviceInfoArray.filter(device => device.kind === 'audioinput'),
        videoDevices: deviceInfoArray.filter(device => device.kind === 'videoinput')
      }, this.updateVideoStream)
    )
  }

  updateVideoStream () {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
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
    <h1>TODO: need https to test cam on phone!</h1>
    <h1>TODO: allow rotating through cameras on phone using device id idxs</h1>
    <p>You can go to the <Link to='/about'>About</Link> page</p>
    <CameraStream />

  </div>
)

export default Home
