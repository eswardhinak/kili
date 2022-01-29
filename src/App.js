import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ToastContainer } from 'react-toastify'

import {
  fetchLogin,
  AppMode,
} 
from './actions'
import { sendAmplitudeData } from './services/amplitude'

import UnplugSignUp from './views/UnplugSignUp'
import FlowList from './views/FlowList'

import OnboardingTour from './components/OnboardingTour'

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.finishLoading = this.finishLoading.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(fetchLogin(this.props.mode))
  }

  finishLoading(windowCount, tabCount, currentFlowId, display) {
    sendAmplitudeData('App Open', {
      'Window Count': windowCount !== undefined ? windowCount : 'No Tab Permission',
      'Tab Count': tabCount !== undefined ? tabCount : 'No Tab Permission',
      'Current Flow': currentFlowId !== undefined ? currentFlowId : 'None',
      'Window Width': window.innerWidth,
      'Window Height': window.innerHeight,
      'Display': display,
    })
  }

  render() {
    const mode = this.props.mode
    if (mode === AppMode.LOADING) {
      return null
    }

    return (
      <div style={{ height: '100%' }}>
        {mode === AppMode.HOME &&
          <OnboardingTour />
        }
        {mode === AppMode.SIGN_UP &&
          <div className="product-container">
            <UnplugSignUp />
          </div>
        }
        {mode === AppMode.HOME &&
          <FlowList finishLoading={this.finishLoading}/>
        }
        <ToastContainer limit={1} />
      </div>
    )
  }
}

App.propTypes = {
  mode: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired, 
}

function mapStateToProps(state) {
  const { appConfig } = state
  const { mode } = appConfig ||
  {
    mode: AppMode.LOADING,
  }
  return {
    mode,
  }
}

export default connect(mapStateToProps)(App)