import React from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import PropTypes from 'prop-types'

import { selectors } from '../reducers'
import styles from './PermissionsSplash.css'

export const PermissionsSplash = ({soundsLoaded, haveInitialLocation, cameraPermission}) => (
  <div className={styles.permissionsSplash}>
    {[
      [haveInitialLocation, 'Initial Geolocation'],
      [cameraPermission, 'Camera Permission'],
      [soundsLoaded, 'Sounds Loaded']
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
  </div>
)

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
