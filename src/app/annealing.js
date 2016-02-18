import {scoreTable, sameTable} from './scorer';

const scoreImproved = (change) => change > 0;
const accept = true;
const reject = false;

const scaleMax = 10;
const scaleTemperature = (temperature, maxTemperature) => (temperature/maxTemperature) * scaleMax;
export const shouldAcceptChange = (change, temperature, maxTemperature) => {
    // Don't do this.  We want to explore the space
    //if(!change) return reject;
    if (scoreImproved(change)) return accept;

    const scaledTemperature = scaleTemperature(temperature, maxTemperature);

    // TODO: Toy with this number a bit
    // Acceptance Probabilities: http://artint.info/html/ArtInt_89.html
    const acceptanceMargin = Math.exp(change / scaledTemperature);
    const fate = Math.random();



    // Do we explore, even though it's a bad change?
    const explore = (fate < acceptanceMargin) ? accept : reject;

    return explore;
}

export const defaultCoolingRate = 1;


const likeWeight = 0;

// This has to be floor, otherwise it will go off the rails occasionally
const pickGuest = (guestCount) => Math.floor(Math.random()*guestCount);
const getTable = (guestIndex, tableSize, guests) => {
  const start = guestIndex - (guestIndex % tableSize);
  const end = start + tableSize;
  const tableGuests = guests.slice(start, end);
  return {
    start: start,
    end: end,
    guests: tableGuests,
  };
};

export const step = (guestList = {}, tableSize, temperature = 120, maxTemperature = 120) => {

  const guests = guestList.guests;

  if(!guests) return guestList;

  const guestCount = guests.length;

  if(!guestCount) return noChange;

  const guest1Index = pickGuest(guestCount);
  const guest2Index = pickGuest(guestCount);

  if(sameTable(guest1Index, guest2Index, tableSize)) return guestList;

  const table1 = getTable(guest1Index, tableSize, guests);
  const table2 = getTable(guest2Index, tableSize, guests);

  // If the tables are the same, don't bother
  const t1Score = scoreTable(table1.guests);
  const t2Score = scoreTable(table2.guests);

  const initialScore = t1Score + t2Score;

  const guest1TableIndex = guest1Index - (table1.start);
  const guest2TableIndex = guest2Index - (table2.start);

  const firstGuest = guests[guest1Index];
  const secondGuest = guests[guest2Index];

  const table1Guest = table1.guests[guest1TableIndex];
  const table2Guest = table2.guests[guest2TableIndex];

  if(table1Guest.id != firstGuest.id){
    var broken;
    broken.willBreak;
  }
  if(table2Guest.id != secondGuest.id){
    var broken;
    broken.willBreak;
  }

  table1.guests.splice(guest1TableIndex, 1, secondGuest);
  table2.guests.splice(guest2TableIndex, 1, firstGuest);

  const t1NextScore = scoreTable(table1.guests);
  const t2NextScore = scoreTable(table2.guests);

  const nextScore = t1NextScore + t2NextScore;

  const change = nextScore - initialScore;

  const accepted = shouldAcceptChange(change, temperature, maxTemperature);

  if(!accepted) return guestList;

  // const percentOfTemp = temperature / maxTemperature;
  // const swap = (diff > 0) || (Math.random() < percentOfTemp);
  // if(!swap) return state;

  // Swap the guests
  guests.splice(guest1Index, 1, secondGuest);
  guests.splice(guest2Index, 1, firstGuest);

  // guestList.score += change;
  // guestList.guests = guests;

  return {
    guests,
    score: guestList.score + change,
  };
}

export default step;
