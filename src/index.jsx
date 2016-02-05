import React from 'react';
import ReactDOM from 'react-dom';
import {Router,Route} from 'react-router';
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
  <Route component={App}>
    <Route path="/" component={Main}/>
    <Route path="/Guests" component={Guests} />
  </Route>
);


ReactDOM.render(
  <Provider store={store}>
    <Router>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);
