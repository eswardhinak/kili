/*global chrome*/

import { 
  sendAmplitudeData,
  setAmplitudeUserProperties,
  setAmplitudeUserID,
} from '../services/amplitude'
import { 
  openTabs,
  saveWindows,
} from '../services/utils'

/*
 * action types
 */
export const SET_APP_MODE = 'SET_APP_MODE'
export const SET_APP_THEME = 'SET_APP_THEME'
export const SET_ACTIVE_TOUR = 'SET_ACTIVE_TOUR'
export const SET_CANCELED_TOUR = 'SET_CANCELED_TOUR'
export const SET_COMPLETED_TOUR = 'SET_COMPLETED_TOUR'
export const DISMISS_PIN_EXTENSION_ICON_NUDGE = 'DISMISS_PIN_EXTENSION_ICON_NUDGE'
export const SET_DISMISSED_WHATS_NEW = 'SET_DISMISSED_WHATS_NEW'
export const SET_DISMISSED_SURVEY = 'SET_DISMISSED_SURVEY'
export const DISABLE_STANDBY_REMINDER = 'DISABLE_STANDBY_REMINDER'
export const DISABLE_SHARE_FLOW_REMINDER = 'DISABLE_SHARE_FLOW_REMINDER'
export const SET_FLOW_DISPLAY = 'SET_FLOW_DISPLAY'

export const SET_MUSIC_INFO = 'SET_MUSIC_INFO'
export const SET_ENABLED_TAB_ASSISTANT = 'SET_ENABLED_TAB_ASSISTANT'

export const COMPLETE_LOGIN = 'COMPLETE_LOGIN'
export const SET_AMPLITUDE_ID = 'SET_AMPLITUDE_ID'

export const SAVE_STANDBY_WINDOWS = 'SAVE_STANDBY_WINDOWS'
export const CLEAR_STANDBY_WINDOWS = 'CLEAR_STANDBY_WINDOWS'

export const CREATE_AND_ENTER_FLOW = 'CREATE_AND_ENTER_FLOW'
export const CREATE_FLOW = 'CREATE_FLOW'
export const END_FLOW = 'END_FLOW'
export const ENTER_FLOW = 'ENTER_FLOW'
export const EDIT_FLOW_OBJECTIVE = 'EDIT_FLOW_OBJECTIVE'
export const DELETE_FLOW = 'DELETE_FLOW'
export const UPDATE_FLOW_TABS = 'UPDATE_FLOW_TABS'
export const DELETE_LINK_FROM_FLOW = 'DELETE_LINK_FROM_FLOW'
export const DELETE_WINDOW_FROM_FLOW = 'DELETE_WINDOW_FROM_FLOW'
export const ADD_LINK_TO_FLOW = 'ADD_LINK_TO_FLOW'
export const ADD_WINDOW_TO_FLOW = 'ADD_WINDOW_TO_FLOW'
export const MOVE_FLOW_LINK = 'MOVE_FLOW_LINK'
export const MOVE_FLOW_WINDOW = 'MOVE_FLOW_WINDOW'
export const UPDATE_JOURNAL_ENTRY = 'UPDATE_JOURNAL_ENTRY'

export const SET_FLOW_SESSION_ID = 'SET_FLOW_SESSION_ID'

/*
 * other constants
 */
export const ImageGroup = {
  DURING_WORK: 'DURING_WORK',
  AFTER_WORK: 'AFTER_WORK',
}

export const AppMode = {
  LOADING: 'LOADING',
  SIGN_UP: 'SIGN_UP',
  HOME: 'HOME',
}

export const AppTheme = {
  BACKGROUNDS: 'BACKGROUNDS',
  TERMINAL: 'TERMINAL',
}

export const FlowDisplay = {
  GRID: 'GRID',
  LIST: 'LIST',
}

/*
 * logging action creators
*/

export function setFlowSessionId(sessionId) {
  return {
    type: SET_FLOW_SESSION_ID,
    sessionId
  }
}

/*
 * app mode action creators
 */

export function setAppMode(mode) {
  return {
    type: SET_APP_MODE,
    mode,
  }
}

function setAppThemeImpl(theme) {
  return {
    type: SET_APP_THEME,
    theme,
  }
}

export function setAppTheme(theme) {
  return dispatch => {
    sendAmplitudeData('Set App Theme', {
      'Theme': theme,
    })
    return dispatch(setAppThemeImpl(theme))
  }
}

function setFlowDisplayImpl(display) {
  return {
    type: SET_FLOW_DISPLAY,
    display,
  }
}

export function setFlowDisplay(display) {
  return dispatch => {
    sendAmplitudeData('Set Flow Display', {
      'Display': display,
    })
    return dispatch(setFlowDisplayImpl(display))
  }
}


