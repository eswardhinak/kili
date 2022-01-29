const logging = (state = { focusSessionId: undefined }, action) => {
  switch (action.type) {
    case 'SET_FLOW_SESSION_ID':
      return Object.assign({}, state, {
        focusSessionId: action.sessionId
      })
    default:
      return state
  }
}

export default logging