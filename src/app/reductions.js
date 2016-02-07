import {List, Map} from 'immutable';

export const setState = (state, newState) => state.merge(newState);

export const resetState = (state) => new Map();

export const setGuests = (state, guests) => {
  return state.set('guests', List(guests));
}

export const addGuest = (state, guest) => {
  return state.update(
    'guests',
    List(),
    guests => guests.push(guest)
  );
}

export const dropGuest = (state, guest) => {
  return state.update(
    'guests',
    List(),
    // TODO: Use a absolute equals
    guests => guests.filter(g => g != guest)
  );
}


export const seatGuest = (state, { guest = 'Unknown', seat = 0 }) => {
  return state.setIn(
    ['seats', seat ],
    guest
  );
}
