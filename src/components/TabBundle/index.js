import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'

import {
  enterFlow,
  editFlowObjective,
  deleteFlow,
  endFlow,
  disableStandbyReminder,
  disableShareFlowReminder,
} from '../../actions'

import { sendAmplitudeData } from '../../services/amplitude'
import { debounce, createSharedFlow } from '../../services/utils'

import { ReactComponent as WindowsIcon } from '../../assets/noun_tabbed_browsers_603151.svg'
import { ReactComponent as WindowsIconWhite } from '../../assets/noun_tabbed_browsers_603151_white.svg'
import { ReactComponent as NotesIcon } from '../../assets/noun_note_3774598.svg'
import { ReactComponent as NotesIconWhite } from '../../assets/noun_note_3774598_white.svg'
import { ReactComponent as EnterFlowIcon } from '../../assets/noun_play_569573.svg'
import { ReactComponent as EndFlowIcon } from '../../assets/noun_pause_2825910.svg'
import { ReactComponent as TrashIcon } from '../../assets/noun_Trash_3775172.svg'
import { ReactComponent as TrashIconWhite } from '../../assets/noun_Trash_3775172_white.svg'
import { ReactComponent as CollapseIcon } from '../../assets/noun_collapse_2625924.svg'
import { ReactComponent as ShareIcon } from '../../assets/noun_Share_3747544.svg'
import { ReactComponent as ShareIconWhite } from '../../assets/noun_Share_3747544_white.svg'

import TabListView from '../TabListView'
import Journal from '../Journal'

import DeleteConfirmationModal from './DeleteConfirmationModal'
import EnterFlowFirstTimeModal from './EnterFlowFirstTimeModal'
import ShareFlowReminderModal from './ShareFlowReminderModal'

import './index.css'

