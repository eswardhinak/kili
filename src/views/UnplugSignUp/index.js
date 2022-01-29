import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { completeSignUp } from '../../actions'

import { sendAmplitudeData } from '../../services/amplitude'

import TabPermissionModal from '../../components/TabPermissionModal'

import './index.css'

class UnplugSignUp extends React.Component {

  onCompleteSignup(tabPermissionGranted) {
    sendAmplitudeData('Sign Up: Completed Tab Permission Modal', {
      'Permission Granted': tabPermissionGranted,
    })
    this.props.dispatch(completeSignUp())
  }

  render() {
    return (
      <div className="signup-container">
        <TabPermissionModal
          onFinish={granted => this.onCompleteSignup(granted)}
          onClose={() => this.onCompleteSignup(false)}
        />
      </div>
    )
  }
}

UnplugSignUp.propTypes = {
  dispatch: PropTypes.func.isRequired,
}

export default connect()(UnplugSignUp)
