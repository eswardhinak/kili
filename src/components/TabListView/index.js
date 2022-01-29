/*global chrome*/

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Text } from 'evergreen-ui'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import Highlighter from "react-highlight-words"

import { FONT } from '../../services/constants'
import { sendAmplitudeData } from '../../services/amplitude'
import {
  getItemStyle,
  getListStyle,
} from '../../services/dragUtils'
import { closeTab } from '../../services/utils'

import { deleteLinkFromFlow } from '../../actions'

import defaultTabIcon from '../../assets/default-tab-icon.png'
import flowIcon from '../../assets/flowicon16.png'

import { ReactComponent as RemoveIcon } from '../../assets/noun_Remove_358014.svg'
import { ReactComponent as RemoveIconWhite } from '../../assets/noun_Remove_358014_white.svg'
import { ReactComponent as DragIcon } from '../../assets/icons8-drag-and-drop-100.svg'
import { ReactComponent as DraggableIcon } from '../../assets/noun_drag_1476321.svg'
import { ReactComponent as DraggableIconWhite } from '../../assets/noun_drag_1476321_white.svg'

import './index.css'

class TabListItem extends React.Component {

  render() {
    const tabIndex = this.props.tabIndex
    const tabId = this.props.tabId
    const windowId = this.props.windowId
    const title = this.props.title
    const url = this.props.url
    const icon = this.props.icon
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches

    let removeIconStyle = {
      justifyContent: 'flex-end',
    }

    let searchWords = []
    let searchString = this.props.searchString
    if (searchString !== undefined) {
      searchWords.push(searchString)
    }

    return (
      <div
        key={tabIndex+url}
        className="item-container"
      >
        <div
          className="tab-container"
          onClick={e => this.props.onClickTab(e, url, tabId, windowId)}
        >
          <img className="tab-favicon" src={icon} alt=""/>
          <Highlighter
            className="tab-title"
            searchWords={searchWords}
            autoEscape={true}
            textToHighlight={title}
          />
        </div>
        <OverlayTrigger
          placement="top"
          delay={{ show: 500, hide: 250 }}
          overlay={
            <Tooltip>
              Remove Tab
            </Tooltip>
          }
        >
          {isDarkMode
            ?
              <RemoveIconWhite
                className="remove-link-icon"
                style={removeIconStyle}
                onClick={e => {
                  e.stopPropagation()
                  this.props.deleteLink(windowId, tabIndex, tabId)
                }}
              />
            :
              <RemoveIcon
                className="remove-link-icon"
                style={removeIconStyle}
                onClick={e => {
                  e.stopPropagation()
                  this.props.deleteLink(windowId, tabIndex, tabId)
                }}
              />
          }
        </OverlayTrigger>
      </div>
    )
  }
}

TabListItem.propTypes = {
  searchString: PropTypes.string,
  tabIndex: PropTypes.string.isRequired,
  tabId: PropTypes.number.isRequired,
  windowId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onClickTab: PropTypes.func.isRequired,
  deleteLink: PropTypes.func.isRequired,
}

class TabListView extends React.Component {

  constructor(props) {
    super(props)

    this.onClickTab = this.onClickTab.bind(this)
    this.deleteLink = this.deleteLink.bind(this)
  }

  deleteLink(windowId, tabIndex, tabId) {
    const listId = this.props.listId
    let fromCard
    if (listId === -1) {
      fromCard = 'Current Tabs'
      closeTab(tabId)
    } else if (listId === -2) {
      fromCard = 'Standby'
    } else {
      fromCard = 'Flow ' + listId
    }
    this.props.dispatch(deleteLinkFromFlow(this.props.listId, windowId, tabIndex))
    sendAmplitudeData('Remove Tab', {
      'From Card': fromCard,
      'Window ID': windowId,
      'Tab Index': tabIndex,
    })
  }

  onClickTab(e, tabUrl, tabId, windowId) {
    const listId = this.props.listId
    if (listId === -1) {
      // current tabs list, so jump to this tab
      chrome.tabs.update(tabId, { active: true }, function(tab) {
        chrome.windows.update(tab.windowId, { focused: true })
      })
      sendAmplitudeData('Navigate To Tab', { 'From': 'Current Tab List' })
      return
    }
    e.stopPropagation()
    let active = true
    if (e.ctrlKey || e.metaKey) {
      active = false
    }
    sendAmplitudeData('Open Tab', {
      'Make Tab Active': active,
      'From': listId === -2 ? 'Standby' : 'Flow ' + listId,
    })
    chrome.tabs.create({url: tabUrl, active: active})
  }

