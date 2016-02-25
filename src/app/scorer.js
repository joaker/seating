
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

export const getGuestScores = (guests, mode = 'hate') => {
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

export const scoreGuest = (guest, neighborIDs, mode = 'hate') => {
  const chooser = modeChooser[mode] || selectHate;
  const relates = chooser(guest);
  const score = neighborIDs.filter( gid => relates.includes(gid)).length;
  return score;
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
