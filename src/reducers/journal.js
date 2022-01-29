import _ from "lodash"
import { demoFlows } from './demoObjects'

/* 
  flows = [
    {
      id: 0,
      objective: 'Fix Things',
      createdAt: 1338957589,
      updatedAt: 1489384988,
      hidden: false,
      savedTabs: {
        windowId1: {
          0: {
            url: 'https://google.com',
            faviconUrl: 'https://google.com/favicon.png',
            title: 'Google Search'
          }
          1: {
            url: 'https://reddit.com',
            faviconUrl: 'https://reddit.com/favicon.png',
            title: 'Reddit - Homepage of the Web'
          }
        },
        windowId2: {
          0: {
            url: 'https://google.com',
            faviconUrl: 'https://google.com/favicon.png',
            title: 'Google Search'
          }
        }
      },
      windows: {
        windowId1: {
          metaData: {
            // size, orientation, fullscreen, etc
          },
          tabs: [
            {
              url: 'https://google.com',
              faviconUrl: 'https://google.com/favicon.png',
              title: 'Google Search',
              tabId: 4 // for use if currently open
            },
            {
              url: 'https://reddit.com',
              faviconUrl: 'https://reddit.com/favicon.png',
              title: 'Reddit - Homepage of the Web',
              tabId: 6 // for use if currently open
            }
          ]
        },
        windowId2: {
          0: {
            url: 'https://google.com',
            faviconUrl: 'https://google.com/favicon.png',
            title: 'Google Search'
          }
        }
      }
    },
    {....}
  ]
   
*/

