import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Heading,
} from 'evergreen-ui'
import {
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'

import { createAndEnterFlow } from '../../actions'

import { HEADER_FONT } from '../../services/constants'
import { sendAmplitudeData } from '../../services/amplitude'

import TabListView from '../TabListView'

import { ReactComponent as PlusIcon } from '../../assets/noun_Plus_869752.svg'

import './index.css'

class CurrentTabList extends React.Component {

  render() {
    const windows = this.props.windows

    return (
      <div className="current-tabs-container">
        <div className="current-tabs-header">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <OverlayTrigger
              placement="top"
              delay={{ show: 500, hide: 250 }}
              overlay={
                <Tooltip id="focus-tooltip">
                  Create a Flow from your current tabs
                </Tooltip>
              }
            >
              <PlusIcon
                className="current-tabs-plus-icon"
                onClick={e => {
                  sendAmplitudeData('Create Flow', {
                    'Entrypoint': 'Current Tabs Header',
                    'Type': 'Current Tabs',
                    'Entered': true,
                  })
                  this.props.dispatch(createAndEnterFlow(windows))
                }}
              />
            </OverlayTrigger>
            <Heading
              color="white"
              fontFamily={HEADER_FONT}
              size={600}
              marginLeft={4}
            >
              Current Tabs
            </Heading>
          </div>
        </div>
        <div class="current-tabs-body">
          <div class="scrollable-list-container" style={{ height: '100%' }}>
            <TabListView
              listId={-1}
              windows={windows}
              searchString={this.props.searchString}
            />
          </div>
        </div>
      </div>
    )
  }
}

CurrentTabList.propTypes = {
  searchString: PropTypes.string,
  windows: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default connect()(CurrentTabList)