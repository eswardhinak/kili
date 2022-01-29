const background = (
  state = {
    backgroundImage: undefined,
    imageGroup: undefined,
  },
  action) =>
{
  switch (action.type) {
    case 'SET_BACKGROUND':
      return Object.assign({}, state, {
        backgroundImage: action.backgroundImage,
        imageGroup: action.imageGroup
      })
    default:
      return state
  }
}

export default background