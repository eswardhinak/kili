/*global chrome*/

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Text } from 'evergreen-ui'
import {
  Navbar,
  Nav,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'

import { generateToast } from '../../services/utils'
import { sendAmplitudeData } from '../../services/amplitude'

import { createFlow } from '../../actions'

import ProductInfoModal from '../ProductInfoModal'

import WhatsNewModal from '../WhatsNewModal'

import { ReactComponent as PlusIcon } from '../../assets/noun_Plus_869752.svg'
import { ReactComponent as TourIcon } from '../../assets/noun_Question_1938477.svg'
import { ReactComponent as ShareIcon } from '../../assets/noun_link_94818.svg'

import './index.css'

class ControlMenu extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showProductInfoModal: false,
    }
  }

  componentDidMount() {
    this.updateTabName()
  }

  componentDidUpdate() {
    this.updateTabName()
  }

  updateTabName() {
    let flowObjective = this.props.flowObjective
    if (flowObjective !== undefined) {
      document.title = 'Flow - ' + flowObjective
    } else {
      document.title = 'Flow'
    }
  }

  onClickFeedback(e, tabUrl) {
    sendAmplitudeData('Click Feedback')
    let active = true
    if (e.ctrlKey || e.metaKey) {
      active = false
    }
    chrome.tabs.create({url: tabUrl, active: active})
  }

  onClickCreateFlow() {
    sendAmplitudeData('Create Flow', {
      'Entrypoint': 'Sidebar',
      'Type': 'Empty',
      'Entered': false,
    })

    this.props.dispatch(createFlow({}, 'Untitled Flow'))
  }

  render() {
    return (
      <div>
        <div className="sidebar" style={{marginRight: '20px'}}>
          <OverlayTrigger
            placement="right"
            delay={{ show: 500, hide: 250 }}
            overlay={
              <Tooltip id="focus-tooltip">
                Create an empty Flow
              </Tooltip>
            }
          >
            <PlusIcon
              className="control-menu-icon plus-icon"
              id='create-flow-icon'
              onClick={e => {
                this.onClickCreateFlow()
              }}
            />
          </OverlayTrigger>
          <OverlayTrigger
            placement="right"
            delay={{ show: 500, hide: 250 }}
            overlay={
              <Tooltip id="tour-tooltip">
                View product guide
              </Tooltip>
            }
          >
            <TourIcon
              className="control-menu-icon faq-icon"
              id='tour-icon'
              onClick={e => {
                sendAmplitudeData('Click Product Guide')
                this.setState({showProductInfoModal: true})
              }}
            />
          </OverlayTrigger>
          <ProductInfoModal
            show={this.state.showProductInfoModal}
            onHide={e => {
              this.setState({showProductInfoModal: false})
            }}
          />
          <OverlayTrigger
            placement="right"
            delay={{ show: 500, hide: 250 }}
            overlay={
              <Tooltip id="share-tooltip">
                Copy link to share Flow with a friend!
              </Tooltip>
            }
          >
            <ShareIcon
              className="control-menu-icon"
              onClick={e => {
                navigator.clipboard.writeText(
                  "https://enterflow.app/?utm_source=flow&utm_medium=inappshare"
                 )
                generateToast('Link copied to clipboard!')
                sendAmplitudeData('Click Share Flow Link')
              }}
            />
          </OverlayTrigger>
        </div>
        <Navbar style={{ alignItems: 'flex-start' }} fixed="top">
          <Nav className="mr-auto"></Nav>
          {this.props.dismissedWhatsNew < 1615332204368 &&
            <WhatsNewModal />
          }
        </Navbar>
        <Navbar style={{ alignItems: 'flex-start' }} fixed="bottom">
          <Nav className="mr-auto">
          </Nav>
          <Text
            className="feedback-text"
            onClick={e => this.onClickFeedback(e, "https://enterflow.typeform.com/to/d9gTyQ5R")}
            size={300}
          >
            Send Feedback
          </Text>
        </Navbar>
      </div>
    )
  }
}

ControlMenu.propTypes = {
  completedTour: PropTypes.bool.isRequired,
  canceledTour: PropTypes.bool.isRequired,
  dismissedWhatsNew: PropTypes.number.isRequired,
  flowObjective: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  const { journal, login } = state
  const { flows, currentFlowId } = journal ||
  {
    currentFlowId: undefined,
    flows: [],
  }
  let { completedTour, canceledTour, dismissedWhatsNew } = login ||
  {
    completedTour: false,
    canceledTour: false,
    dismissedWhatsNew: 0,
  }
  if (dismissedWhatsNew === undefined) {
    dismissedWhatsNew = 0
  }

  let flowObjective
  if (currentFlowId !== undefined && flows[currentFlowId] !== undefined) {
    flowObjective = flows[currentFlowId]['objective']
  }

  return {
    completedTour,
    canceledTour,
    dismissedWhatsNew,
    flowObjective,
  }
}

export default connect(mapStateToProps)(ControlMenu)