  render() {
    const windows = this.props.windows
    const listId = this.props.listId
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches

    if (Object.keys(windows).length < 1) {
      return (
        <div style={{height: '100%', position: 'relative'}}>
          <div className="empty-container">
            <DragIcon className="drag-icon" />
            <Text
              color="#707070"
              fontFamily={FONT}
              size={500}
            >
              Drag and drop tabs here.
            </Text>
          </div>
          <Droppable
            style={{height: '100%', position: 'absolute'}}
            droppableId={
              'T:'+listId+':-1'
            }
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver, true)}
              >
                <Droppable
                  style={{height: '100%'}}
                  droppableId={
                    'W:'+listId
                  }
                  type="WINDOW"
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver, true)}
                    >
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )
    }

    return (
      <div style={{ height: '100%', overflowY: 'scroll', paddingRight: '1px', paddingLeft: '6px' }}>
        <Droppable
          droppableId={
            'W:'+listId
          }
          type="WINDOW"
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {Object.keys(windows).map((windowId, windowIndex) => {
                return (
                  <Draggable
                    key={listId+'window'+windowIndex}
                    draggableId={listId+'window'+windowId}
                    index={windowIndex}
                    type="WINDOW"
                  >
                    {(provided, snapshot) => {
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                          )}
                        >
                          <div key={windowIndex} class="window-container">
                            <div style={{ display: 'flex' }}>
                              <Text
                                style={{ flexGrow: 1 }}
                                color={isDarkMode ? "#ffffffc4" : "#707070"}
                                fontFamily={FONT}
                                size={500}
                              >
                                Window {windowIndex+1}
                              </Text>
                              {isDarkMode
                                ? <DraggableIconWhite className="draggable-icon" />
                                : <DraggableIcon className="draggable-icon" />
                              }
                            </div>
                            <Droppable
                              droppableId={
                                'T:'+listId+':'+windowId
                              }
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  style={getListStyle(snapshot.isDraggingOver)}
                                >
                                  {windows[windowId].tabs.map((tab, tabIndex) => {
                                    const tabUrl = tab['url']

                                    let icon = tab['favIconUrl']
                                    if (
                                      tabUrl === 'chrome://newtab/' ||
                                      tabUrl === 'chrome-extension://habljobnjoelmonpddfoniajadllkaag/index.html'
                                    ) {
                                      icon = flowIcon
                                    } else if (icon === "" || icon === undefined || icon === null) {
                                      icon = defaultTabIcon
                                    }

                                    let title = tab['title']
                                    if (title === "" || title === undefined || title === null) {
                                      title = tab['url']
                                    }

                                    const key = 'f'+listId+'w'+windowId+'t'+tabIndex
                                    return (
                                      <Draggable
                                        key={key}
                                        draggableId={key}
                                        index={tabIndex}>
                                        {(provided, snapshot) => {
                                          return (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style,
                                              )}
                                            >
                                              <TabListItem
                                                tabIndex={tabIndex}
                                                windowId={windowId}
                                                title={title}
                                                url={tabUrl}
                                                tabId={tab['tabId']}
                                                icon={icon}
                                                onClickTab={this.onClickTab}
                                                deleteLink={this.deleteLink}
                                                searchString={this.props.searchString}
                                              />
                                            </div>
                                            )
                                        }}
                                      </Draggable>
                                    )
                                  })}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </div>
                        </div>
                      )
                    }}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    )
  }
}

TabListView.defaultProps = {
  disableLinkClicks: true,
}

TabListView.propTypes = {
  searchString: PropTypes.string,
  listId: PropTypes.number.isRequired,
  currentFlowId: PropTypes.number.isRequired,
  windows: PropTypes.object.isRequired,
  disableLinkClicks: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  const { journal } = state
  const { currentFlowId } = journal ||
  {
    currentFlowId: undefined,
  }
  return {
    currentFlowId,
  } 
}

export default connect(mapStateToProps)(TabListView)