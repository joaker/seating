import { configureStore } from '@reduxjs/toolkit';
import reducer, { defaultLocalState as preloadedState } from '../app/reducer';

export const store = configureStore({
  reducer,
  preloadedState,
});

if (typeof window !== 'undefined') {
  (window as any).__REDUX_STORE__ = store;
}

export default store;
