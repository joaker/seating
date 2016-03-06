//import {scoreTable, sameTable} from '../scorer';
import {getTableScore, getTableScoreMutable} from '../scorer';
import {scoreTable} from '../reductions';
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
const pickIndex = (size) => Math.floor(Math.random()*size);
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

export const step = (scoredTables, temperature, maxTemperature, mode) => {

  const noChange = scoredTables;

  if(!scoredTables || !scoredTables.tables || !scoredTables.tables.size) return noChange;

  const tables = scoredTables.tables;

  const tableCount = tables.size;

  if(!tableCount) return noChange;

  const table1Index = pickIndex(tableCount);
  const table2Index = pickIndex(tableCount);

  if(table1Index == table2Index) return noChange;

  const table1 = tables.get(table1Index);
  const table2 = tables.get(table2Index);

  const table1SeatIndex = pickIndex(table1.size);
  const table2SeatIndex = pickIndex(table2.size);

  const seat1 = table1.get(table1SeatIndex);
  const seat2 = table2.get(table2SeatIndex);

  // If the tables are the same, don't bother
  const t1Score = getTableScore(table1,mode);
  const t2Score = getTableScore(table2,mode);

  const initialScore = t1Score + t2Score;

  const seat1Next = seat1.set('guest', seat2.get('guest'));
  const seat2Next = seat2.set('guest', seat1.get('guest'));

  const table1Next = scoreTable(table1.set(table1SeatIndex, seat1Next), mode);
  const table2Next = scoreTable(table2.set(table2SeatIndex, seat2Next), mode);

  const t1NextScore = getTableScore(table1Next,mode);
  const t2NextScore = getTableScore(table2Next,mode);

  const nextScore = t1NextScore + t2NextScore;

  const change = nextScore - initialScore;

  const accepted = shouldAcceptChange(change, temperature, maxTemperature);

  if(!accepted) return noChange;


  // Add the changed tables to the table list
  const nextTables = tables.set(table1Index, table1Next).set(table2Index, table2Next);

  return {
    tables: nextTables,
    score: scoredTables.score + change,
  };
}

export const mutableStep = (scoredTables, temperature, maxTemperature, mode) => {

  const noChange = scoredTables;

  if(!scoredTables || !scoredTables.tables || !scoredTables.tables.length) return noChange;

  const tables = scoredTables.tables;

  const tableCount = tables.length;

  if(!tableCount) return noChange;

  const table1Index = pickIndex(tableCount);
  const table2Index = pickIndex(tableCount);

  if(table1Index == table2Index) return noChange;

  const table1 = tables[table1Index];
  const table2 = tables[table2Index];

  const table1SeatIndex = pickIndex(table1.length);
  const table2SeatIndex = pickIndex(table2.length);

  const seat1 = table1[table1SeatIndex];
  const seat2 = table2[table2SeatIndex];

  // If the tables are the same, don't bother
  const t1Score = getTableScore(table1,mode);
  const t2Score = getTableScore(table2,mode);

  const initialScore = t1Score + t2Score;

  const seat1Next = seat1.set('guest', seat2.get('guest'));
  const seat2Next = seat2.set('guest', seat1.get('guest'));

  const table1Next = scoreMutableTable(table1.set(table1SeatIndex, seat1Next), mode);
  const table2Next = scoreMutableTable(table2.set(table2SeatIndex, seat2Next), mode);

  const t1NextScore = getTableScoreMutable(table1Next,mode);
  const t2NextScore = getTableScoreMutable(table2Next,mode);

  const nextScore = t1NextScore + t2NextScore;

  const change = nextScore - initialScore;

  const accepted = shouldAcceptChange(change, temperature, maxTemperature);

  if(!accepted) return noChange;


  // Add the changed tables to the table list
  const nextTables = tables.set(table1Index, table1Next).set(table2Index, table2Next);

  return {
    tables: nextTables,
    score: scoredTables.score + change,
  };
}

export default step;
