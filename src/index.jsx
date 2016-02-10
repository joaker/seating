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

//Routable Components
import App from './components/App';
import Main from './components/Main';
import Guests from './components/Guests';
import Guest from './components/Guest';
import Table from './components/Table';
import SeatGuest from './components/SeatGuest';

import initialGuests from './data/guests';
import relationships from './data/relationships';
import {action_message} from './app/messages';
import messenger from './action_messenger';

// Handle socket events
const serverPortString = `${window.location.port}` || 80;
const port = Number(serverPortString);
const ioPort = port + 1;
const ioLocation = `${location.protocol}//${location.hostname}:${ioPort}`;
console.log(ioLocation);
const socket = io(ioLocation);


socket.on(action_message, state => {
  store.dispatch(state)
});

const middleware = applyMiddleware(messenger(socket));

// Store that messenges
const store = createStore(
  reducer,
  defaultState,
  middleware
);

//store.dispatch(setGuests(initialGuests));
//store.dispatch(setRelationships(relationships));

const routes =  (
  <Route path="/" component={App} title="Home">
    <IndexRoute to="/" component={Main} title="Main"/>
    <Route path="Guests" title="Guests">
      <IndexRoute to="/Guests" component={Guests} title="Guest List"/>
      <Route path=":id" component={Guest} title="Guest"></Route>
    </Route>
    <Route path="Table" title="Table">
      <IndexRoute to="/Table" title="Arrange" component={Table}></IndexRoute>
      <Route path=":id" title="Seat Guest" component={SeatGuest}></Route>
    </Route>
  </Route>
);


ReactDOM.render(
  <Provider store={store}>
    <Router  history={hashHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);
