import {fromJS, List, Map} from 'immutable';
import * as reductions from './reductions.js';

export const defaultState = fromJS({
  guests: [],
  seats: {},
  venueGuests: [],
});

export default function(state = defaultState, action){
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
      return reductions.setVenueGuests(state, action.guests);
    case 'POPULATE_VENUE':
      return reductions.populateVenue(state, action.guestCount);
    case 'QUENCH_VENUE':
      return reductions.quenchVenue(state, action.tableSize, action.temperature, action.maxTemperature);
    case 'SCORE_VENUE':
      return reductions.scoreVenue(state, action.tableSize);
    case 'START_VENUE_OPTIMIZATION':
      return reductions.startOptimization(state);
    case 'END_VENUE_OPTIMIZATION':
      return reductions.endOptimization(state);
  }
  return state;
}
