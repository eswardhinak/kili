const login = (state = { 
    completedTour: false,
    canceledTour: false,
    amplitudeId: undefined,
    showPinExtensionIconNudge: true,
    dismissedWhatsNew: 0,
    dismissedSurvey: 0,
  }, action) => {
  switch (action.type) {
    case 'SET_COMPLETED_TOUR':
      return Object.assign({}, state, {
        ...state,
        completedTour: action.completed,
      })
    case 'SET_CANCELED_TOUR':
      return Object.assign({}, state, {
        ...state,
        canceledTour: action.canceled,
      })
    case 'SET_AMPLITUDE_ID':
      return Object.assign({}, state, {
        ...state,
        amplitudeId: action.amplitudeId,
      })
    case 'DISMISS_PIN_EXTENSION_ICON_NUDGE': {
      return Object.assign({}, state, {
        showPinExtensionIconNudge: false
      })
    }
    case 'SET_DISMISSED_WHATS_NEW': {
      return Object.assign({}, state, {
        dismissedWhatsNew: (new Date()).getTime(),
      })
    }
    case 'SET_DISMISSED_SURVEY': {
      return Object.assign({}, state, {
        dismissedSurvey: (new Date()).getTime(),
      })
    }
    default:
      return state
  }
}

export default login