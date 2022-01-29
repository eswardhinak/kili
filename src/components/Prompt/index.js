import React from 'react'
import PropTypes from 'prop-types'
import { Heading } from 'evergreen-ui'
import { HEADER_FONT } from '../../services/constants'

function Prompt(props) {
  const isDarkMode =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  return (
    <div style={{ alignSelf: 'flex-start' }}>
      <Heading
        color={isDarkMode ? "white" : "black"}
        fontFamily={HEADER_FONT}
        size={900}
      >
        {props.prompt}
      </Heading>
    </div>
  )
}

Prompt.propTypes = {
  prompt: PropTypes.string.isRequired,
}

export default Prompt