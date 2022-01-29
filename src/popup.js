/*global chrome*/
import {
  initAmplitude,
  sendAmplitudeData,
  setAmplitudeUserID,
} from './services/amplitude'

document.addEventListener('DOMContentLoaded', function() {
  initAmplitude()
  const serializedState = localStorage.getItem('state')
  let curState = JSON.parse(serializedState)
  if (
    'login' in curState &&
    curState['login'] !== undefined &&
    'amplitudeId' in curState['login']
  ) {
    const amplitudeId = curState['login']['amplitudeId']
    setAmplitudeUserID(amplitudeId)
    sendAmplitudeData('Extension Popup - Go to New Tab')
  } else {
    sendAmplitudeData('Extension Popup - Go to New Tab', {
      'Error': 'amplitudeId is not set in state',
    })
  }

  chrome.tabs.create({})
});