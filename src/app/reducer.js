import {fromJS, List, Map} from 'immutable';
import {normal} from '../components/pure/DifficultyChooser';
import * as reductions from './reductions.js';
import * as params from '../data/venue.js';

export const defaultServerState = fromJS({
  guests: [],
  seats: {},
});

export const defaultLocalState = fromJS({
  guests: [],
  seats: {},
  venueGuests: [],
  difficulty: normal,
  seatsPerTable: params.seatsPerTable,
  guestCount: params.guestCount,
  temperature: params.defaultTemperature,
});

export const reducerFactory = (initialState = defaultLocalState) => (state = initialState, action) => {
  let act = action;
  console.log('action');
  switch(action.type){
    case 'SET_STATE':
      return reductions.setState(state, action.state);
    case 'RESET_STATE':
      return reductions.resetState(state);
    case 'SET_GUESTS':
      return reductions.setGuests(state, action.guests);
    case 'SET_RELATIONSHIPS':
      return reductions.setRelationships(state, action.relationships);
    case 'ADD_GUEST':
      return reductions.addGuest(state, action.guest);
    case 'DROP_GUEST':
      return reductions.dropGuest(state, action.guest);
    case 'SEAT_GUEST':
      return reductions.seatGuest(state, action.seating);
    case 'CLEAR_SEAT':
      return reductions.clearSeat(state, action.seat);
    case 'CLEAR_TABLE':
      return reductions.clearTable(state);
    case 'SET_VENUE_GUESTS':
      return reductions.setVenueGuests(state, action.guests, action.ratio);
    case 'POPULATE_VENUE':
      return reductions.populateVenue(state);
    case 'SCORE_VENUE':
      return reductions.scoreVenue(state);
    case 'START_VENUE_OPTIMIZATION':
      return reductions.startOptimization(state);
    case 'END_VENUE_OPTIMIZATION':
      return reductions.endOptimization(state);
    case 'SET_MAX_DIFFICULTY':
      return reductions.setMaxDifficulty(state, action.difficulty);
    case 'TOGGLE_VENUE_DETAILS':
      return reductions.toggleVenueDetails(state);
    case 'SET_TEMPERATURE':
      return reductions.setTemperature(state, action.temperature);
    case 'FOCUS_GUEST':
      return reductions.focusGuest(state, action.guestID, action.force);
    case 'CLEAR_FOCUSED_GUEST':
      return reductions.clearFocusedGuest(state);
    case 'SET_DRAFT_PROPERTY':
      return reductions.setDraftProperty(state, action.property, action.value);
    case 'COMMIT_DRAFT':
      return reductions.commitDraft(state);
    case 'SET_OPTIMIZATION_MODE':
      return reductions.setMode(state, action.mode);
    case 'SWAP_GUESTS':
      return reductions.swapGuests(state, action.source, action.target);
  }
  return state;
}

export const serverReducer = reducerFactory(defaultServerState);
export const localReducer = reducerFactory(defaultLocalState);


export default localReducer;
