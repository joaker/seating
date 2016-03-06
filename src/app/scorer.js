import * as params from '../data/venue.js';


export const sameTable = (guest1Index, guest2Index, tableSize) => {
  const start1 = guest1Index - (guest1Index % tableSize);
  const start2 = guest2Index - (guest2Index % tableSize);
  const same = start1 == start2;
  return same;
}



export const hateWeight = 1;
export const likeWeight = 0;
export const selectHate = (guest) => guest && guest.hates;
export const selectLike = (guest) => guest && guest.likes;

export const toIDs = (guests) => {
  return guests.map(g => g.id);
};

export const getGuestScores = (guests, mode = params.defaultMode) => {
  const ids = toIDs(guests);
  const scores = {};
  guests.forEach(guest => {
    scores[guest.id] = scoreGuest(guest, ids, mode);
  });
  return scores;
}

const modeChooser = {
  hate: selectHate,
  like: selectLike,
}

const modeWeights = {
  hate: -1,
  like: 1,
}

export const scoreGuest = (guest, neighborIDs, mode = params.defaultMode) => {
  const chooser = modeChooser[mode] || selectHate;
  const relates = chooser(guest);
  const score = neighborIDs.filter( gid => relates.includes(gid)).length;
  return score;
}

const modeRelationshipNames = {
  hate: 'hates',
  like: 'likes',
};
export const getSeatScore = (guest, neighborIDs, mode = params.defaultMode) => {
  if(!guest) return 0;
  const relationshipName = modeRelationshipNames[mode] || mode;
  const relates = guest.get(relationshipName);
  const score = neighborIDs.filter( gid => relates.includes(gid)).length;
  const weight = modeWeights[mode];
  const weightedScore = score * weight;

  return weightedScore;
}


export const getSeatScoreMutable = (guest, neighborIDs, mode = params.defaultMode) => {
  if(!guest) return 0;
  const relationshipName = modeRelationshipNames[mode] || mode;
  const relates = guest[relationshipName];
  const score = neighborIDs.filter( gid => relates.includes(gid)).length;
  const weight = modeWeights[mode];
  const weightedScore = score * weight;

  return weightedScore;
}

export const getTableScore = (table, mode = params.defaultMode) => {
  const tableScore = table.reduce((score, seat) => (score + seat.getIn(['score', mode], 0)), 0);
  return tableScore;
}

export const getTableScoreMutable = (table, mode = params.defaultMode) => {
  const tableScore = table.reduce((score, seat) => {
    const seatScore = seat.score || {};
    const partial = seatScore[mode] || 0;
    const nextScore = score + partial;
  }, 0);
  return tableScore;
}

// export const scoreGuest = (guest, neighborIDs, selectRelate = selectHate, weighting = 1) => {
//   const relates = selectRelate(guest);
//   const score = neighborIDs.filter( gid => relates.includes(gid)).length;
//   return score;
// }

const countMatches = (guests, ids, mode) => {

  const selectRelate = modeChooser[mode];
  // Don't have guest IDs?  Then populate them
  if(!ids) ids = toIDs(guests);


  // match
  const matchCounts = guests.map(g => {
    const guestScore = scoreGuest(g, ids, mode);
    return guestScore;
  });

  const totalMatches = matchCounts.reduce((total, i) => (total+i), 0);

  return totalMatches;
}

const makeCounter = (table) => {
  const guestIDs = toIDs(table);
  const counter = (mode, weight = 1) => countMatches(table, guestIDs, mode);
  return counter;
}

export const scoreTable = (table, mode) => {
  // Create a function to count matches in this table
  const counter = makeCounter(table);
  // const hateScore = counter(mode, weight);
  // const likeScore = counter(mode, weight);

  // return likeScore - hateScore;

  // if an array of modes was passed, you could reduce on it
  const score = counter(mode);

  const weight = modeWeights[mode];
  const weightedScore = score * weight;

  return weightedScore;


}

export const scoreSeatMutable = (seatState, neighborIDs, mode) => {
  const guest = seatState.guest;
  if(!guest) return seatState;

  const modeScore ={};
  modeScore[mode] = getSeatScoreMutable(guest, neighborIDs, mode);

  seatState.score = modeScore;

  return seatState;
}

export const scoreTableMutable = (table, mode) => {

  const ids = tableState.map(seat => (seat.guest || {}).id);
  const newTableState = tableState.map((seat, i) => {
    const newSeat = scoreSeat(seat, ids, mode);
    return newSeat;
    // const nextMemo = memo.set(i, newSeat);
    // return nextMemo;
  });
  return newTableState;

}
