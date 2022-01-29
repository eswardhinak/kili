import React from 'react'
import PropTypes from 'prop-types'
import {
  Heading,
} from 'evergreen-ui'
import {
  Modal,
  Button,
} from 'react-bootstrap'

import { FONT, HEADER_FONT } from '../../../services/constants'

export default function EnterFlowFirstTimeModal(props) {
  const isDarkMode =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Heading
          color={isDarkMode ? "white" : "black"}
          fontFamily={HEADER_FONT}
          size={700}
        >
          You're about to enter a Flow
        </Heading>
      </Modal.Header>
      <Modal.Body>
        <Heading
          color={isDarkMode ? "white" : "black"}
          fontFamily={FONT}
          size={600}
        >
          A Flow is a workspace that saves your tabs.
          <br></br>
          <br></br>
          Your current uncategorized tabs will be saved to a temporary Flow called Standby.
        </Heading>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onAcknowledged}>
          Got it - don't show this again
        </Button>
        <Button variant="outline-primary" onClick={props.onHide}>
          Remind me next time
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

EnterFlowFirstTimeModal.propTypes = {
  show: PropTypes.bool.isRequired,
  flowName: PropTypes.string.isRequired,
  onAcknowledged: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}