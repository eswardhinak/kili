/*global chrome*/

import React from 'react'
import PropTypes from 'prop-types'
import { Heading } from 'evergreen-ui'
import { Button } from 'react-bootstrap'

import { FONT } from '../../services/constants'
import { sendAmplitudeData } from '../../services/amplitude'

import './index.css'

export default class TabPermissionModal extends React.Component {

  onClickEnable() {
    chrome.permissions.request({
      permissions: ['tabs'],
    }, function(granted) {
      sendAmplitudeData('Click Enable Tab Permissions', {
        'Permission Granted': granted,
      })
      this.props.onFinish(granted)
    }.bind(this))
  }

  onClickClose() {
    sendAmplitudeData('Close Tab Permission Modal')
    this.props.onClose()
  }

  render() {
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    return (
      <div className="permission-container" style={{width: '450px'}}>
        <div className="permission-description">
          <Heading
            color={isDarkMode ? "white" : "black"}
            fontFamily={FONT}
            size={600}
            marginBottom={10}
          > 
            Flow uses Tab Assistant to manage your tabs.
            <br/><br/>
            Your browser requires browsing history permission for Flow to manage tabs.
            Rest assured, your browsing history never leaves your device.
            <br/><br/>
            Refer to our <a href="https://enterflow.app/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a> for more details.
          </Heading>
        </div>
        <div className="button-row-container">
          <Button 
            style={{ marginRight: '15px' }}
            onClick={() => this.onClickEnable()}
            autoFocus
          >
            Enable Tab Assistant
          </Button>
          {this.props.onClose !== undefined &&
            <Button variant="outline-primary" onClick={() => this.onClickClose()}>Close</Button>
          }
        </div>
      </div>
    )
  }
}

TabPermissionModal.propTypes = {
  onFinish: PropTypes.func.isRequired,
  onClose: PropTypes.func,
}