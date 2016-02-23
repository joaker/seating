
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

export const clearTable = () => ({
    meta: { remote: true },
    type: 'CLEAR_TABLE',
})

export const setVenueGuests = (guests, ratio = 0) => ({
    meta: { remote: false },
    type: 'SET_VENUE_GUESTS',
    guests,
    ratio
})

export const populateVenue = (guestCount) => ({
    meta: { remote: false },
    type: 'POPULATE_VENUE',
    guestCount
})


export const quenchVenue = (tableSize, temperature = 120, maxTemperature = 120) => ({
    meta: { remote: false },
    type: 'QUENCH_VENUE',
    tableSize,
    temperature,
    maxTemperature
})



export const scoreVenue = (tableSize) => ({
    meta: { remote: false },
    type: 'SCORE_VENUE',
    tableSize
})


export const startOptimization = () => ({
    meta: { remote: false },
    type: 'START_VENUE_OPTIMIZATION',
})



export const endOptimization = () => ({
    meta: { remote: false },
    type: 'END_VENUE_OPTIMIZATION',
})


export const setMaxDifficulty = (difficulty) => ({
    meta: { remote: false },
    type: 'SET_MAX_DIFFICULTY',
    difficulty
})


export const toggleVenueDetails = () => ({
    meta: { remote: false },
    type: 'TOGGLE_VENUE_DETAILS',
})

export const setTemperature = (temperature) => ({
    meta: { remote: false },
    type: 'SET_TEMPERATURE',
    temperature
})

export const focusGuest = (guest) => ({
    meta: { remote: false },
    type: 'FOCUS_GUEST',
    guest
})

export const setDraftProperty = (property, value) => ({
    meta: { remote: false },
    type: 'SET_DRAFT_PROPERTY',
    property,
    value,
})

export const commitDraft = () => ({
    meta: { remote: false },
    type: 'COMMIT_DRAFT',
})

/*
export function next(){
  return {
    meta: {remote: true},
    type: 'NEXT'
  };
}
*/
