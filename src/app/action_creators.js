export const setState = (state) => ({
  meta: { remote: false },
  type: 'SET_STATE',
  state
})

export const setGuests = (guests) => ({
    meta: { remote: false },
    type: 'SET_GUESTS',
    guests
})

export const addGuest = (guest) => ({
    meta: { remote: false },
    type: 'ADD_GUEST',
    guest
})

export const seatGuest = ( guest, seat ) => ({
    meta: { remote: false },
    type: 'SEAT_GUEST',
    seating: { guest, seat }
})


/*
export function next(){
  return {
    meta: {remote: true},
    type: 'NEXT'
  };
}
*/