class TabBundle extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showDeleteModal: false,
      showEnterFlowFirstTimeModal: false,
      showShareFlowReminderModal: false,
      showBody: false,
      view: 'TABS',
    }

    this.updateObjective = this.updateObjective.bind(this)
    this.objective = React.createRef()
  }

  componentDidMount() {
    this.objective.value = this.props.title
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.showBody === false && this.state.showBody === true) {
      let thisCard = document.getElementById('flow-card-'+this.props.flowId)
      thisCard.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
    }
}

  onClickEnterFlow() {
    if (this.props.currentFlowId === undefined && this.props.showStandbyReminder) {
      this.setState({ showEnterFlowFirstTimeModal: true })
      return
    }

    this.logAndEnterFlow()
  }

  logAndEnterFlow() {
    let entrypoint = 'FLOWS Bundle'
    if (this.props.activeTour) {
      entrypoint = 'Onboarding'
    }
    this.props.dispatch(enterFlow(this.props.flowId, entrypoint))

    if (this.props.onToggleFlowCallback !== undefined) {
      this.props.onToggleFlowCallback()
    }
  }

  onClickEndFlow() {
    this.props.dispatch(endFlow('Click End Flow Button on Card'))
    if (this.props.onToggleFlowCallback !== undefined) {
      this.props.onToggleFlowCallback()
    }
  }

  onToggleNotes() {
    if (this.state.view === 'TABS') {
      this.setState({ view: 'NOTES' })
    } else {
      this.setState({ view: 'TABS' })
    }
  }

  onClickShareImpl() {
    const windows = this.props.windows
    let links = {}
    let count = 0
    Object.keys(windows).forEach(windowId => {
      windows[windowId].tabs.forEach(tab => {
        if (tab.url !== "chrome://newtab/") {
          links[count++] = {
            url: tab.url,
            title: tab.title
          }
        }
      })
    })
    createSharedFlow(
      this.props.amplitudeId,
      this.props.flowId,
      this.props.title,
      links,
    )
  }

  onClickShare() {
    sendAmplitudeData('Click Share Flow Card', { 'Flow ID': this.props.flowId })

    if (this.props.showShareFlowReminder) {
      this.setState({ showShareFlowReminderModal: true })
      return
    }

    this.onClickShareImpl()
  }

  updateObjective() {
    const newObjective = this.objective.value
    const flowId = this.props.flowId
    sendAmplitudeData('Edit Flow Objective', {'Flow ID': flowId})
    this.props.dispatch(editFlowObjective(
      flowId,
      newObjective,
    ))
  }

  handleKeyDown(e) {
    const tabIndex = this.props.tabIndex
    let element

    switch(e.key) {
      case 'ArrowDown':
        element = document.getElementById("flow-bundle-"+(tabIndex+1))
        if (element === undefined || element === null) {
          element = document.getElementById("create-flow-button-objective-question")
        }
        if (element === undefined || element === null) {
          element = document.getElementById("flow-search")
        }
        if (element !== undefined && element !== null) {
          element.focus()
        }
        break
      case 'ArrowUp':
        if (tabIndex > 2) {
          element = document.getElementById("flow-bundle-"+(tabIndex-1))
        } else {
          element = document.getElementById("flow-search")
        }
        if (element !== undefined && element !== null) {
          element.focus()
        }
        break
      default:
        break
    }
  }

  deleteFlow() {
    const flowId = this.props.flowId
    sendAmplitudeData('Delete Flow', {'Flow ID': flowId})
    this.props.dispatch(deleteFlow(flowId))
  }

  msToTime(duration) {
    let milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  }

  getHeaderColor() {
    switch(this.props.flowId % 10) {
      case 0:
        return '#F78C6B'
      case 1:
        return '#8447FF'
      case 2:
        return '#06D6A0'
      case 3:
        return '#F26989'
      case 4:
        return '#118AB2'
      case 5:
        return '#B2ABF2'
      case 6:
        return '#643A71'
      case 7:
        return '#073B4C'
      case 8:
        return '#F25D4F'
      default:
        return '#358889'
    }
  }

  render() {
    const windows = this.props.windows
    const tabIndex = this.props.tabIndex
    const flowId = this.props.flowId
    const isCurrentFlowBundle = this.props.currentFlowId === flowId
    const isNotesView = this.state.view === 'NOTES'
    const display = this.props.display
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches

    const showShareFlowButton = true

    let enterFlowRef, endFlowRef

    let cardStyle = {}
    if (isCurrentFlowBundle) {
      cardStyle['height'] = '440px'
      cardStyle['marginRight'] = '0px'
      cardStyle['marginLeft'] = '10px'
      cardStyle['marginTop'] = '55px'
      cardStyle['marginBottom'] = '0px'
    }

    let headerStyle = {
      backgroundColor: this.getHeaderColor(),
    }

    let bodyStyle = {
      height: isCurrentFlowBundle
        ? '91%'
        : '100%'
    }

    let scrollableListStyle = {
      height: isCurrentFlowBundle
        ? '88%'
        : '141px'
    }

    let collapseIconStyle = {}
    if (!this.state.showBody) {
      collapseIconStyle['transform'] = 'rotate(180deg)'
    }

    let inputStyle = {
      width: display === 'LIST' ? '60%' : '100%',
    }

    if (display === 'LIST') {
      cardStyle['width'] = '620px'
      headerStyle['cursor'] = 'pointer'
      if (!this.state.showBody) {
        headerStyle['borderRadius'] = '10px'
        inputStyle['borderColor'] = 'transparent'
        inputStyle['cursor'] = 'pointer'
      } else {
        bodyStyle['height'] = '410px'
      }
    } else {
      cardStyle['maxHeight'] = '440px'
    }

    // const stats = this.props.stats
    // let timeLast7 = 0
    // let timeSpent = '00:00:00.0'
    // if (stats !== undefined) {
    //   const timePastDays = stats['timeSpent']['pastDays']

    //   let currentDate = new Date()
    //   currentDate.setHours(0)
    //   currentDate.setMinutes(0)
    //   currentDate.setSeconds(0)
    //   currentDate.setMilliseconds(0)

    //   let key
    //   let daysBack = 0
    //   let currentTime = currentDate.getTime()
    //   while (daysBack < 7) {
    //     key = new Date(new Date().setTime(currentTime - daysBack*24*60*60*1000))
    //     if (timePastDays !== undefined && key in timePastDays) {
    //       timeLast7 += timePastDays[key]
    //     }
    //     daysBack++
    //   }
    //   timeSpent = this.msToTime(timeLast7)
    // }

    let debouncedUpdateObjective = debounce(this.updateObjective, 500)
    return (
      <div
        id={'flow-card-'+flowId}
        className="bundle-card"
        style={cardStyle}
      >
        <div
          className="bundle-header"
          style={headerStyle}
          onClick={e => {
            if (display === 'LIST') {
              this.setState({ showBody: !this.state.showBody })
            }
          }}
        >
          <div className="icon-set">
            {isCurrentFlowBundle
              ?
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 500, hide: 250 }}
                  overlay={
                    <Tooltip id="end-flow-icon-tooltip">
                      Save and close these tabs
                    </Tooltip>
                  }
                >
                  <EndFlowIcon
                    id={"flow-bundle-"+tabIndex}
                    tabIndex={tabIndex}
                    className="end-flow-icon"
                    ref={node => endFlowRef = node}
                    onClick={e => {
                      this.onClickEndFlow()
                      endFlowRef.blur()
                    }}
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        this.onClickEndFlow()
                        endFlowRef.blur()
                      }
                    }}
                    onKeyDown={e => {
                      this.handleKeyDown(e)
                    }}
                  />
                </OverlayTrigger>
              :
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
                    id={"flow-bundle-"+tabIndex}
                    tabIndex={tabIndex}
                    className="enter-flow-icon fake-enter-for-onboarding"
                    ref={node => enterFlowRef = node}
                    onClick={e => {
                      e.stopPropagation()
                      this.onClickEnterFlow()
                      enterFlowRef.blur()
                    }}
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        this.onClickEnterFlow()
                        enterFlowRef.blur()
                      }
                    }}
                    onKeyDown={e => {
                      this.handleKeyDown(e)
                    }}
                  />
                </OverlayTrigger>
            }
          </div>
          <form
            style={{ flexGrow: 1 }}
            onSubmit={e => {
              e.preventDefault()
              this.updateObjective()
              this.objective.blur()
            }}
          >
            <input
              id={"flow-objective-"+tabIndex}
              style={inputStyle}
              className="editable-objective"
              ref={node => (this.objective = node)}
              onClick={e => {
                e.stopPropagation()
              }}
              onChange={e => {
                debouncedUpdateObjective()
              }}
              disabled={display === 'LIST' && !this.state.showBody}
            />
          </form>
          {display === 'LIST' &&
            <CollapseIcon
              className="expand-collapse-icon"
              style={collapseIconStyle}
            />
          }
        </div>
        {(display === 'GRID' || this.state.showBody || isCurrentFlowBundle) &&
          <div className="bundle-body" style={bodyStyle}>
            {this.state.view === 'TABS'
              ?
                <div
                  class="scrollable-list-container"
                  style={scrollableListStyle}
                >
                  <TabListView
                    listId={isCurrentFlowBundle ? -1 : flowId}
                    windows={windows}
                    searchString={this.props.searchString}
                  />
                </div>
              :
                <Journal
                  flowId={flowId}
                  notes={this.props.notes}
                  isCurrentFlow={isCurrentFlowBundle}
                />
            }
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              {showShareFlowButton &&
                <OverlayTrigger
                  placement="left"
                  delay={{ show: 500, hide: 250 }}
                  overlay={
                    <Tooltip>
                      Create a link to share this Flow
                    </Tooltip>
                  }
                >
                  {isDarkMode
                    ?
                      <ShareIconWhite
                        className="share-icon"
                        style={{ marginRight: '5px' }}
                        onClick={e => {
                          e.stopPropagation()
                          this.onClickShare()
                        }}
                      />
                    :
                      <ShareIcon
                        className="share-icon"
                        style={{ marginRight: '5px' }}
                        onClick={e => {
                          e.stopPropagation()
                          this.onClickShare()
                        }}
                      />
                  }
                </OverlayTrigger>
              }
              {isNotesView
                ?
                  <OverlayTrigger
                    placement="left"
                    delay={{ show: 500, hide: 250 }}
                    overlay={
                      <Tooltip>
                        Edit windows
                      </Tooltip>
                    }
                  >
                    {isDarkMode
                      ?
                        <WindowsIconWhite
                          className="edit-windows-icon"
                          style={{ marginRight: '2px' }}
                          onClick={e => {
                            this.onToggleNotes()
                          }}
                        />
                      :
                        <WindowsIcon
                          className="edit-windows-icon"
                          style={{ marginRight: '2px' }}
                          onClick={e => {
                            this.onToggleNotes()
                          }}
                        />
                    }
                  </OverlayTrigger>
                :
                  <OverlayTrigger
                    placement="left"
                    delay={{ show: 500, hide: 250 }}
                    overlay={
                      <Tooltip>
                        Add notes
                      </Tooltip>
                    }
                  >
                    {isDarkMode
                      ?
                        <NotesIconWhite
                          className="edit-flow-icon"
                          onClick={e => {
                            this.onToggleNotes()
                          }}
                        />
                      :
                        <NotesIcon
                          className="edit-flow-icon"
                          onClick={e => {
                            this.onToggleNotes()
                          }}
                        />
                    }
                  </OverlayTrigger>
              }
              {!isCurrentFlowBundle &&
                <OverlayTrigger
                  placement="left"
                  delay={{ show: 500, hide: 250 }}
                  overlay={
                    <Tooltip>
                      Delete Flow
                    </Tooltip>
                  }
                >
                  {isDarkMode
                    ?
                      <TrashIconWhite
                        className="delete-flow-icon"
                        style={{ marginLeft: '7px' }}
                        onClick={e => {
                          e.stopPropagation()
                          this.setState({showDeleteModal: true})
                        }}
                      />
                    :
                      <TrashIcon
                        className="delete-flow-icon"
                        style={{ marginLeft: '7px' }}
                        onClick={e => {
                          e.stopPropagation()
                          this.setState({showDeleteModal: true})
                        }}
                      />
                  }
                </OverlayTrigger>
              }
              <DeleteConfirmationModal
                show={this.state.showDeleteModal}
                flowName={this.objective.value}
                onHide={e => {
                  if (e !== undefined) {
                    e.stopPropagation()
                  }
                  this.setState({showDeleteModal: false})
                }}
                onConfirm={e => {
                  e.stopPropagation()
                  this.deleteFlow()
                  this.setState({showDeleteModal: false})
                }}
              />
              <EnterFlowFirstTimeModal
                show={this.state.showEnterFlowFirstTimeModal}
                flowName={this.objective.value}
                onAcknowledged={e => {
                  if (e !== undefined) {
                    e.stopPropagation()
                  }
                  this.setState({showEnterFlowFirstTimeModal: false})
                  this.logAndEnterFlow()
                  this.props.dispatch(disableStandbyReminder())
                }}
                onHide={e => {
                  if (e !== undefined) {
                    e.stopPropagation()
                  }
                  this.setState({showEnterFlowFirstTimeModal: false})
                  this.logAndEnterFlow()
                }}
              />
              {showShareFlowButton &&
                <ShareFlowReminderModal
                  show={this.state.showShareFlowReminderModal}
                  flowName={this.objective.value}
                  onAcknowledged={disableReminder => {
                    this.setState({showShareFlowReminderModal: false})
                    this.onClickShareImpl()
                    if (disableReminder) {
                      this.props.dispatch(disableShareFlowReminder())
                    }
                  }}
                  onHide={e => {
                    if (e !== undefined) {
                      e.stopPropagation()
                    }
                    this.setState({showShareFlowReminderModal: false})
                  }}
                />
              }
            </div>
          </div>
        }
      </div>
    )
  }
}

