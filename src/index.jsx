/*
Styles are defined in:
-Bootstrap CDN reference in the index.html file
-the react-overlays package (http://react-bootstrap.github.io/react-overlays/examples/)
-the global css reference below
*/
require('./style/global.css');



import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {createStore,  applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
//import io from 'socket.io-client';

import reducer from './app/reducer';
import {setGuests} from './app/action_creators';
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


// Handle socket events
// This is not in use yet
/*
const socket = io(`${location.protocol}//${location.hostname}:8090`);
socket.on('state', state =>
  store.dispatch(setState(state))
);

const createStoreWithMiddleware = applyMiddleware(
  remoteActionMiddleware(socket)
)(createStore);

// The single redux store that the entire application will use
const store = createStoreWithMiddleware(reducer);
*/

// This store only communicates locally, without middleware
const store = createStore(reducer);

store.dispatch(setGuests(initialGuests));

const routes = (
  <Route path="/" component={App} title="Home">
    <IndexRoute component={Main} title="Main"/>
    <Route path="Guests" title="Guests">
      <IndexRoute component={Guests} title="Guest List"/>
      <Route path=":id" component={Guest} title="Guest"></Route>
    </Route>
    <Route path="Table" title="Table">
      <IndexRoute title="Arrange" component={Table}></IndexRoute>
      <Route path=":id" title="Seat Guest" component={SeatGuest}></Route>
    </Route>
  </Route>
);


ReactDOM.render(
  <Provider store={store}>
    <Router  history={browserHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);
