import React from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import PropTypes from 'prop-types'

import { selectors } from '../reducers'
import styles from './PermissionsSplash.css'

class PermissionsSplash extends React.Component {
  constructor (props) {
    super(props)
    this.state = { showNext: false }
  }

  render () {
    const { soundsLoaded, haveInitialLocation, cameraPermission, children } = this.props

    if (this.state.showNext) {
      return <div>{children}</div>
    }

    return (
      <div className={styles.permissionsSplash}>
        {[
          [haveInitialLocation, 'Initial Geolocation'],
          [cameraPermission, 'Camera Permission'],
          [soundsLoaded, 'Sounds Loaded (TODO)']
        ].map(([isValid, labelText], i) =>
          <section key={i}>
            <div className={styles.labelText}>{labelText}</div>
            <div className={cx(
              styles.status, {
                [styles.valid]: isValid === true,
                [styles.invalid]: isValid === false
              }
            )}>
              {
                isValid === true
                ? '✓'
                : isValid === false ? '🗙' : '...'
              }
            </div>
          </section>
        )}
        {[haveInitialLocation, cameraPermission].every(x => x) && /* TODO: soundsLoaded */
          <button onClick={() => this.setState({showNext: true})}>Next</button>
        }
      </div>
    )
  }
}

PermissionsSplash.propTypes = {
  soundsLoaded: PropTypes.bool,
  haveInitialLocation: PropTypes.bool,
  cameraPermission: PropTypes.bool
}

export default connect(
  state => ({
    ...selectors.permissions(state)
  })
)(PermissionsSplash)
