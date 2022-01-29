import { combineReducers } from 'redux'

import login from './login'
import logging from './logging'
import appConfig from './appConfig'
import journal from './journal'

export default combineReducers({
  login,
  logging,
  appConfig,
  journal,
})
