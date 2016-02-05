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


/*
export function next(){
  return {
    meta: {remote: true},
    type: 'NEXT'
  };
}
*/
