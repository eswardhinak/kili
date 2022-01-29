import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Text } from 'evergreen-ui'

import { updateJournalEntry } from '../../actions'

import { sendAmplitudeData } from '../../services/amplitude'
import { FONT } from '../../services/constants'
import { debounce } from '../../services/utils'

import './index.css'

class Journal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
    }

    this.updateEntry = this.updateEntry.bind(this)
    this.notes = React.createRef()
  }

  updateEntry() {
    let notesEntry = this.notes.value
    if (notesEntry === undefined) {
      notesEntry = ""
    }

    const updatedEntry = {
      notes: notesEntry,
      updatedAt: (new Date()).getTime(),
    }
    const flowId = this.props.flowId
    this.props.dispatch(updateJournalEntry(
      flowId,
      updatedEntry,
    ))
    sendAmplitudeData('Update Journal Entry', {
      'Flow ID': flowId,
      'Notes Length': notesEntry.length,
    })
  }

  render() {
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    let inputStyle = {
      height: this.props.isCurrentFlow ? '95%' : '84%'
    }
    let journalStyle = {
      height: this.props.isCurrentFlow ? '88%' : '141px'
    }

    let debouncedUpdateEntry = debounce(this.updateEntry, 500)
    return (
      <div className="journal-container" style={journalStyle}>
        <Text
          color={isDarkMode ? "#ffffffc4" : "#707070"}
          fontFamily={FONT}
          size={500}
        >
          Notes
        </Text>
        <textarea
          className="editable-input"
          style={inputStyle}
          ref={node => (this.notes = node)}
          onChange={e => {
            e.preventDefault()
            debouncedUpdateEntry()
          }}
          placeholder="..."
        >
          {this.props.notes}
        </textarea>
      </div>
    )
  }
}

Journal.propTypes = {
  flowId: PropTypes.number.isRequired,
  notes: PropTypes.string.isRequired,
  isCurrentFlow: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default connect()(Journal)