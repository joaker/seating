/*
Styles are defined in:
-Bootstrap CDN reference in the index.html file
-the react-overlays package (http://react-bootstrap.github.io/react-overlays/examples/)
-the global css reference below
*/
require('./style/global.css');


import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory'
import {createStore,  applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
//import io from 'socket.io-client';

import reducer, {defaultState} from './app/reducer';
import {setGuests, setRelationships, setState} from './app/action_creators';
// We don't need this because we're not using remote content yet
//import remoteActionMiddleware from './remote_action_middleware';

import routes from './routes';


import initialGuests from './data/guests';
import relationships from './data/relationships';
import {action_message} from './app/messages';
import messenger from './action_messenger';
import logger from '../server/logger';

//import port from './app/port';
portConfig = portConfig || {};
var host = location.origin.replace(/^http/, 'ws');


var debugLocation = portConfig.ioClientLocation;

// This wasn't working great on heroku.  May need to tweak this for wds
// const serverPortString = portConfig.ioPort || `${window.location.port}`;
// const appPort = Number(serverPortString);
// const ioPort = appPort;// + 1;
// const portString = ':' + ioPort;
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