TabBundle.defaultProps = {
  display: 'CARD',
}

TabBundle.propTypes = {
  display: PropTypes.string,
  searchString: PropTypes.string,
  onToggleFlowCallback: PropTypes.func,
  tabIndex: PropTypes.number,
  flowId: PropTypes.number,
  title: PropTypes.string.isRequired,
  windows: PropTypes.object.isRequired,
  stats: PropTypes.object.isRequired,
  notes: PropTypes.string.isRequired,
  amplitudeId: PropTypes.number.isRequired,
  activeTour: PropTypes.bool.isRequired,
  currentFlowId: PropTypes.number.isRequired,
  showStandbyReminder: PropTypes.bool.isRequired,
  showShareFlowReminder: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  const { appConfig, journal, login } = state
  const { amplitudeId } = login ||
  {
    amplitudeId: undefined,
  }
  let { activeTour, showStandbyReminder, showShareFlowReminder } = appConfig ||
  {
    activeTour: false,
    showStandbyReminder: true,
    showShareFlowReminder: true,
  }
  if (showShareFlowReminder === undefined) {
    showShareFlowReminder = true
  }

  const { currentFlowId } = journal ||
  {
    currentFlowId: undefined,
  }

  return {
    amplitudeId,
    activeTour,
    currentFlowId,
    showStandbyReminder,
    showShareFlowReminder
  }
}

export default connect(mapStateToProps)(TabBundle)
