import React from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  Heading,
} from 'evergreen-ui'
import {
  Modal,
  Button,
  Form,
} from 'react-bootstrap'

import { HEADER_FONT } from '../../../services/constants'

import './index.css'

export default function ShareFlowReminderModal(props) {
  const [checked, setChecked] = React.useState(true);

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
          Create a link to share this Flow
        </Heading>
      </Modal.Header>
      <Modal.Body style={{display: 'flex', flexDirection: 'column'}}>
        <Text
          color={isDarkMode ? "white" : "black"}
          size={500}
        >
          <b>Share read-only link</b>
        </Text>
        <Text
          color={isDarkMode ? "white" : "black"}
          size={400}
          marginLeft={5}
        >
          Anyone with the link can view the current snapshot of tabs in this Flow.
        </Text>
        <Text
          color={isDarkMode ? "white" : "black"}
          size={500}
          marginTop={15}
        >
          <b>Update shared Flow</b>
        </Text>
        <Text
          color={isDarkMode ? "white" : "black"}
          size={400}
          marginLeft={5}
        >
          The shared link does not update as you edit the Flow.
          <br></br>
          Publish a new link to create an updated snapshot.
        </Text>
        <Text
          color={isDarkMode ? "white" : "black"}
          size={400}
          marginTop={15}
        >
          Visit the FAQ (? button) or our <a href="https://enterflow.app/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a> for more info.
        </Text>
      </Modal.Body>
      <Modal.Footer style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
        <div style={{display: "flex"}}>
          <Button variant="outline-primary" onClick={props.onHide} style={{marginRight: '8px'}}>
            Don't create link
          </Button>
          <Button onClick={() => props.onAcknowledged(checked)}>
            Create Link
          </Button>
        </div>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check defaultChecked={checked} type="checkbox" label="Don't show this again" onChange={e => {
            setChecked(e.target.checked)
          }}/>
        </Form.Group>
      </Modal.Footer>
    </Modal>
  )
}

ShareFlowReminderModal.propTypes = {
  show: PropTypes.bool.isRequired,
  flowName: PropTypes.string.isRequired,
  onAcknowledged: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}