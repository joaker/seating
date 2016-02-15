
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


export const scoreGuest = (guest, neighborIDs, selectRelate = selectHate, weighting = 1) => {
  const relates = selectRelate(guest);
  const score = neighborIDs.filter( gid => relates.includes(gid)).length;
  return score;
}

const countMatches = (guests, ids, selectRelate = selectHate, weighting = 1) => {
  // Don't have guest IDs?  Then populate them
  if(!ids) ids = toIDs(guests);

  // match
  const matchCounts = guests.map(g => {
    const guestScore = scoreGuest(g, ids, selectRelate, weighting);
    return guestScore;
  });

  const totalMatches = matchCounts.reduce((total, i) => (total+i), 0);
  return totalMatches;
}

export const scoreTable = (table) => {
  const guestIDs = toIDs(table);

  const hateScore = countMatches(table, guestIDs, selectHate, hateWeight, guestIDs);
  const likeScore = 0; //countMatches(table, selectLike, likeWeight, guestIDs);

  return likeScore - hateScore;
}
