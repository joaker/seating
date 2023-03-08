import { configureStore } from '@reduxjs/toolkit';
import reducer, {defaultLocalState as preloadedState} from '../app/reducer';

// Create a store that messages
export const store = configureStore({
  reducer,
  preloadedState,
});

if(typeof window !== 'undefined') {
  window.__REDUX_STORE__ = store;
}

export default store;
