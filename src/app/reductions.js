import Immutable, {List, Map} from 'immutable';
import range from '../util/range';
import shuffle from '../util/shuffle';
import GuestFactory from './GuestFactory';

export const setState = (state, newState) => state.merge(newState);

export const resetState = (state) => new Map();

export const setGuests = (state, guests) => {
  return state.set('guests', List(guests));
}

export const setRelationships = (state, relationships = {}) => {
  return state.set('relationships', Immutable.fromJS(relationships));
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
  return ( !guest || guest == 'Empty') ?
    clearSeat(state, seat) :
    state.setIn(
      ['seats', seat ],
      guest
    );
}




export const clearSeat = (state, seat) => {
  return state.deleteIn(
    ['seats', seat ]
  );
}

export const clearTable = (state) => {
  return state.set(
    'seats', Map()
  );
}

export const setVenueGuests = (state, guests = [], ratio = 0) => {
  const venueGuests = Immutable.fromJS(guests);
  const newState = state
    .set('venueGuests', venueGuests)
    .set('guestCount', guests.length)
    .set('optimizeProgressRatio', ratio);

  return newState;
}

export const populateVenue = (state, guestCount) => {
  const maxHates = state.get('difficulty');
  const maxLikes =  state.get('maxLikes');
  const factory = new GuestFactory(guestCount, maxHates, maxLikes);
  const guests = factory.createAll();
  const randoGuests = shuffle(guests);

  const newState = setVenueGuests(state, randoGuests)
    .set('hasVenueScore', false);
  return newState;
}

const likeWeight = 0;
const scoreTable = (table) => {
  const guestIDs = table.map(g => {
    return g.id
  });
  const hateScore = table.map(g => {
    const hates = guestIDs.filter(gid => g.hates.includes(gid)).length;
    return hates;
  }).reduce((total, i) => (total + i), 0)
  const likeScore = table.map(g => {
    const likes = guestIDs.filter(gid => g.likes.includes(gid)).length * likeWeight;
    return likes;
  }).reduce((total, i) => (total + i), 0)

  return likeScore - hateScore;
}

export const quenchVenue = (state, tableSize, temperature = 120, maxTemperature = 120) => {
  const guests = state.get('venueGuests', List()).toJS();

  if(!guests.length) return state;

  const guestCount = state.get('guestCount');

  const guest1Index = Math.round(Math.random()*guestCount);
  const guest2Index = Math.round(Math.random()*guestCount);

  const table1Start = guest1Index - Math.floor(guest1Index%tableSize);
  const table1End = table1Start + tableSize;

  const table2Start = guest2Index - Math.floor(guest2Index%tableSize);
  const table2End = table2Start + tableSize;

  // If the tables are the same, don't bother
  if(table1Start == table2Start) return state;

  const table1 = guests.slice(table1Start, table1End);
  const table2 = guests.slice(table1Start, table1End);

  const table1Score = scoreTable(table1);
  const table2Score = scoreTable(table2);

  const initialScore = table1Score + table2Score;

  const guest1TableIndex = guest1Index - (table1Start);
  const guest2TableIndex = guest2Index - (table2Start);

  const table1Swapped = table1.map(g => g);
  const table2Swapped = table2.map(g => g);

  table1Swapped.splice(guest1TableIndex, 1, guests[guest2Index]);
  table2Swapped.splice(guest2TableIndex, 1, guests[guest1Index]);

  const table1SwappedScore = scoreTable(table1Swapped);
  const table2SwappedScore = scoreTable(table2Swapped);

  const swappedScore = table1SwappedScore + table2SwappedScore;

  const diff = swappedScore - initialScore;
  const percentOfTemp = temperature / maxTemperature;
  const swap = (diff > 0) || (Math.random() < percentOfTemp);

  if(!swap) return state;

  const g1 = state.getIn(['venueGuests', guest1Index]);
  const g2 = state.getIn(['venueGuests', guest2Index]);
  const newState = state.setIn(
    ['venueGuests', guest1Index],
    g2
  ).setIn(
    ['venueGuests', guest2Index],
    g1
  );
  return newState;

}

export const scoreVenue = (state) => {
  const guests = state.get('venueGuests').toJS();
  const tableSize = state.get('seatsPerTable');

  if(!guests.length) return state;

  let score = 0;
  for(let i = 0; i < guests.length; i += tableSize){
    score += scoreTable(guests.slice(i, i+tableSize));
  }

  const newState = state.set('venueScore', score).set('hasVenueScore', true);

  return newState;
}



export const startOptimization = (state) => {
  const newState = state.set('optimizing', true);
  return newState;
}

export const endOptimization = (state) => {
  const newState = state.set('optimizing', false);
  return newState;
}


export const setMaxDifficulty = (state, difficulty) => {
  const newState = state.set('difficulty', difficulty);
  return newState;
}


export const toggleVenueDetails = (state) => {
  const nextExpansion = !state.get('venueDetailsExpanded');
  const newState = state.set('venueDetailsExpanded', nextExpansion);
  return newState;
}


export const setTemperature = (state, temperature) => {
  const newState = state.set('temperature', temperature);
  return newState;
}
