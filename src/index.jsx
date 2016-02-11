// Inject the global style references
require('./style/global.css');


import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import {createStore,  applyMiddleware} from 'redux';
import {Provider} from 'react-redux';

import reducer, {defaultState} from './app/reducer';
import routes from './routes';
import {action_message} from './app/messages';
import messenger from './action_messenger';

portConfig = portConfig || {};
var host = location.origin.replace(/^http/, 'ws');

var debugLocation = portConfig.ioClientLocation;
const ioLocation = debugLocation || host;//`${location.protocol}//${location.hostname}``:${ioPort}`;
console.log(ioLocation);
const socket = io(ioLocation);


// When an 'action' is received, dispatch it
socket.on(action_message, state => {
  store.dispatch(state);
});

// Register the middlewhere to be activated when messages dispatch
const middleware = applyMiddleware(messenger(socket));

// Create a store that messages
const store = createStore(
  reducer,
  defaultState,
  middleware
);


ReactDOM.render(
  <Provider store={store}>
    <Router  history={hashHistory} routes={routes}/>
  </Provider>,
  document.getElementById('app')
);