export function dismissPinExtensionIconNudge() {
  return {
    type: DISMISS_PIN_EXTENSION_ICON_NUDGE,
  }
}

export function setDismissedWhatsNew() {
  return {
    type: SET_DISMISSED_WHATS_NEW,
  }
}

export function setDismissedSurvey() {
  return {
    type: SET_DISMISSED_SURVEY,
  }
}

export function disableStandbyReminder() {
  return {
    type: DISABLE_STANDBY_REMINDER,
  }
}

export function disableShareFlowReminder() {
  return {
    type: DISABLE_SHARE_FLOW_REMINDER,
  }
}

/*
 * flow action creators
 */

export function createAndEnterFlow(windows, objective=undefined) {
  return {
    type: CREATE_FLOW,
    windows,
    objective,
    enterFlow: true,
  }
}

export function createFlow(windows, objective=undefined) {
  return {
    type: CREATE_FLOW,
    windows,
    objective,
    enterFlow: false,
  }
}

export function enterFlowImpl(flowId) {
  return {
    type: ENTER_FLOW,
    flowId,
  }
}

export function endFlowImpl(flowId, windows, overwriteTabs=true) {
  return {
    type: END_FLOW,
    flowId,
    windows,
    overwriteTabs,
  }
}

export function editFlowObjective(flowId, newObjective) {
  return {
    type: EDIT_FLOW_OBJECTIVE,
    flowId,
    newObjective,
  }
}

export function deleteFlow(flowId) {
  return {
    type: DELETE_FLOW,
    flowId,
  }
}

export function updateFlowTabs(flowId, windows) {
  return {
    type: UPDATE_FLOW_TABS,
    flowId,
    windows,
  }
}

export function deleteLinkFromFlow(flowId, windowId, tabIndex) {
  return {
    type: DELETE_LINK_FROM_FLOW,
    flowId,
    windowId,
    tabIndex,
  }
}

export function deleteWindowFromFlow(flowId, windowIndex) {
  return {
    type: DELETE_WINDOW_FROM_FLOW,
    flowId,
    windowIndex,
  }
}

export function addLinkToFlow(flowId, windowId, tabIndex, tab) {
  return {
    type: ADD_LINK_TO_FLOW,
    flowId,
    windowId,
    tabIndex,
    tab,
  }
}

export function addWindowToFlow(flowId, window) {
  return {
    type: ADD_WINDOW_TO_FLOW,
    flowId,
    window,
  }
}

export function moveFlowLink(moveFrom, moveTo) {
  return {
    type: MOVE_FLOW_LINK,
    moveFrom,
    moveTo,
  }
}

export function moveFlowWindow(moveFrom, moveTo) {
  return {
    type: MOVE_FLOW_WINDOW,
    moveFrom,
    moveTo,
  }
}

export function enterFlow(flowId, entrypoint) {
  return (dispatch, getState) => {
    const currentFlowId = getState().journal.currentFlowId
    if (flowId === undefined || flowId === currentFlowId) {
      return Promise.resolve()
    }

    chrome.windows.getAll({populate: true}, function(windowsArray) {
      let windowData = saveWindows(windowsArray, true)
      let loggingData = windowData.loggingData
      let overwriteTabs = windowData.overwriteTabs

      if (currentFlowId === undefined) {
        // Currently not in a flow, so put tabs in standby
        sendAmplitudeData('Create Standby', {
          'Window Count': loggingData['windowCount'],
          'Tab Count': loggingData['tabCount'],
        })
        dispatch(saveStandbyWindows(windowData.windows))
      } else {
        // Currently in a flow, so save tabs to that flow so we can switch flows
        sendAmplitudeData('End Flow', {
          'Flow ID': currentFlowId,
          'Reason': 'Switch Flows',
          'Flow Session Id': getState().logging.focusSessionId,
          'Window Count': loggingData['windowCount'],
          'Tab Count': loggingData['tabCount'],
        })
        dispatch(endFlowImpl(currentFlowId, windowData.windows, overwriteTabs))
      }

      dispatch(enterFlowImpl(flowId))

      // Open tabs from this flow, if any
      const flows = getState().journal.flows
      if (flowId in flows && flows[flowId] !== undefined) {
        const windows = flows[flowId]['windows']
        loggingData = openTabs(windows)
      }

      const newFlowSessionId =
        'flow-' + getState().login.amplitudeId + '-' + Date.now().toString()
      dispatch(setFlowSessionId(newFlowSessionId))
      sendAmplitudeData('Enter Flow', {
        'Flow ID': flowId,
        'Entrypoint': entrypoint,
        'Flow Session Id': newFlowSessionId,
        'Window Count': loggingData['windowCount'],
        'Tab Count': loggingData['tabCount'],
      })
    })
    return Promise.resolve()
  }
}

