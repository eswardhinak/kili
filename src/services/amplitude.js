import amplitude from 'amplitude-js';

export const initAmplitude = () => {
  amplitude.getInstance().init(process.env.REACT_APP_AMPLITUDE_KEY);
};

export const sendAmplitudeData = (eventType, eventProperties) => {
  amplitude.getInstance().logEvent(eventType, eventProperties);
};

export const setAmplitudeUserID = userID => {
  amplitude.getInstance().setUserId(userID);
};

export const setAmplitudeUserProperties = properties => {
  amplitude.getInstance().setUserProperties(properties);
};