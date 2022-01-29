import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Heading } from 'evergreen-ui'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import { endFlow, clearStandbyWindows } from '../../../actions'

import { HEADER_FONT } from '../../../services/constants'
import { sendAmplitudeData } from '../../../services/amplitude'

import { ReactComponent as EnterFlowIcon } from '../../../assets/noun_play_569573.svg'
import { ReactComponent as TrashIcon } from '../../../assets/noun_Trash_3775172.svg'
import { ReactComponent as TrashIconWhite } from '../../../assets/noun_Trash_3775172_white.svg'
import { ReactComponent as CollapseIcon } from '../../../assets/noun_collapse_2625924.svg'

import TabListView from '../../TabListView'

import DeleteConfirmationModal from '../DeleteConfirmationModal'

import '../index.css'

class StandbyBundle extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showDeleteModal: false,
      showBody: false,
    }
  }

  openStandby() {
    // ending flow will open standby tabs
    this.props.dispatch(endFlow('Opened Standby'))
  }

  deleteStandby() {
    sendAmplitudeData('Clear Standby')
    this.props.dispatch(clearStandbyWindows())
  }

  render() {
    const windows = this.props.windows
    const display = this.props.display
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches

    let cardStyle = {}

    let headerStyle = {
      backgroundColor: '#3495f8',
    }
    let bodyStyle = {
      height: '80%',
    }
    let scrollableListStyle = {
      height: '141px'
    }

    let collapseIconStyle = {}
    if (!this.state.showBody) {
      collapseIconStyle['transform'] = 'rotate(180deg)'
    }

    if (display === 'LIST') {
      cardStyle['width'] = '620px'
      headerStyle['cursor'] = 'pointer'
      if (!this.state.showBody) {
        headerStyle['borderRadius'] = '10px'
      } else {
        bodyStyle['height'] = '440px'
      }
    }

    let enterFlowRef

    return (
      <div className="bundle-card" style={cardStyle}>
        <div
          className="bundle-header"
          style={headerStyle}
          onClick={e => {
            if (display === 'LIST') {
              this.setState({ showBody: !this.state.showBody })
            }
          }}
        >
          <div className="icon-set" style={{ marginLeft: '5px' }}>
            <OverlayTrigger
              placement="top"
              delay={{ show: 500, hide: 250 }}
              overlay={
                <Tooltip id="enter-flow-icon-tooltip">
                  Save current tabs, open these tabs
                </Tooltip>
              }
            >
              <EnterFlowIcon
                className="enter-flow-icon fake-enter-for-onboarding"
                ref={node => enterFlowRef = node}
                onClick={e => {
                  this.openStandby()
                  enterFlowRef.blur()
                }}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    this.openStandby()
                    enterFlowRef.blur()
                  }
                }}
                onKeyDown={e => {
                  this.handleKeyDown(e)
                }}
              />
            </OverlayTrigger>
          </div>
          <Heading
            color="white"
            fontFamily={HEADER_FONT}
            size={600}
            marginLeft={4}
            flexGrow={1}
          >
            Standby
          </Heading>
          {display === 'LIST' &&
            <CollapseIcon
              className="expand-collapse-icon"
              style={collapseIconStyle}
            />
          }
        </div>
        {(display === 'GRID' || this.state.showBody) &&
          <div className="bundle-body" style={bodyStyle}>
            <div
              class="scrollable-list-container"
              style={scrollableListStyle}
            >
              <TabListView
                listId={-2}
                windows={windows}
                searchString={this.props.searchString}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <OverlayTrigger
                placement="left"
                delay={{ show: 500, hide: 250 }}
                overlay={
                  <Tooltip>
                    Delete Standby
                  </Tooltip>
                }
              >
                {isDarkMode
                  ?
                    <TrashIconWhite
                      className="delete-flow-icon"
                      style={{ marginLeft: '3px' }}
                      onClick={e => {
                        e.stopPropagation()
                        this.setState({showDeleteModal: true})
                      }}
                    />
                  :
                    <TrashIcon
                      className="delete-flow-icon"
                      style={{ marginLeft: '3px' }}
                      onClick={e => {
                        e.stopPropagation()
                        this.setState({showDeleteModal: true})
                      }}
                    />
                }
              </OverlayTrigger>
              <DeleteConfirmationModal
                show={this.state.showDeleteModal}
                flowName="Standby"
                onHide={e => {
                  this.setState({showDeleteModal: false})
                }}
                onConfirm={e => {
                  this.deleteStandby()
                  this.setState({showDeleteModal: false})
                }}
              />
            </div>
          </div>
        }
      </div>
    )
  }
}

StandbyBundle.propTypes = {
  searchString: PropTypes.string,
  windows: PropTypes.object.isRequired,
  display: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default connect()(StandbyBundle)