const journal = (
  state = {
    flows: demoFlows,
    currentFlowId: undefined,
    standbyWindows: {},
  },
  action) =>
{
  let existingFlows = state.flows
  let existingStandbyWindows = state.standbyWindows

  let date = new Date()
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)

  let pastDays = {}
  let currentTime, newFlow, flowId, objective, copyExistingFlows, stats, copyStandbyWindows

  let existingKeys
  let candidateKey = 11 // arbitrary starting point that is likely to hit right away

  let moveFrom, moveTo, moveFromWindows, moveToWindows

  switch (action.type) {
    case 'UPDATE_JOURNAL_ENTRY':
      flowId = action.flowId
      if (
        flowId === undefined ||
        !(flowId in existingFlows) ||
        existingFlows[flowId] === undefined
      ) {
        //@TODO log error
        return state
      }

      existingFlows[flowId]['journal'] = action.journalEntry

      return Object.assign({}, state, {
        ...state,
        flows: existingFlows,
      })
    case 'CREATE_FLOW':
      currentTime = (new Date()).getTime()
      flowId = existingFlows.length
      objective = action.objective
      if (action.objective === undefined) {
        objective = 'Untitled Flow'
      }

      pastDays[date] = 0
      newFlow = {
        id: flowId,
        objective: objective,
        windows: action.windows,
        createdAt: currentTime,
        updatedAt: currentTime,
        hidden: false,
        journal: {
          notes: '',
          updatedAt: currentTime,
        },
        stats: {
          lastEntered: action.enterFlow ? currentTime : undefined,
          lastEnded: undefined,
          timeSpent: {
            aggregate: 0,
            pastDays: pastDays,
          },
          timesEntered: 0,
        }
      }
      existingFlows.push(newFlow)

      let newState = {
        ...state,
        flows: existingFlows,
      }
      if (action.enterFlow === true) {
        newState['currentFlowId'] = flowId
      }
      return Object.assign({}, state, newState)
    case 'ENTER_FLOW':
      flowId = action.flowId
      if (
        flowId === undefined ||
        !(flowId in existingFlows) ||
        existingFlows[flowId] === undefined
      ) {
        //@TODO log error
        return state
      }

      currentTime = (new Date()).getTime()
      existingFlows[flowId]['updatedAt'] = currentTime
      existingFlows[flowId]['hidden'] = false

      stats = existingFlows[flowId]['stats']
      if (stats === undefined) {
        pastDays[date] = 0
        stats = {
          lastEntered: currentTime,
          lastEnded: undefined,
          timeSpent: {
            aggregate: 0,
            pastDays: pastDays,
          },
          timesEntered: 1,
        }
      } else {
        stats['lastEntered'] = currentTime
        stats['timesEntered']++
      }
      existingFlows[flowId]['stats'] = stats

      return Object.assign({}, state, {
        ...state,
        flows: existingFlows,
        currentFlowId: flowId,
      })
    case 'END_FLOW':
      flowId = action.flowId
      if (
        flowId === undefined ||
        !(flowId in existingFlows) ||
        existingFlows[flowId] === undefined
      ) {
        //@TODO log error
        return state
      }

      if (action.overwriteTabs) {
        existingFlows[flowId]['windows'] = action.windows
      }
      currentTime = (new Date()).getTime()
      existingFlows[flowId]['updatedAt'] = currentTime

      stats = existingFlows[flowId]['stats']
      if (stats !== undefined) {
        stats['lastEnded'] = currentTime

        let lastEntered = existingFlows[flowId]['stats']['lastEntered']
        let timeToAdd = (currentTime - lastEntered)
        let timeSpent = stats['timeSpent']

        timeSpent['aggregate'] += timeToAdd
        if (date in timeSpent['pastDays']) {
          timeSpent['pastDays'][date] += timeToAdd
        } else {
          timeSpent['pastDays'][date] = timeToAdd
          // TODO consider deleting old entries past a certain point
        }

        stats['timeSpent'] = timeSpent
        existingFlows[flowId]['stats'] = stats
      }

      existingFlows[flowId]['hidden'] = false

      return Object.assign({}, state, {
        ...state,
        flows: existingFlows,
        currentFlowId: undefined,
      })
    case 'EDIT_FLOW_OBJECTIVE':
      flowId = action.flowId
      if (
        flowId === undefined ||
        !(flowId in existingFlows) ||
        existingFlows[flowId] === undefined
      ) {
        //@TODO log error
        return state
      }

      existingFlows[flowId]['objective'] = action.newObjective
      existingFlows[flowId]['hidden'] = false

      return Object.assign({}, state, {
        ...state,
        flows: existingFlows,
      })
    case 'DELETE_FLOW':
      flowId = action.flowId
      if (
        flowId === undefined ||
        !(flowId in existingFlows) ||
        existingFlows[flowId] === undefined
      ) {
        //@TODO log error
        return state
      }

      existingFlows[flowId]['updatedAt'] = (new Date()).getTime()
      existingFlows[flowId]['hidden'] = true
      copyExistingFlows = _.cloneDeep(existingFlows)

      return Object.assign({}, state, {
        ...state,
        flows: copyExistingFlows,
      })
    case 'UPDATE_FLOW_TABS':
      flowId = action.flowId
      if (
        flowId === undefined ||
        !(flowId in existingFlows) ||
        existingFlows[flowId] === undefined
      ) {
        //@TODO log error
        return state
      }

      existingFlows[flowId]['windows'] = action.windows
      existingFlows[flowId]['updatedAt'] = (new Date()).getTime()
      existingFlows[flowId]['hidden'] = false

      return Object.assign({}, state, {
        ...state,
        flows: existingFlows,
      })
    case 'ADD_LINK_TO_FLOW':
      flowId = action.flowId

      if (flowId == -2) {
        copyStandbyWindows = _.cloneDeep(existingStandbyWindows)
        copyStandbyWindows[action.windowId].tabs.splice(action.tabIndex, 0, action.tab)

        return Object.assign({}, state, {
          ...state,
          standbyWindows: copyStandbyWindows,
        })
      }

      if (
        flowId === undefined ||
        !(flowId in existingFlows) ||
        existingFlows[flowId] === undefined
      ) {
        //@TODO log error
        return state
      }

      copyExistingFlows = _.cloneDeep(existingFlows)

      if (action.windowId == -1) {
        copyExistingFlows[flowId]['windows'] = {
          0: {
            metaData: {},
            tabs: [action.tab]
          },
        }
      } else {
        copyExistingFlows[flowId]['windows'][action.windowId].tabs.splice(action.tabIndex, 0, action.tab)
      }

      return Object.assign({}, state, {
        ...state,
        flows: copyExistingFlows,
      })
    case 'ADD_WINDOW_TO_FLOW':
      flowId = action.flowId

      if (flowId == -2) {
        copyStandbyWindows = _.cloneDeep(existingStandbyWindows)
        existingKeys = Object.keys(copyStandbyWindows)
        while (existingKeys.includes(candidateKey.toString())) {
          candidateKey++
        }
        copyStandbyWindows[candidateKey] = action.window

        return Object.assign({}, state, {
          ...state,
          standbyWindows: copyStandbyWindows,
        })
      }

      if (
        flowId === undefined ||
        !(flowId in existingFlows) ||
        existingFlows[flowId] === undefined
      ) {
        //@TODO log error
        return state
      }

      copyExistingFlows = _.cloneDeep(existingFlows)

      existingKeys = Object.keys(copyExistingFlows[flowId]['windows'])
      while (existingKeys.includes(candidateKey.toString())) {
        candidateKey++
      }
      copyExistingFlows[flowId]['windows'][candidateKey] = action.window

      return Object.assign({}, state, {
        ...state,
        flows: copyExistingFlows,
      })
    case 'DELETE_LINK_FROM_FLOW':
      flowId = action.flowId

      if (flowId == -2) {
        copyStandbyWindows = _.cloneDeep(existingStandbyWindows)
        copyStandbyWindows[action.windowId].tabs.splice(action.tabIndex, 1)
        if (copyStandbyWindows[action.windowId].tabs.length === 0) {
          delete copyStandbyWindows[action.windowId]
        }

        return Object.assign({}, state, {
          ...state,
          standbyWindows: copyStandbyWindows,
        })
      }

      if (
        flowId === undefined ||
        !(flowId in existingFlows) ||
        existingFlows[flowId] === undefined
      ) {
        //@TODO log error
        return state
      }

      copyExistingFlows = _.cloneDeep(existingFlows)
      copyExistingFlows[flowId]['windows'][action.windowId].tabs.splice(action.tabIndex, 1)
      if (copyExistingFlows[flowId]['windows'][action.windowId].tabs.length === 0) {
        delete copyExistingFlows[flowId]['windows'][action.windowId]
      }

      return Object.assign({}, state, {
        ...state,
        flows: copyExistingFlows,
      })
    case 'DELETE_WINDOW_FROM_FLOW':
      flowId = action.flowId

      if (flowId == -2) {
        copyStandbyWindows = _.cloneDeep(existingStandbyWindows)
        Object.keys(copyStandbyWindows).forEach((windowId, windowIndex) => {
          if (action.windowIndex === windowIndex) {
            delete copyStandbyWindows[windowId]
          }
        })

        return Object.assign({}, state, {
          ...state,
          standbyWindows: copyStandbyWindows,
        })
      }

      if (
        flowId === undefined ||
        !(flowId in existingFlows) ||
        existingFlows[flowId] === undefined
      ) {
        //@TODO log error
        return state
      }

      copyExistingFlows = _.cloneDeep(existingFlows)
      Object.keys(copyExistingFlows[flowId]['windows']).forEach((windowId, windowIndex) => {
        if (action.windowIndex === windowIndex) {
          delete copyExistingFlows[flowId]['windows'][windowId]
        }
      })

      return Object.assign({}, state, {
        ...state,
        flows: copyExistingFlows,
      })
    case 'MOVE_FLOW_LINK':
      moveFrom = action.moveFrom
      moveTo = action.moveTo

      copyExistingFlows = _.cloneDeep(existingFlows)
      copyStandbyWindows = _.cloneDeep(existingStandbyWindows)

      if (moveFrom.flowId != -2) {
        moveFromWindows = copyExistingFlows[moveFrom.flowId]['windows']
      } else {
        moveFromWindows = copyStandbyWindows
      }

      if (moveTo.flowId != -2) {
        moveToWindows = copyExistingFlows[moveTo.flowId]['windows']
      } else {
        moveToWindows = copyStandbyWindows
      }

      let [removedTab] = moveFromWindows[moveFrom.windowId].tabs.splice(moveFrom.tabIndex, 1)

      if (moveTo.windowId == -1) {
        moveToWindows[0] = {
          metaData: {},
          tabs: [removedTab],
        }
      } else {
        moveToWindows[moveTo.windowId].tabs.splice(moveTo.tabIndex, 0, removedTab)
      }

      if (moveFromWindows[moveFrom.windowId].tabs.length === 0) {
        delete moveFromWindows[moveFrom.windowId]
      }

      return Object.assign({}, state, {
        ...state,
        flows: copyExistingFlows,
        standbyWindows: copyStandbyWindows,
      })
    case 'MOVE_FLOW_WINDOW':
      moveFrom = action.moveFrom
      moveTo = action.moveTo

      copyExistingFlows = _.cloneDeep(existingFlows)
      copyStandbyWindows = _.cloneDeep(existingStandbyWindows)

      if (moveFrom.flowId != -2) {
        moveFromWindows = copyExistingFlows[moveFrom.flowId]['windows']
      } else {
        moveFromWindows = copyStandbyWindows
      }

      if (moveTo.flowId != -2) {
        moveToWindows = copyExistingFlows[moveTo.flowId]['windows']
      } else {
        moveToWindows = copyStandbyWindows
      }

      let windowToMove, windowIdToRemove
      Object.keys(moveFromWindows).forEach((windowId, windowIndex) => {
        if (moveFrom.windowIndex === windowIndex) {
          windowIdToRemove = windowId
          windowToMove = moveFromWindows[windowId]
        }
      })
      if (windowToMove === undefined) {
        return
      }

      existingKeys = Object.keys(moveToWindows)
      while (existingKeys.includes(candidateKey.toString())) {
        candidateKey++
      }
      moveToWindows[candidateKey] = windowToMove

      if (windowIdToRemove !== undefined) {
        delete moveFromWindows[windowIdToRemove]
      }

      return Object.assign({}, state, {
        ...state,
        flows: copyExistingFlows,
        standbyWindows: copyStandbyWindows,
      })
    case 'SAVE_STANDBY_WINDOWS':
      return Object.assign({}, state, {
        ...state,
        standbyWindows: action.windows,
      })
    case 'CLEAR_STANDBY_WINDOWS':
      return Object.assign({}, state, {
        ...state,
        standbyWindows: {},
      })
    default:
      return state
  }
}

export default journal