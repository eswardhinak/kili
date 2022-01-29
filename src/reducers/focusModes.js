const focusModes = (
  state = {
    preFocusModeTabs: {}, 
  },
  action) =>
{
  switch (action.type) {
    case 'SAVE_STANDBY_TABS':
      var tabsToSave = action.tabsToSave
      var existingTabs = state.preFocusModeTabs
      Object.keys(tabsToSave).map((windowId, index) => {
        if (!(windowId in existingTabs)) {
          existingTabs[windowId] = {}
        }
        Object.keys(tabsToSave[windowId]).map((tabId, index) => {
          existingTabs[windowId][tabId] = tabsToSave[windowId][tabId]
          return null
        })
        return null
      })
      return Object.assign({}, state, {
        ...state,
        preFocusModeTabs: existingTabs
      })
    case 'CLEAR_STANDBY_TABS':
      return Object.assign({}, state, {
        ...state,
        preFocusModeTabs: {}
      })
    default:
      return state
  }
}

export default focusModes

