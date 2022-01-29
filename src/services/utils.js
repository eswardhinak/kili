/*global chrome*/

import React from 'react'
import { Text } from 'evergreen-ui'
import { Slide, toast } from 'react-toastify'

import { FONT } from './constants'

export const openTabs = (windows, forceNewWindow=false) => {
  let windowCount = 0
  let tabCount = 0
  if (windows !== undefined) {
    let updateDelayCounter = 1
    Object.keys(windows).forEach(windowId => {
      let windowInfo = {}
      const metaData = windows[windowId].metaData
      if (metaData !== undefined) {
        if ('state' in metaData && metaData['state'] !== 'normal') {
          windowInfo['state'] = metaData['state']
        } else {
          if ('location' in metaData) {
            windowInfo['top'] = metaData['location']['top']
            windowInfo['left'] = metaData['location']['left']
          }
          if ('size' in metaData) {
            windowInfo['width'] = metaData['size']['width']
            windowInfo['height'] = metaData['size']['height']
          }
          windowInfo['focused'] = windowCount === 0
        }
      }

      let tabsToOpen = windows[windowId].tabs
      tabCount = tabsToOpen.length
      if (windowCount !== 0 || forceNewWindow) {
        chrome.windows.create(windowInfo, thisWindow => {
          slideTabsIntoWindow(tabsToOpen, thisWindow.id)
          if ('state' in windowInfo) {
            let windowState = windowInfo['state']
            if (windowState === 'fullscreen' || windowState === 'maximized') {
              setTimeout(
                () => chrome.windows.update(thisWindow.id, {state: windowState}), 
                (updateDelayCounter++)*1500,
              )
            }
          }
        })
      } else {
        chrome.windows.update(
          chrome.windows.WINDOW_ID_CURRENT,
          windowInfo,
          _thisWindow => {
            slideTabsIntoWindow(tabsToOpen)
          }
        )
      }
      windowCount++
    })
  }
  return {
    windowCount: windowCount,
    tabCount: tabCount,
  }
}

const slideTabsIntoWindow = (tabs, windowId=undefined) => {
  tabs.forEach(tab => {
    chrome.tabs.create({
      url: tab.url,
      active: false,
      windowId: windowId,
      pinned: tab.pinned,
    })
  })
}

export const saveWindows = (windowsArray, closeTabs=false, noFilter=false) => {
  let windowCount = 0
  let tabCount = 0
  let windows = {}
  let anyTabLoading = false
  windowsArray.forEach((currentWindow, index) => {
    windowCount++
    let openTabs = []
    const windowFocused = currentWindow.focused
    currentWindow.tabs.forEach((tab, index) => {
      if (tab.status === "loading") {
        anyTabLoading = true
      }
      tabCount++
      if (noFilter || !(windowFocused && tab.active)) {
        if (noFilter || !(tab.url === "chrome://newtab/")) {
          openTabs.push({
            tabId: tab.id,
            favIconUrl:tab.favIconUrl,
            url: tab.url,
            title: tab.title,
            pinned: tab.pinned,
          })
        }
        if (closeTabs) {
          chrome.tabs.remove(tab.id)
        }
      }
    })

    if (openTabs.length > 0) {
      windows[currentWindow.id] = {
        tabs: openTabs,
        metaData: {
          state: currentWindow.state,
          location: {
            top: currentWindow.top,
            left: currentWindow.left,
          },
          size: {
            width: currentWindow.width,
            height: currentWindow.height,
          },
        },
      }
    }
  })
  return {
    windows: windows,
    loggingData: {
      windowCount: windowCount,
      tabCount: tabCount,
    },
    overwriteTabs: !anyTabLoading,
  }
}

export const closeTab = (tabId) => {
  chrome.tabs.remove(tabId)
}

export const createTab = (windowId, tabIndex, tabUrl) => {
  chrome.tabs.create({
    active: false,
    windowId: parseInt(windowId, 10),
    index: tabIndex,
    url: tabUrl,
  })
}

export const moveTab = (tabId, newWindowId, newTabIndex) => {
  chrome.tabs.move(
    tabId,
    {
      index: newTabIndex,
      windowId: parseInt(newWindowId, 10),
    },
  )
}

export const createSharedFlow = (userId, flowId, flowName, links) => {
  const shareFlowUrl = process.env.REACT_APP_SHARE_FLOW_URL
  fetch(
    shareFlowUrl,
    {
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify({
        userId: userId,
        flowId: flowId,
        flowName: flowName,
        links: JSON.stringify(links),
      })
    }
  )
  .then(response => response.json())
  .then(body => {
    if (body.length > 0) {
      const bodyData = body[0]
      const url = "https://www.shareflow.app/?id=" + bodyData.id
      navigator.clipboard.writeText(url)
      generateToast('Copied ' + url + ' to clipboard!')
    }
  })
  .catch(err => {
    // @TODO: log this in Sentry?
  })
}

export const generateToast = (content) => {
  const notifContent = (
    <Text
      color="white"
      fontFamily={FONT}
      marginRight={5}
      size={500}
    >
      {content}
    </Text>
  )
  toast(notifContent, {
    position: 'top-center',
    autoClose: true,
    closeOnClick: true,
    type: 'info',
    transition: Slide,
  })
}

export const debounce = (func, wait) => {
  let timeout

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait)
  }
}