import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose} from 'redux'
import thunkMiddleware from 'redux-thunk'
import throttle from 'lodash/throttle'

import { initAmplitude } from './services/amplitude'
import rootReducer from './reducers'
import { loadState, saveState } from './services/localStorage'
import App from './App'

import './assets/fonts/BryantPro/BryantPro-Bold.woff2'
import './assets/fonts/Nunito/Nunito-Bold.woff2'

import './index.css'

initAmplitude();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistedState = loadState()
const store = createStore(
  rootReducer,
  {
    ...persistedState
  },
  composeEnhancers(applyMiddleware(thunkMiddleware))
)

store.subscribe(throttle(() => {
  saveState({
    journal: store.getState().journal,
    logging: store.getState().logging,
    login: store.getState().login,
    appConfig: store.getState().appConfig,
  })
}, 50));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

/* How to load state into app when using chrome.storage.local */

// loadState().then((persistedState) => {
//   const store = createStore(
//     rootReducer,
//     {
//       ...persistedState
//     },
//     composeEnhancers(applyMiddleware(thunkMiddleware))
//   )
//   store.subscribe(throttle(() => {
//     saveState({
//       journal: store.getState().journal,
//       logging: store.getState().logging,
//       login: store.getState().login,
//       appConfig: store.getState().appConfig,
//     })
//   }, 50));
//   ReactDOM.render(
//     <React.StrictMode>
//       <Provider store={store}>
//         <App />
//       </Provider>
//     </React.StrictMode>,
//     document.getElementById('root')
//   );
// })