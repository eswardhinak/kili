/*global chrome*/

import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ShepherdTour, ShepherdTourContext } from 'react-shepherd'

import {
  setActiveTour,
  setCompletedTour,
  setCanceledTour,
}
from '../../actions'

import steps from '../../toursteps'

import 'shepherd.js/dist/css/shepherd.css'

const tourOptions = {
  defaults: {
    classes: 'shepherd-theme-dark'
  },
  defaultStepOptions: {
    classes: 'shepherd-theme-dark',
    cancelIcon: {
      enabled: true
    }
  },
  useModalOverlay: true,
}

function StartTourModal(props) {
  const tour = useContext(ShepherdTourContext)
  tour.on('complete', function() {
    props.setCompletedTour(true)
    props.setActiveTour(false)
  })
  tour.on('cancel', function() {
    props.setCanceledTour(true)
    props.setActiveTour(false)
  })

  if (
    !props.activeTour && 
    !props.completedTour && 
    !props.canceledTour
  ) {
    props.setActiveTour(true)
    chrome.permissions.contains({
      permissions: ['tabs'],
    }, function(result) {
      if (!result) {
        tour.addStep(steps[6], 0)
      } else {
        tour.addSteps(steps)
      }
      tour.start()
    })
  }
  return null
}

class OnboardingTour extends React.Component {

  componentDidMount() {
    this.props.dispatch(setActiveTour(false))
  }

  render() {
    const dispatch = this.props.dispatch
    return (
      <ShepherdTour steps={[]} tourOptions={tourOptions}>
        <StartTourModal
          completedTour={this.props.completedTour}
          canceledTour={this.props.canceledTour}
          activeTour={this.props.activeTour}
          setActiveTour={(activeTour) => dispatch(setActiveTour(activeTour))}
          setCompletedTour={(completed) => dispatch(setCompletedTour(completed))}
          setCanceledTour={(canceled) => dispatch(setCanceledTour(canceled))}
        />
      </ShepherdTour>
    )
  }
}

OnboardingTour.propTypes = {
  activeTour: PropTypes.bool.isRequired,
  completedTour: PropTypes.bool.isRequired,
  canceledTour: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired, 
}

function mapStateToProps(state) {
  const { appConfig, login } = state
  const { activeTour } = appConfig ||
  {
    activeTour: false,
  }
  const { completedTour, canceledTour } = login ||
  {
    completedTour: false,
    canceledTour: false,
  }
  return {
    activeTour,
    completedTour,
    canceledTour,
  }
}

export default connect(mapStateToProps)(OnboardingTour)