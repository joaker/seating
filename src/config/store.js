import {createStore,  applyMiddleware} from 'redux';
import reducer, {defaultState} from '../app/reducer';
import messenger from '../action_messenger';
import {action_message} from '../app/messages';

// Create a store that messages
export const store = createStore(
  reducer,
  defaultState
);


export default store;
