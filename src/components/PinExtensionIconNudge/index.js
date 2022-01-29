import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Text } from 'evergreen-ui'
import { Button } from 'react-bootstrap'

import { dismissPinExtensionIconNudge } from '../../actions'
import { FONT } from '../../services/constants'
import { sendAmplitudeData } from '../../services/amplitude'

import jigsawExtensionsIcon from '../../assets/jigsaw_icon.png'
import pinExtensionIcon from '../../assets/pin_extension_icon.png'

class PinExtensionIconNudge extends React.Component {

  onDismissClick() {
    sendAmplitudeData('Dismiss Pin Extension Icon Nudge')
    this.props.dispatch(dismissPinExtensionIconNudge())
  }

  render() {
    let containerStyle = { 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
      justifyContent: 'flex-end',
    }

    return (
      <div 
        className="nudge-card"
        style={{ padding: '8px', marginLeft: '5px' }}
      >
        <div style={containerStyle}>
          <Text
            color="#3495f8" 
            fontFamily={FONT}
            marginRight={10}
            size={500}
          >
            Pin Flow to your menu bar to manage your tabs from any webpage.
            <br/><br/>
            Click &nbsp;<img src={jigsawExtensionsIcon} alt=""/>&nbsp; to the right of the URL bar.
            Then, click &nbsp;<img src={pinExtensionIcon} alt=""/> &nbsp;next to Flow.
          </Text>
          <Button style={{ marginTop: '5px' }} onClick={()=> this.onDismissClick()}>Dismiss</Button>
        </div>
      </div>
    )
  }
}

PinExtensionIconNudge.propTypes = {
  dispatch: PropTypes.func.isRequired,
}

export default connect()(PinExtensionIconNudge)