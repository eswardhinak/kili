import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Text, Heading } from 'evergreen-ui'
import { Button } from 'react-bootstrap'

import { setDismissedWhatsNew } from '../../actions'
import { FONT } from '../../services/constants'
import { sendAmplitudeData } from '../../services/amplitude'

import { ReactComponent as ShareIcon } from '../../assets/noun_Share_3747544.svg'
import { ReactComponent as ShareIconWhite } from '../../assets/noun_Share_3747544_white.svg'

import './index.css'

class WhatsNewModal extends React.Component {

  onDismissClick() {
    sendAmplitudeData('Dismiss Whats New', {
      'Iteration': 3,
      'Features': 'Sharing Flows'
    })
    this.props.dispatch(setDismissedWhatsNew())
  }

  render() {
    let containerStyle = { 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
    }
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches

    return (
      <div className="nudge-card">
        <div style={containerStyle}>
          <Heading
            color="#3495f8"
            fontFamily={FONT}
            size={600}
            textDecoration='underline'
          >
            What's New in Flow
          </Heading>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            alignSelf: 'baseline',
          }}>
            {isDarkMode
              ?
                <ShareIconWhite
                  className="share-icon-whats-new"
                />
              :
                <ShareIcon
                  className="share-icon-whats-new"
                />
            }
            <Text
              color={isDarkMode ? 'white' : 'black'}
              fontFamily={FONT}
              size={500}
            >
              Sharing Flows
            </Text>
          </div>
          <Text
            color={isDarkMode ? 'white' : 'black'}
            fontFamily={FONT}
            size={500}
            paddingLeft={10}
            paddingRight={10}
          >
            - Create shareable links for your Flows <span>{'\u{1F91D}'}</span>
          </Text>
          <Text
            color={isDarkMode ? 'white' : 'black'}
            fontFamily={FONT}
            size={500}
            marginTop={10}
            paddingLeft={10}
            paddingRight={10}
          >
            Updated <a href="https://enterflow.app/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a> (added section for sharing Flows).
          </Text>
          <Button
            style={{ marginTop: '5px' }}
            onClick={()=> this.onDismissClick()}
            size="sm"
          >
            Got it
          </Button>
        </div>
      </div>
    )
  }
}

WhatsNewModal.propTypes = {
  dispatch: PropTypes.func.isRequired,
}

export default connect()(WhatsNewModal)