import Immutable, {List, Map} from 'immutable';
import range from '../util/range';
import {shuffleImmutable as shuffle} from '../util/shuffle';
import GuestFactory from './GuestFactory';
import * as params from '../data/venue.js';
import {getSeatScore, getTableScore} from './scorer';

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

export const setScoredTables = (state, tables, score, ratio = 0) => {
  const newState = state
    .set('venueTables', tables)
    .set('venueScore', score).set('hasVenueScore', true)
    .set('optimizeProgressRatio', ratio);
  return newState;
}

export const populateVenue = (state) => {
  const guestCount = state.get('guestCount');
  const seatCount = state.get('seatCount') || guestCount;
  const tableSize = state.get('seatsPerTable');
  const tableCount = state.get('tableCount');
  const emptySeatCount = seatCount - guestCount;

  const maxHates = state.get('difficulty');
  const maxLikes =  maxHates; //state.get('maxLikes');
  const factory = new GuestFactory(guestCount, maxHates, maxLikes);
  const rawGuestList = factory.createAll();
  const guestList = Immutable.fromJS(rawGuestList);

  // Padd the array with empty seats for any unused seats;
  const rawPadding = Array(emptySeatCount).fill(false);
  const padding = Immutable.fromJS(rawPadding);
  const paddedGuestList = guestList.concat(padding);

  const randomizedGuestList = shuffle(paddedGuestList);
  let seatCounter = 0;
  const tables = List(range(tableCount).map(tableIndex => {
    const start = tableIndex * tableSize;
    const end = start + tableSize;
    const tableSeats = randomizedGuestList.slice(start, end).map( guest => {
      var seat = Map({
        guest: guest,
        score: Map(),
        seat: seatCounter++,
      });
      return seat;
    });
    return tableSeats;
  }));

  const stateWithGuestList = state.set('venueGuestList', guestList);

  const stateWithTablesAndGuestList = stateWithGuestList.set('venueTables', tables);

  const newState = stateWithTablesAndGuestList.set('hasVenueScore', false);

  return newState;
  // const newState = setVenueGuests(state, randoGuests)
  //   .set('hasVenueScore', false);
  // return newState;
}

export const scoreSeat = (seatState, neighborIDs, mode) => {
  const guest = seatState.get('guest');
  if(!guest) return seatState;

  const modeScore = getSeatScore(guest, neighborIDs, mode);

  // Is the current score from a different mode?  Reset the scoring.  Otherwise, override the current one
  const score = seatState.hasIn(['score', mode]) ? seatState.get('score') : Map();
  const nextScore = score.set(mode, modeScore);

  const nextSeatState = seatState.set('score', nextScore);
  //const nextSeatState = seatState.setIn(['score', mode], modeScore);
  return nextSeatState;
}

export const scoreTable = (tableState, mode) => {
  const ids = tableState.map(seat => seat.getIn(['guest', 'id'], false)).toJS();
  const newTableState = tableState.map((seat, i) => {
    const newSeat = scoreSeat(seat, ids, mode);
    return newSeat;
    // const nextMemo = memo.set(i, newSeat);
    // return nextMemo;
  });
  return newTableState;
}

export const scoreVenue = (state) => {
  // const guests = state.get('venueGuests').toJS();
  const tables = state.get('venueTables');
  const tableSize = state.get('seatsPerTable');
  const mode = state.get('optimizationMode', params.defaultMode);

  // if(!guests.length) return state;
  if(!tables.size) return state;

  const scoredTables = tables.reduce((memo, table, i) => {
    const scoredTable = scoreTable(table, mode);
    return memo.set(i, scoredTable);
  }, tables);

  const tableScores = scoredTables.map(table => {
    const tableScore = getTableScore(table, mode);
    return tableScore;
  });
  const venueScore = tableScores.reduce((runningTotal, tableScore) => runningTotal + tableScore, 0);
  const nextState = state.set('venueTables', scoredTables).set('venueScore', venueScore).set('hasVenueScore', true);

  return nextState;


  // let score = 0;
  // for(let i = 0; i < guests.length; i += tableSize){
  //   score += scoreTable(guests.slice(i, i+tableSize), mode);
  // }
  //
  // const newState = state.set('venueScore', score).set('hasVenueScore', true);
  //
  // return newState;
}



export const startOptimization = (state) => {
  const newState = state.set('optimizing', new Date());
  return newState;
}

export const endOptimization = (state) => {
  const last = state.get('optimizing', new Date());
  if(!last) return state;

  const now = new Date();

  const diff = now - last;
  const diffSeconds = diff / 1000;
  const newState = state.set('optimizing', false).set('lastRunSeconds', diffSeconds);
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

export const focusGuest = (state, guestID) => {
  const current = state.get('focusedGuest');

  if((current && (current.id == guestID))){
    const unfocusedState = state.delete('focusedGuest');
    return unfocusedState;
  }

  const guests = state.get('venueGuestList', List());//, Immutable.fromJS(guest);

  const immutableGuest = guests.find(g => g.get('id') == guestID);

  const newState = state.set('focusedGuest', immutableGuest);
  return newState;
}


export const setDraftProperty = (state, property, value) => {
  const draft = state.get('draftConfig', Map());
  const newDraft = draft.set(property, value);
  const newState = state.set('draftConfig', newDraft);
  return newState;
}

const defaultConfig = {
  guestCount: params.guestCount,
  seatsPerTable: params.seatsPerTable,
  difficulty: params.difficulty,
};

export const commitDraft = (state) => {
  const draft = state.get('draftConfig', Map());

  const stateWithDraft = state.merge(draft).delete('draftConfig');

  const guestCount = stateWithDraft.get('guestCount') || defaultConfig.guestCount;
  const seatsPerTable = stateWithDraft.get('seatsPerTable') || defaultConfig.seatsPerTable;

  // figure out how many tables are needed to accomodate everyone
  const tableCount = Math.ceil(guestCount / seatsPerTable);

  // how many seats are available?  There may be more than there are guests
  const seatCount = tableCount * seatsPerTable;

  const tableProps = Immutable.fromJS({
    tableCount: tableCount,
    seatCount: seatCount,
  });

  const newState = stateWithDraft.merge(tableProps);
  return newState;
}

export const setMode = (state, mode) => {
  const newState = state.set('optimizationMode', mode);
  return newState;
}
