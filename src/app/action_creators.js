
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


export const setRelationships = (relationships) => ({
    meta: { remote: false },
    type: 'SET_RELATIONSHIPS',
    relationships
})

export const addGuest = (guest) => ({
    meta: { remote: true },
    type: 'ADD_GUEST',
    guest
})

export const seatGuest = ( guest, seat ) => ({
    meta: { remote: true },
    type: 'SEAT_GUEST',
    seating: { guest, seat }
})

export const clearSeat = ( seat ) => ({
    meta: { remote: true },
    type: 'CLEAR_SEAT',
    seat: seat
})


/*
export function next(){
  return {
    meta: {remote: true},
    type: 'NEXT'
  };
}
*/
