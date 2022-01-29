import { AppMode, AppTheme, FlowDisplay } from "../actions"

const appConfig = (
  state = {
    mode: AppMode.LOADING,
    theme: AppTheme.BACKGROUNDS,
    activeTour: false,
    showStandbyReminder: true,
    showShareFlowReminder: true,
    flowDisplay: FlowDisplay.GRID,
  },
  action) =>
{
  switch (action.type) {
    case 'SET_APP_MODE':
      return Object.assign({}, state, {
        mode: action.mode,
      })
    case 'SET_APP_THEME':
      return Object.assign({}, state, {
        theme: action.theme,
      })
    case 'SET_ACTIVE_TOUR':
      return Object.assign({}, state, {
        activeTour: action.activeTour,
      })
    case 'DISABLE_STANDBY_REMINDER': {
      return Object.assign({}, state, {
        showStandbyReminder: false,
      })
    }
    case 'DISABLE_SHARE_FLOW_REMINDER': {
      return Object.assign({}, state, {
        showShareFlowReminder: false,
      })
    }
    case 'SET_FLOW_DISPLAY': {
      return Object.assign({}, state, {
        flowDisplay: action.display,
      })
    }
    default:
      return state
  }
}

export default appConfig