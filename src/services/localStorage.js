/*global chrome*/

import _ from "lodash"

import {
  sendAmplitudeData,
  setAmplitudeUserID,
} from './amplitude'

/* new loadState function that uses chrome.storage.local */
// export const loadState = async () => {
//   return new Promise((resolve, reject) => {
//     chrome.storage.local.get(['state'], function(result) {
//       try {
//         const serializedState = result.state
//         if (serializedState === null) {
//           resolve(undefined);
//         }
//         let curState = serializedState;
//         let modifiableCurState = _.cloneDeep(curState)
//         try {
//           resolve(runMigrations(modifiableCurState))
//         } catch (err) {
//           resolve(curState)
//         }
//       } catch (err) {
//         resolve(undefined);
//       }
//     })
//   })
// };

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    let curState = JSON.parse(serializedState);
    let modifiableCurState = _.cloneDeep(curState)

    try {
      return runMigrations(modifiableCurState)
    } catch (err) {
      return curState
    }
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
    chrome.storage.local.set({ 'state': state })
    chrome.storage.local.remove('backup_journal')
  } catch {
    // ignore write errors
  }
};

const copySavedTabsToWindows = (curState) => {
  if (!('journal' in curState) || curState['journal'] === undefined) {
    return curState
  }

  let journal = curState['journal']
  const flows = journal['flows']
  if (flows === undefined) {
    return curState
  }

  let flowsWithWindows = flows.map((flow, index) => {
    if (flow === undefined) {
      return flow
    }

    let savedTabs = flow['savedTabs']
    if (savedTabs === undefined) {
      return flow
    }
    if ('windows' in flow) {
      return flow
    }

    let windowData = {}
    Object.keys(savedTabs).forEach((windowId, index) => {
      let metaData = {}
      let tabs = []
      Object.keys(savedTabs[windowId]).forEach((tabId, index) => {
        if (tabId === 'metaData') {
          metaData = savedTabs[windowId][tabId]
        } else {
          tabs.push({
            ...savedTabs[windowId][tabId],
            tabId: index,
          })
        }
      })
      windowData[windowId] = {
        metaData: metaData,
        tabs: tabs,
      }
    })

    return {
      ...flow,
      windows: windowData,
    }
  })
  curState['journal']['flows'] = flowsWithWindows

  chrome.storage.local.get(['migration_log'], function(result) {
    let migrationLog = result.migration_log
    let logData = false

    if (migrationLog === undefined) {
      migrationLog = { savedTabsToWindows_1220: true }
      logData = true
    } else {
      if (!('savedTabsToWindows_1220' in migrationLog)) {
        migrationLog['savedTabsToWindows_1220'] = true
        logData = true
      }
    }

    if (logData) {
      const amplitudeId = curState['login']['amplitudeId']
      setAmplitudeUserID(amplitudeId)
      sendAmplitudeData('Migration - savedTabs to windows')

      chrome.storage.local.set({'migration_log': migrationLog})
    }
  })

  return curState
}

const copyPrefocusToStandby = (curState) => {
  if (
    !('journal' in curState) ||
    curState['journal'] === undefined ||
    !('focusModes' in curState) ||
    curState['focusModes'] === undefined
  ) {
    return curState
  }

  if ('standbyWindows' in curState['journal']) {
    return curState
  }

  let focusModes = curState['focusModes']
  const preFocusModeTabs = focusModes['preFocusModeTabs']
  if (preFocusModeTabs === undefined) {
    return curState
  }

  let standbyWindows = Object.keys(preFocusModeTabs).map((windowId, index) => {
    let metaData = {}
    let tabs = []
    Object.keys(preFocusModeTabs[windowId]).forEach((tabId, index) => {
      if (tabId === 'metaData') {
        metaData = preFocusModeTabs[windowId][tabId]
      } else {
        tabs.push({
          ...preFocusModeTabs[windowId][tabId],
          tabId: index,
        })
      }
    })
    return {
      metaData: metaData,
      tabs: tabs,
    }
  })
  curState['journal']['standbyWindows'] = standbyWindows

  chrome.storage.local.get(['migration_log'], function(result) {
    let migrationLog = result.migration_log
    let logData = false

    if (migrationLog === undefined) {
      migrationLog = { prefocusToStandby_1220: true }
      logData = true
    } else {
      if (!('prefocusToStandby_1220' in migrationLog)) {
        migrationLog['prefocusToStandby_1220'] = true
        logData = true
      }
    }

    if (logData) {
      const amplitudeId = curState['login']['amplitudeId']
      setAmplitudeUserID(amplitudeId)
      sendAmplitudeData('Migration - preFocus to standbyWindows')

      chrome.storage.local.set({'migration_log': migrationLog})
    }
  })

  return curState
}

const runMigrations = (curState) => {
  curState = copySavedTabsToWindows(curState)
  curState = copyPrefocusToStandby(curState)
  return curState
}