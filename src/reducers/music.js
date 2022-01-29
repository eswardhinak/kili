const music = (
  state = {
    tabId: undefined,
    link: undefined
  },
  action) =>
{
  switch (action.type) {
    case 'SET_MUSIC_INFO':
      return Object.assign({}, state, {
        tabId: action.tabId,
        link: action.link
      })
    default:
      return state
  }
}

export default music