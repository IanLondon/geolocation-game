import React from 'react'
import { Link } from 'react-router-dom'

import PermissionsSplash from '../containers/PermissionsSplash.js'
import PermissionsRequester from '../containers/PermissionsRequester.js'

const Home = () => (
  <div>
    <PermissionsRequester />
    <PermissionsSplash />
    <p>You can go to the <Link to='/about'>About</Link> page</p>

  </div>
)

export default Home
