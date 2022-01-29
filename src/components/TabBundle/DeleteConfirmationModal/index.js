import React from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  Heading,
} from 'evergreen-ui'
import {
  Modal,
  Button,
} from 'react-bootstrap'

import { FONT, HEADER_FONT } from '../../../services/constants'

export default function DeleteConfirmationModal(props) {
  const isDarkMode =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Heading
          color={isDarkMode ? "white" : "black"}
          fontFamily={HEADER_FONT}
          size={600}
        >
          Delete Flow
        </Heading>
      </Modal.Header>
      <Modal.Body>
        <Text
          color="#3495f8"
          fontFamily={FONT}
          size={500}
        >
          Are you sure you want to delete - {props.flowName}?
        </Text>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={props.onHide}>
          No
        </Button>
        <Button onClick={props.onConfirm}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

DeleteConfirmationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  flowName: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
}