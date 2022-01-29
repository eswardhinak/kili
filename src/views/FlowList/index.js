/*global chrome*/

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Spinner,
} from 'react-bootstrap'
import _ from "lodash"
import { DragDropContext } from 'react-beautiful-dnd'

import TabBundle from '../../components/TabBundle'
import StandbyBundle from '../../components/TabBundle/StandbyBundle'
import TabPermissionModal from '../../components/TabPermissionModal'
import CurrentTabList from '../../components/CurrentTabList'

import {
  enterFlow,
  moveFlowLink,
  addLinkToFlow,
  deleteLinkFromFlow,
  endFlow,
  updateFlowTabs,
  addWindowToFlow,
  deleteWindowFromFlow,
  moveFlowWindow,
  FlowDisplay,
  setFlowDisplay,
} from '../../actions'

import {
  closeTab,
  createTab,
  debounce,
  moveTab,
  openTabs,
  saveWindows,
} from '../../services/utils'

import { sendAmplitudeData } from '../../services/amplitude'

import { ReactComponent as SearchIcon } from '../../assets/noun_Search_2263848.svg'
import { ReactComponent as GridIcon } from '../../assets/noun_grid_642555.svg'
import { ReactComponent as ListIcon } from '../../assets/noun_list_view_2540395.svg'
import noFlowsHere from '../../assets/no-flows-here.png'

import './index.css'
import ControlMenu from '../../components/ControlMenu'

class FlowList extends React.Component {

