import {List, Map} from 'immutable';
import * as reductions from './reductions.js';



export default function(state = Map(), action){
  switch(action.type){
    case 'SET_STATE':
      return reductions.setState(state, action.state);
    case 'RESET_STATE':
      return reductions.resetState(state);
    case 'SET_GUESTS':
      return reductions.setGuests(state, action.guests);
    case 'ADD_GUEST':
      return reductions.addGuest(state, action.guest);
    case 'DROP_GUEST':
      return reductions.dropGuest(state, action.guest);
    case 'SEAT_GUEST':
      return reductions.seatGuest(state, action.seating);
  }
  return state;
}
