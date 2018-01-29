import {createStore,  applyMiddleware} from 'redux';
import reducer, {defaultState} from '../app/reducer';
import messenger from '../action_messenger';
import {action_message} from '../app/messages';
import socket from './socket';

// Register the middlewhere to be activated when messages dispatch
const middleware = applyMiddleware(messenger(socket));

// Create a store that messages
export const store = createStore(
  reducer,
  defaultState,
  middleware
);

// When an 'action' is received, dispatch it
socket.on(action_message, state => {
  store.dispatch(state);
});

export default store;