  debouncedLogSearch = debounce(this.logSearch.bind(this), 1000)

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      hasTabPermissions: false,
      searchString: '',
      currentWindows: {},
      detachedTab: undefined,
    }

    this.tabCreatedListener = this.tabCreatedListener.bind(this)
    this.tabUpdatedListener = this.tabUpdatedListener.bind(this)
    this.tabRemovedListener = this.tabRemovedListener.bind(this)
    this.tabMovedListener = this.tabMovedListener.bind(this)
    this.tabDetachedListener = this.tabDetachedListener.bind(this)
    this.tabAttachedListener = this.tabAttachedListener.bind(this)
  }

  componentDidMount() {
    chrome.permissions.contains({
      permissions:['tabs'],
    }, function(result) {
      const currentFlowId = this.props.currentFlowId
      if (result) {
        const dispatch = this.props.dispatch
        chrome.windows.getAll({populate: true}, function(windowsArray) {
          const windowData = saveWindows(windowsArray, false, true)
          const loggingData = windowData.loggingData

          if (currentFlowId !== undefined) {
            if (loggingData['tabCount'] === 1) {
              dispatch(endFlow('No Tabs Open', false))
            } else {
              dispatch(updateFlowTabs(currentFlowId, windowData.windows))
            }
          }

          this.setState({
            currentWindows: windowData.windows,
            hasTabPermissions: true,
            loading: false,
          })

          this.props.finishLoading(
            loggingData.windowCount,
            loggingData.tabCount,
            currentFlowId,
            this.props.display,
          )

          chrome.tabs.onCreated.addListener(this.tabCreatedListener)
          chrome.tabs.onUpdated.addListener(this.tabUpdatedListener)
          chrome.tabs.onMoved.addListener(this.tabMovedListener)
          chrome.tabs.onRemoved.addListener(this.tabRemovedListener)
          chrome.tabs.onDetached.addListener(this.tabDetachedListener)
          chrome.tabs.onAttached.addListener(this.tabAttachedListener)
        }.bind(this))
      } else {
        this.setState({hasTabPermissions: false, loading: false})
        this.props.finishLoading(undefined, undefined, currentFlowId)
      }
    }.bind(this))
  }

  componentWillUnmount() {
    chrome.tabs.onCreated.removeListener(this.tabCreatedListener)
    chrome.tabs.onUpdated.removeListener(this.tabUpdatedListener)
    chrome.tabs.onRemoved.removeListener(this.tabRemovedListener)
    chrome.tabs.onMoved.removeListener(this.tabMovedListener)
    chrome.tabs.onDetached.removeListener(this.tabDetachedListener)
    chrome.tabs.onAttached.removeListener(this.tabAttachedListener)
  }

  tabCreatedListener(tab) {
    const tabWindow = tab.windowId
    const tabToAdd = {
      tabId: tab.id,
      favIconUrl: tab.favIconUrl,
      url: tab.url,
      title: tab.title,
    }

    let newCurrentWindows = _.cloneDeep(this.state.currentWindows)
    if (tabWindow in newCurrentWindows) {
      if (
        tab.index in newCurrentWindows[tabWindow].tabs &&
        newCurrentWindows[tabWindow].tabs[tab.index].tabId === tab.id
      ) {
        newCurrentWindows[tabWindow].tabs[tab.index] = tabToAdd
      } else {
        newCurrentWindows[tabWindow].tabs.splice(tab.index, 0, tabToAdd)
      }
    } else {
      newCurrentWindows[tabWindow] = {
        metaData: {},
        tabs: [tabToAdd]
      }
    }
    this.setState({ currentWindows: newCurrentWindows })
  }

  tabUpdatedListener(tabId, changeInfo, tab) {
    const tabWindow = tab.windowId
    const tabToAdd = {
      tabId: tab.id,
      favIconUrl: tab.favIconUrl,
      url: tab.url,
      title: tab.title,
    }

    let newCurrentWindows = _.cloneDeep(this.state.currentWindows)
    if (tabWindow in newCurrentWindows) {
      if (
        tab.index in newCurrentWindows[tabWindow].tabs &&
        newCurrentWindows[tabWindow].tabs[tab.index].tabId === tabId
      ) {
        newCurrentWindows[tabWindow].tabs[tab.index] = tabToAdd
      } else {
        newCurrentWindows[tabWindow].tabs.splice(tab.index, 0, tabToAdd)
      }
    } else {
      newCurrentWindows[tabWindow] = {
        metaData: {},
        tabs: [tabToAdd]
      }
    }
    this.setState({ currentWindows: newCurrentWindows })
  }

  tabRemovedListener(tabId, removeInfo) {
    const tabWindow = removeInfo.windowId

    let newCurrentWindows = _.cloneDeep(this.state.currentWindows)
    if (tabWindow in newCurrentWindows) {
      let newTabs = newCurrentWindows[tabWindow].tabs.filter(
        tab => tab.tabId !== tabId
      )
      if (newTabs.length === 0) {
        delete newCurrentWindows[tabWindow]
      } else {
        newCurrentWindows[tabWindow].tabs = newTabs
      }
      this.setState({ currentWindows: newCurrentWindows })
    }
  }

  // Note this supports moving in the same window only
  tabMovedListener(tabId, moveInfo) {
    const tabWindow = moveInfo.windowId

    let newCurrentWindows = _.cloneDeep(this.state.currentWindows)
    if (tabWindow in newCurrentWindows) {
      const [removed] =
        newCurrentWindows[tabWindow].tabs.splice(moveInfo.fromIndex, 1)
      newCurrentWindows[tabWindow].tabs.splice(moveInfo.toIndex, 0, removed)

      this.setState({ currentWindows: newCurrentWindows })
    }
  }

  tabDetachedListener(tabId, detachInfo) {
    const tabWindow = detachInfo.oldWindowId

    let newCurrentWindows = _.cloneDeep(this.state.currentWindows)
    if (tabWindow in newCurrentWindows) {
      const [detachedTab] =
        newCurrentWindows[tabWindow].tabs.splice(detachInfo.oldPosition, 1)
      if (newCurrentWindows[tabWindow].tabs.length === 0) {
        delete newCurrentWindows[tabWindow]
      }

      this.setState({ currentWindows: newCurrentWindows, detachedTab: detachedTab })
    }
  }

  tabAttachedListener(tabId, attachInfo) {
    const tabWindow = attachInfo.newWindowId
    const detachedTab = this.state.detachedTab
    if (detachedTab === undefined) {
      return
    }

    let newCurrentWindows = _.cloneDeep(this.state.currentWindows)
    if (tabWindow in newCurrentWindows) {
      newCurrentWindows[tabWindow].tabs.splice(attachInfo.newPosition, 0, detachedTab)
    } else {
      newCurrentWindows[tabWindow] = {
        metaData: {},
        tabs: [detachedTab]
      }
    }

    this.setState({ currentWindows: newCurrentWindows })
  }

  enterFirstFlow() {
    const flows = this.props.flows
    for (let i = 0; i < flows.length; i++) {
      const objective = flows[i]['objective']
      if (objective.toLowerCase().includes(this.state.searchString.toLowerCase())) {
        this.props.dispatch(enterFlow(flows[i]['id'], 'Objective Question'))
        return
      }
    }
  }

  onDragTab = (source, destination) => {
    const dispatch = this.props.dispatch
    const currentFlowId = this.props.currentFlowId
    const flows = this.props.flows
    const standbyWindows = this.props.standbyWindows

    const sourceData = source.droppableId.split(':')
    const sourceFlow = sourceData[1]
    const sourceWindow = sourceData[2]

    let moveFrom, moveTo

    // dropped outside the list
    if (!destination) {
      moveFrom = sourceFlow == -2
        ? 'Standby'
        : 'Flow ' + sourceFlow

      sendAmplitudeData('Move Tab', {
        'From Card': moveFrom,
        'From Window': sourceWindow,
        'From Index': source.index,
        'Current Flow': currentFlowId !== undefined ? currentFlowId : 'None',
        'Status': 'Error: Dropped outside a list',
        'Mode': 'Drag and Drop',
      })
      return;
    }

    const destinationData = destination.droppableId.split(':')
    const destinationFlow = destinationData[1]
    let destinationWindow = destinationData[2]

    if (
      (sourceFlow == -1 && destinationFlow == currentFlowId) ||
      (destinationFlow == -1 && sourceFlow == currentFlowId)
    ) {
      // don't allow dragging between current flow and current tabs list
      return
    }

    if (sourceFlow == -1 && destinationFlow == -1) {
      let currentWindows = this.state.currentWindows
      moveTab(
        currentWindows[sourceWindow].tabs[source.index].tabId,
        destinationWindow,
        destination.index,
      )

      moveFrom = 'Current Tabs'
      moveTo = 'Current Tabs'
    } else if (sourceFlow == -1) {
      let currentWindows = this.state.currentWindows
      closeTab(currentWindows[sourceWindow].tabs[source.index].tabId)

      dispatch(addLinkToFlow(
        destinationFlow,
        destinationWindow,
        destination.index,
        currentWindows[sourceWindow].tabs[source.index],
      ))

      moveFrom = 'Current Tabs'
      moveTo = destinationFlow == -2
        ? 'Standby'
        : 'Flow ' + destinationFlow
    } else if (destinationFlow == -1) {
      let tabToAdd
      if (sourceFlow == -2) {
        if (
          standbyWindows[sourceWindow] !== undefined &&
          standbyWindows[sourceWindow].tabs !== undefined
        ) {
          tabToAdd = standbyWindows[sourceWindow].tabs[source.index]
          moveFrom = 'Standby'
        }
      } else {
        flows.forEach(flow => {
          if (flow.id == sourceFlow) {
            tabToAdd = flow['windows'][sourceWindow].tabs[source.index]
            moveFrom = 'Flow ' + sourceFlow
          }
        })
      }

      if (tabToAdd !== undefined) {
        createTab(
          destinationWindow,
          destination.index,
          tabToAdd.url,
        )

        dispatch(deleteLinkFromFlow(
          sourceFlow,
          sourceWindow,
          source.index,
        ))

        moveTo = 'Current Tabs'
      }
    } else {
      dispatch(moveFlowLink(
        {
          flowId: sourceFlow,
          windowId: sourceWindow,
          tabIndex: source.index,
        },
        {
          flowId: destinationFlow,
          windowId: destinationWindow,
          tabIndex: destination.index,
        },
      ))

      moveFrom = sourceFlow == -2
        ? 'Standby'
        : 'Flow ' + sourceFlow
      moveTo = destinationFlow == -2
        ? 'Standby'
        : 'Flow ' + destinationFlow
    }

    if (moveFrom !== undefined && moveTo !== undefined) {
      sendAmplitudeData('Move Tab', {
        'From Card': moveFrom,
        'From Window': sourceWindow,
        'From Index': source.index,
        'To Card': moveTo,
        'To Window': destinationWindow,
        'To Index': destination.index,
        'Current Flow': currentFlowId !== undefined ? currentFlowId : 'None',
        'Status': 'Success',
        'Mode': 'Drag and Drop',
      })
    }
  }

  onDragWindow = (source, destination) => {
    const dispatch = this.props.dispatch
    const currentFlowId = this.props.currentFlowId
    const flows = this.props.flows
    const standbyWindows = this.props.standbyWindows

    const sourceData = source.droppableId.split(':')
    const sourceFlow = sourceData[1]

    let moveFrom, moveTo

    // dropped outside the list
    if (!destination) {
      moveFrom = sourceFlow == -2
        ? 'Standby'
        : 'Flow ' + sourceFlow

      sendAmplitudeData('Move Window', {
        'From Card': moveFrom,
        'From Index': source.index,
        'Current Flow': currentFlowId !== undefined ? currentFlowId : 'None',
        'Status': 'Error: Dropped outside a list',
        'Mode': 'Drag and Drop',
      })
      return;
    }

    const destinationData = destination.droppableId.split(':')
    const destinationFlow = destinationData[1]

    if (
      (sourceFlow == -1 && destinationFlow == currentFlowId) ||
      (destinationFlow == -1 && sourceFlow == currentFlowId)
    ) {
      // don't allow dragging between current flow and current tabs list
      return
    }

    if (sourceFlow == -1 && destinationFlow == -1) {
      // don't support reordering windows atm
      return
    } else if (sourceFlow == -1) {
      let currentWindows = this.state.currentWindows
      let windowIdToMove
      Object.keys(currentWindows).forEach((windowId, windowIndex) => {
        if (windowIndex === source.index) {
          windowIdToMove = parseInt(windowId, 10)
          chrome.windows.remove(windowIdToMove)
        }
      })

      dispatch(addWindowToFlow(destinationFlow, currentWindows[windowIdToMove]))

      moveFrom = 'Current Tabs'
      moveTo = destinationFlow == -2
        ? 'Standby'
        : 'Flow ' + destinationFlow
    } else if (destinationFlow == -1) {
      let windowToAdd
      if (sourceFlow == -2) {
        Object.keys(standbyWindows).forEach((windowId, windowIndex) => {
          if (windowIndex === source.index) {
            windowToAdd = standbyWindows[windowId]
            moveFrom = 'Standby'
          }
        })
      } else {
        flows.forEach(flow => {
          if (flow.id == sourceFlow) {
            Object.keys(flow['windows']).forEach((windowId, windowIndex) => {
              if (windowIndex === source.index) {
                windowToAdd = flow['windows'][windowId]
                moveFrom = 'Flow ' + sourceFlow
              }
            })
          }
        })
      }

      if (windowToAdd !== undefined) {
        openTabs({0: windowToAdd}, true)
        dispatch(deleteWindowFromFlow(sourceFlow, source.index))
        moveTo = 'Current Tabs'
      }
    } else {
      dispatch(moveFlowWindow(
        {
          flowId: sourceFlow,
          windowIndex: source.index,
        },
        {
          flowId: destinationFlow,
          windowIndex: destination.index,
        }
      ))
    }

    if (moveFrom !== undefined && moveTo !== undefined) {
      sendAmplitudeData('Move Window', {
        'From Card': moveFrom,
        'From Index': source.index,
        'To Card': moveTo,
        'To Index': destination.index,
        'Current Flow': currentFlowId !== undefined ? currentFlowId : 'None',
        'Status': 'Success',
        'Mode': 'Drag and Drop',
      })
    }
  }

  onDragEnd = result => {
    const { source, destination } = result

    const sourceDroppableId = source.droppableId

    if (sourceDroppableId.length === 0) {
      return
    } else if (sourceDroppableId[0] === 'T') {
      this.onDragTab(source, destination)
    } else if (sourceDroppableId[0] === 'W') {
      this.onDragWindow(source, destination)
    }
  }

  logSearch() {
    const searchLength = this.state.searchString.length
    if (searchLength === 0) {
      return
    }
    sendAmplitudeData('Flow Search', {
      'Query Length': searchLength,
    })
  }

  renderBundleView() {
    const flows = this.props.flows
    const standbyWindows = this.props.standbyWindows
    const currentFlowId = this.props.currentFlowId
    const lowerCaseSearchString = this.state.searchString.toLowerCase()

    const display = this.props.display
    let flowListStyle = {}
    if (display === 'LIST') {
      flowListStyle['flexDirection'] = 'column'
    } else {
      flowListStyle['flexWrap'] = 'wrap'
    }

    let gridIconStyle = {}
    let listIconStyle = {}
    if (display === 'LIST') {
      listIconStyle['backgroundColor'] = 'rgba(0, 0, 0, 0.05)'
    } else {
      gridIconStyle['backgroundColor'] = 'rgba(0, 0, 0, 0.05)'
    }

    let filteredFlows = []
    let currentFlow

    if (
      standbyWindows !== undefined &&
      Object.keys(standbyWindows).length > 0
    ) {
      if ("standby".includes(lowerCaseSearchString)) {
        filteredFlows.push({
          standby: true,
          windows: standbyWindows,
        })
      } else {
        let skip = true
        Object.keys(standbyWindows).forEach(windowId => {
          let w = standbyWindows[windowId]
          if (w === undefined || !('tabs' in w)) {
            return
          }
          w.tabs.forEach(tab => {
            if (
              tab['title'].toLowerCase().includes(lowerCaseSearchString) ||
              tab['url'].toLowerCase().includes(lowerCaseSearchString)
            ) {
              skip = false
            }
          })
        })
        if (!skip) {
          filteredFlows.push({
            standby: true,
            windows: standbyWindows,
          })
        }
      }
    }

    flows.forEach((flow, index) => {
      if (flow['id'] === currentFlowId) {
        currentFlow = flow
        return
      }

      if (!flow['objective'].toLowerCase().includes(lowerCaseSearchString)) {
        let windows = flow['windows']
        if (windows === undefined) {
          return
        }
        let skip = true
        Object.keys(windows).forEach(windowId => {
          let w = windows[windowId]
          if (w === undefined || !('tabs' in w)) {
            return
          }
          w.tabs.forEach(tab => {
            if (
              tab['title'].toLowerCase().includes(lowerCaseSearchString) ||
              tab['url'].toLowerCase().includes(lowerCaseSearchString)
            ) {
              skip = false
            }
          })
        })
        if (skip) {
          return
        }
      }

      filteredFlows.push(flow)
    })

    if (filteredFlows.length === 0) {
      flowListStyle['justifyContent'] = 'center'
    }

    let tabIndex = 2
    let input

    return (
      <div style={{ display: 'flex', overflow: 'scroll', paddingRight: '5px' }}>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <div style={{ marginRight: '15px' }}>
            <div className="search-bar-container">
              <SearchIcon
                className="search-icon"
                id='search-flow-icon'
                onClick={e => {
                  
                }}
              />
              <form
                style={{ flexGrow: 1 }}
                onSubmit={e => {
                  e.preventDefault()
                  this.enterFirstFlow()
                  this.setState({searchString: ''})
                  input.value=''
                  this.logSearch()
                }}
              >
                <input
                  id="flow-search"
                  tabIndex={1}
                  ref={node => (input = node)}
                  placeholder={"Search Flow..."}
                  className="flow-search"
                  onChange={e => {
                    // @TODO log search
                    this.setState({searchString: input.value})
                    let flowListContainer = document.getElementById('flow-list-container')
                    flowListContainer.scrollTop = 0
                    this.debouncedLogSearch()
                  }}
                  onKeyDown={e => {
                    if (e.key === 'ArrowDown') {
                      let element = document.getElementById("flow-bundle-2")
                      if (element === undefined || element === null) {
                        element =
                          document.getElementById("create-flow-button-objective-question")
                      }
                      if (element !== undefined && element !== null) {
                        element.focus()
                      }
                    }
                  }}
                  autoComplete="off"
                />
              </form>
              <GridIcon
                className="grid-icon"
                style={gridIconStyle}
                onClick={e => {
                  this.props.dispatch(setFlowDisplay(FlowDisplay.GRID))
                }}
              />
              <ListIcon
                className="list-icon"
                style={listIconStyle}
                onClick={e => {
                  this.props.dispatch(setFlowDisplay(FlowDisplay.LIST))
                }}
              />
            </div>
            <div
              id="flow-list-container"
              className="flow-list-container"
              style={flowListStyle}
            >
              {filteredFlows.map((flowEntry, flowIndex) => {
                if (flowEntry.standby === true) {
                  return (
                    <StandbyBundle
                      key={-2}
                      windows={standbyWindows}
                      searchString={lowerCaseSearchString}
                      display={display}
                    />
                  )
                }

                let notes = ""
                if ('journal' in flowEntry && 'notes' in flowEntry.journal) {
                  notes = flowEntry.journal.notes
                }

                return (
                  <TabBundle
                    key={flowEntry['id']}
                    display={display}
                    tabIndex={tabIndex++}
                    flowId={flowEntry['id']}
                    title={flowEntry['objective']}
                    windows={flowEntry['windows']}
                    stats={flowEntry['stats']}
                    notes={notes}
                    onToggleFlowCallback={() => {
                      this.setState({searchString: ''})
                      input.value=''
                    }}
                    searchString={lowerCaseSearchString}
                  />
              )})}
              {filteredFlows.length === 0 &&
                <img
                  src={noFlowsHere}
                  className="no-flows-image"
                  alt=""
                />
              }
            </div>
          </div>
          {currentFlow !== undefined
            ?
              <TabBundle
                tabIndex={tabIndex++}
                flowId={currentFlow['id']}
                title={currentFlow['objective']}
                windows={this.state.currentWindows}
                stats={currentFlow['stats']}
                notes={
                  'journal' in currentFlow && 'notes' in currentFlow.journal
                    ? currentFlow['journal']['notes']
                    : ""
                }
                onToggleFlowCallback={() => {
                  this.setState({searchString: ''})
                  input.value=''
                }}
                searchString={lowerCaseSearchString}
              />
            :
              <CurrentTabList
                windows={this.state.currentWindows}
                searchString={lowerCaseSearchString}
              />
          }
        </DragDropContext>
      </div>
    )
  }

  render() {
    return (
      !this.state.loading
        ?
          <div className="product-container">
            <ControlMenu />
            {this.state.hasTabPermissions
              ? this.renderBundleView()
              :
                <TabPermissionModal
                  onFinish={granted => this.setState({hasTabPermissions: granted})}
                />
            }
          </div>
        :
          <div className="product-container">
            <Spinner animation="border" variant="primary" />
          </div>
    )
  }
}

FlowList.propTypes = {
  finishLoading: PropTypes.func.isRequired,
  flows: PropTypes.array.isRequired,
  currentFlowId: PropTypes.number.isRequired,
  standbyWindows: PropTypes.object.isRequired,
  display: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { journal, appConfig } = state
  const { flows, currentFlowId, standbyWindows } = journal ||
  {
    flows: [],
    currentFlowId: undefined,
    standbyWindows: {},
  }
  const { flowDisplay } = appConfig ||
  {
    flowDisplay: FlowDisplay.GRID,
  }
  const display = flowDisplay !== undefined ? flowDisplay : FlowDisplay.GRID

  const filteredFlows = _.cloneDeep(flows.filter(flow => !flow['hidden']))
  filteredFlows.sort((a, b) => b['updatedAt'] - a['updatedAt'])

  return {
    flows: filteredFlows,
    currentFlowId,
    standbyWindows,
    display,
  }
}

export default connect(mapStateToProps)(FlowList)