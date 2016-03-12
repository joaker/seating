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

const modePartChooser = {
  hate: selectHate,
  like: selectLike,
}

const modeToParts = {
  hate: ['hate'],
  like: ['like'],
  best: ['hate', 'like'],
}

const modePartWeights = {
  hate: -1,
  like: 1,
}


export const getGuestScores = (guest, neighborIDs, mode = params.defaultMode) => {
  const scores = {};

  const modeParts = modeToParts[mode];

  for(let modePart of modeParts){
    const modePartWeight = modePartWeights[modePart];
    const rawPartScore = scoreGuest(guest, neighborIDs, modePart);
    const weightedPartScore = rawPartScore * modePartWeight;
    scores[modePart] = weightedPartScore;
  }

  return scores;

}

export const scoreGuest = (guest, neighborIDs, modePart = params.defaultModePart) => {
  const chooser = modePartChooser[modePart] || selectHate;
  const relates = chooser(guest);
  const score = neighborIDs.filter( gid => relates.includes(gid)).length;
  return score;
}

// export const scoreGuest = (guest, neighborIDs, selectRelate = selectHate, weighting = 1) => {
//   const relates = selectRelate(guest);
//   const score = neighborIDs.filter( gid => relates.includes(gid)).length;
//   return score;
// }

const countMatches = (guests, ids, modePart) => {

  const selectRelate = modePartChooser[modePart];
  // Don't have guest IDs?  Then populate them
  if(!ids) ids = toIDs(guests);


  // match
  const matchCounts = guests.map(g => {
    const guestScore = scoreGuest(g, ids, modePart);
    return guestScore;
  });

  const totalMatches = matchCounts.reduce((total, c) => (total+c), 0);

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

  const modeParts = modeToParts[mode];

  const partialScores = modeParts.map(mp => counter(mp));

  // if an array of modes was passed, you could reduce on it
  // const score = counter(mode);
  const score = partialScores.reduce((total, partial, index) => {
    const modePart = modeParts[index];
    const partWeight = modePartWeights[modePart];
    const nextTotal = total + partial * partWeight;
    return nextTotal;
  }, 0);

  return score;
  // const weight = modeWeights[mode];
  // const weightedScore = score * weight;
  //
  // return weightedScore;


}
