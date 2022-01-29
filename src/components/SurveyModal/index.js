/*global chrome*/

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Text, Heading } from 'evergreen-ui'
import { Button } from 'react-bootstrap'

import { setDismissedSurvey } from '../../actions'
import { FONT } from '../../services/constants'
import { sendAmplitudeData } from '../../services/amplitude'

class SurveyModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      show: false,
    }
  }

  componentDidMount() {
    const dismissedSurvey = this.props.dismissedSurvey
    if (dismissedSurvey !== undefined && dismissedSurvey > 0) {
      return
    }

    const eligibleIds = new Set([
      207,
      1007,
      1008,
      1009,
      1031,
      1051,
      1055,
      1057,
      1058,
      1063,
      1065,
      1066,
      1067,
      1068,
      1071,
      1072,
      1077,
      1078,
      1079,
      1081,
      1085,
      132,
      279,
      409,
      497,
      524,
      533,
      539,
      547,
      581,
      629,
      660,
      679,
      689,
      702,
      813,
      903,
      910,
      919,
      928,
      937,
      938,
      979,
      988,
    ])
    if (eligibleIds.has(this.props.amplitudeId)) {
      this.setState({ show: true })
    }
  }

  onTakeSurveyClick() {
    sendAmplitudeData('Open Survey', {
      'Name': 'Product Market Fit',
      'Date': '02/17/2021',
    })
    chrome.tabs.create({url: 'https://enterflow.typeform.com/to/Ud7RV5r9#source=in-app-notif', active: true})
    this.dismissSurvey()
  }

  onDismissClick() {
    sendAmplitudeData('Dismiss Survey', {
      'Name': 'Product Market Fit',
      'Date': '02/17/2021',
    })
    this.dismissSurvey()
  }

  dismissSurvey() {
    this.props.dispatch(setDismissedSurvey())
    this.setState({ show: false })
  }

  render() {
    if (!this.state.show) {
      return null
    }

    let containerStyle = { 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
      justifyContent: 'flex-end',
    }

    return (
      <div className="nudge-card">
        <div style={containerStyle}>
          <Heading
            color="#3495f8" 
            fontFamily={FONT}
            marginBottom={10}
            size={600}
          >
            Got a minute?
          </Heading>
          <Text
            color="#3495f8" 
            fontFamily={FONT}
            size={500}
          >
            Help us shape the Flow experience by taking this survey!
            <br/>
          </Text>
          <div className="button-row-container" style={{ marginTop: '10px' }}>
            <Button
              style={{ marginRight: '5px' }}
              onClick={() => this.onTakeSurveyClick()}
              size="sm"
            >
              Take Survey
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => this.onDismissClick()}
              size="sm"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

SurveyModal.propTypes = {
  amplitudeId: PropTypes.number.isRequired,
  dismissedSurvey: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  const { login } = state
  const { amplitudeId, dismissedSurvey } = login ||
  {
    amplitudeId: undefined,
    dismissedSurvey: 0,
  }
  return {
    amplitudeId,
    dismissedSurvey,
  }
}

export default connect(mapStateToProps)(SurveyModal)