export function endFlow(reason, overwriteTabs=true) {
  return (dispatch, getState) => {
    const flowSessionId = getState().logging.focusSessionId
    let loggingData = {tabCount: 0, windowCount: 0}
    chrome.windows.getAll({populate: true}, function(windowsArray) {
      const windowData = saveWindows(windowsArray, true)
      loggingData = windowData.loggingData

      const endFlowId = getState().journal.currentFlowId
      dispatch(endFlowImpl(
        endFlowId,
        windowData.windows,
        overwriteTabs && windowData.overwriteTabs,
      ))

      dispatch(setAppMode(AppMode.HOME))
      dispatch(setFlowSessionId(undefined))

      sendAmplitudeData('End Flow', {
        'Flow ID': endFlowId,
        'Reason': reason,
        'Flow Session Id': flowSessionId,
        'Window Count': loggingData['windowCount'],
        'Tab Count': loggingData['tabCount'],
      })

      // reopen standby windows
      const standbyWindows = getState().journal.standbyWindows
      loggingData = openTabs(standbyWindows)
      if (loggingData['tabCount'] > 0) {
        sendAmplitudeData('Open Standby', {
          'Window Count': loggingData['windowCount'],
          'Tab Count': loggingData['tabCount'],
        })
      }
      dispatch(clearStandbyWindows())
    })
    return Promise.resolve()
  }
}

/*
 * journal action creators
 */

export function saveStandbyWindows(windows) {
  return {
    type: SAVE_STANDBY_WINDOWS,
    windows,
  }
}

export function clearStandbyWindows() {
  return {
    type: CLEAR_STANDBY_WINDOWS,
  }
}

export function updateJournalEntry(flowId, journalEntry) {
  return {
    type: UPDATE_JOURNAL_ENTRY,
    flowId,
    journalEntry,
  }
}

/*
 * login action creators
 */

export function setActiveTour(activeTour) {
  return {
    type: SET_ACTIVE_TOUR,
    activeTour
  }
}

export function setCompletedTour(completed) {
  return {
    type: SET_COMPLETED_TOUR,
    completed
  }
}

export function setCanceledTour(canceled) {
  return {
    type: SET_CANCELED_TOUR,
    canceled
  }
}

export function setAmplitudeIdImpl(amplitudeId) {
  return {
    type: SET_AMPLITUDE_ID,
    amplitudeId
  }
}

export function fetchLogin(mode) {
  return (dispatch, getState) => {
    if (mode !== AppMode.HOME) {
      if (getState().login.amplitudeId === undefined) {
        dispatch(setAppMode(AppMode.SIGN_UP))
      } else {
        dispatch(createAndSetAmplitudeUserId())
        dispatch(setAppMode(AppMode.HOME))
      }
    }

    return Promise.resolve()
  }
}

function createAndSetAmplitudeUserId() {
  return (dispatch, getState) => {
    const amplitudeId = getState().login.amplitudeId
    if (amplitudeId === undefined) {
      const amplitudeIdUrl = process.env.REACT_APP_AMPLITUDE_ID_URL
      fetch(
        amplitudeIdUrl,
        {
          mode: 'cors',
          method: 'POST',
          body: JSON.stringify({email: '', name: ''})
        }
      )
      .then(response => response.json())
      .then(body => {
        if (body.length > 0 && body[0]['id'] !== undefined) {
          let amplitudeUserId = body[0]['id']
          setAmplitudeUserID(amplitudeUserId)
          setAmplitudeUserProperties({
            'ID': amplitudeUserId,
            'App Version': process.env.REACT_APP_VERSION_NUMBER,
          })
          dispatch(setAmplitudeIdImpl(amplitudeUserId))
        }
      })
      .catch(err => {})
    } else {
      setAmplitudeUserID(amplitudeId)
      setAmplitudeUserProperties({
        'ID': amplitudeId,
        'App Version': process.env.REACT_APP_VERSION_NUMBER,
      })
    }
    return Promise.resolve()
  }
}

export function completeSignUp() {
  return dispatch => { 
    dispatch(setAppMode(AppMode.HOME))
    dispatch(createAndSetAmplitudeUserId())
      .then(function() {
        chrome.windows.getAll({populate: true}, function(windowsArray) {
          const windowData = saveWindows(windowsArray)
          const loggingData = windowData.loggingData
          sendAmplitudeData('Sign Up: Success', {
            'Window Count': loggingData['windowCount'],
            'Tab Count': loggingData['tabCount'],
          })
        })
      })
  }
}
