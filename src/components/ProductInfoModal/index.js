import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Heading, Text } from 'evergreen-ui'

import {
  Button,
  Modal,
  Accordion,
  Card,
} from 'react-bootstrap'

import {
  setCompletedTour,
  setCanceledTour,
}
from '../../actions'

import { FONT, HEADER_FONT } from '../../services/constants'
import { sendAmplitudeData } from '../../services/amplitude'

import './index.css'

function ProductInfoModal(props) {
  const isDarkMode =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  const contentColor = isDarkMode ? "white" : "#707070"

  let contentStyle = { 'marginLeft': '10px' }
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Heading
          color={isDarkMode ? "white" : "black"}
          fontFamily={HEADER_FONT}
          size={700}
        >
          How to use Flow
        </Heading>
      </Modal.Header>
      <Modal.Body>
        <Accordion>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0">
              <Heading
                className="heading-text"
                fontFamily={FONT}
                size={600}
              >
                What is a Flow?
              </Heading>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Text
                  color={contentColor}
                  fontFamily={FONT}
                  style={contentStyle}
                  size={500}
                >
                  - A workspace you can name that saves your tabs.
                </Text>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="1">
              <Heading
                className="heading-text"
                fontFamily={FONT}
                size={600}
              >
                Why use Flows?
              </Heading>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <Text
                  color={contentColor}
                  fontFamily={FONT}
                  style={contentStyle}
                  size={500}
                >
                  - Flows organize your browser into separate contexts, allowing you to quickly switch workstreams.
                </Text>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="2">
              <Heading
                className="heading-text"
                fontFamily={FONT}
                size={600}
              >
                How can I create a Flow?
              </Heading>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="2">
              <Card.Body>
                <Text
                  color={contentColor}
                  fontFamily={FONT}
                  style={contentStyle}
                  size={500}
                >
                  - Click the plus button in the sidebar.
                </Text>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="3">
              <Heading
                className="heading-text"
                fontFamily={FONT}
                size={600}
              >
                How can I enter a Flow?
              </Heading>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="3">
              <Card.Body>
                <Text
                  color={contentColor}
                  fontFamily={FONT}
                  style={contentStyle}
                  size={500}
                >
                  - Click on the play button on the top left of the Flow's card.
                </Text>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="4">
              <Heading
                className="heading-text"
                fontFamily={FONT}
                size={600}
              >
                What happens when I enter a Flow?
              </Heading>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="4">
              <Card.Body>
                <Text
                  color={contentColor}
                  fontFamily={FONT}
                  style={contentStyle}
                  size={500}
                >
                  - The tabs saved in that Flow are opened. Their size and orientation are preserved from your last use.
                </Text>
                <br/>
                <Text
                  color={contentColor}
                  fontFamily={FONT}
                  style={contentStyle}
                  size={500}
                >
                  - If you were already in a Flow, your open tabs are first closed and saved to that Flow.
                </Text>
                <br/>
                <Text
                  color={contentColor}
                  fontFamily={FONT}
                  style={contentStyle}
                  size={500}
                >
                  - If you were not in a Flow, your open tabs are put on Standby - they will reopen when you end Flow.
                </Text>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="5">
              <Heading
                className="heading-text"
                fontFamily={FONT}
                size={600}
              >
                What’s Standby?
              </Heading>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="5">
              <Card.Body>
                <Text
                  color={contentColor}
                  fontFamily={FONT}
                  style={contentStyle}
                  size={500}
                >
                  - Standby consists of tabs that are closed when you enter Flow. These reopen when you end Flow.
                </Text>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="6">
              <Heading
                className="heading-text"
                fontFamily={FONT}
                size={600}
              >
                 What happens when I end a Flow?
              </Heading>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="6">
              <Card.Body>
                <Text
                  color={contentColor}
                  fontFamily={FONT}
                  style={contentStyle}
                  size={500}
                >
                  - Your current tabs are closed and saved to the Flow.
                </Text>
                <br/>
                <Text
                  color={contentColor}
                  fontFamily={FONT}
                  style={contentStyle}
                  size={500}
                >
                  - Any uncategorized tabs in Standby are reopened.
                </Text>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="7">
              <Heading
                className="heading-text"
                fontFamily={FONT}
                size={600}
              >
                 What happens when I share a Flow?
              </Heading>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="7">
              <Card.Body>
                <Text
                  color={contentColor}
                  fontFamily={FONT}
                  style={contentStyle}
                  size={500}
                >
                  - You create a link to a public webpage that snapshots your Flow's name and links.
                </Text>
                <br/>
                <Text
                  color={contentColor}
                  fontFamily={FONT}
                  style={contentStyle}
                  size={500}
                >
                  - The webpage will not update as you edit your Flow. Click share again to create a new snapshot.
                </Text>
                <br/>
                <Text
                  color={contentColor}
                  fontFamily={FONT}
                  style={contentStyle}
                  size={500}
                >
                  - Only people with the link can view the webpage.
                </Text>
                <br/>
                <Text
                  color={contentColor}
                  fontFamily={FONT}
                  style={contentStyle}
                  size={500}
                >
                  - Flows you share are not tied to your personally identifiable information.
                </Text>
                <br/>
                <Text
                  color={contentColor}
                  fontFamily={FONT}
                  style={contentStyle}
                  size={500}
                >
                  - Here's an <a href="https://www.shareflow.app/?id=DJrwAgzZW" target="_blank" rel="noopener noreferrer">example webpage</a>.
                </Text>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="8">
              <Heading
                className="heading-text"
                fontFamily={FONT}
                size={600}
              >
                How do I delete a link to a shared Flow?
              </Heading>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="8">
              <Card.Body>
                <Text
                  color={contentColor}
                  fontFamily={FONT}
                  style={contentStyle}
                  size={500}
                >
                  - Email us at founders@enterflow.app with the link.
                </Text>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </Modal.Body>
      <Modal.Footer>
        <div className="button-row-container" style={{ marginTop: '10px' }}>
          <Button
            style={{ marginRight: '5px' }}
            onClick={() => {
              props.onHide()
              props.dispatch(setCanceledTour(false))
              props.dispatch(setCompletedTour(false))
              sendAmplitudeData('FAQ - Click Take Tour')
            }}
          >
            Take Tour
          </Button>
          <Button variant="outline-primary" onClick={props.onHide}>
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

ProductInfoModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default connect()(ProductInfoModal)