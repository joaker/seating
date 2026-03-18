import { linearCooling } from '@joaker/simulated-annealing';
import { scoreTable, sameTable } from '../scorer';

// CONFIG_C values from the original const.js
const BATCH_SIZE = 100;
const BATCH_RATE = 4;
const BATCH_DELAY = 20;
const UPDATE_DELAY = 100;

const scaleMax = 10;

const pickGuest = (guestCount) => Math.floor(Math.random() * guestCount);

const getTable = (guestIndex, tableSize, guests) => {
  const start = guestIndex - (guestIndex % tableSize);
  const end = start + tableSize;
  return { start, end, guests: guests.slice(start, end) };
};

const makeNeighbor = (tableSize, mode) => (state) => {
  const { guests } = state;
  const guestCount = guests.length;

  const idx1 = pickGuest(guestCount);
  const idx2 = pickGuest(guestCount);

  if (sameTable(idx1, idx2, tableSize)) return null;

  const table1 = getTable(idx1, tableSize, guests);
  const table2 = getTable(idx2, tableSize, guests);

  const initialScore = scoreTable(table1.guests, mode) + scoreTable(table2.guests, mode);

  const t1GuestIdx = idx1 - table1.start;
  const t2GuestIdx = idx2 - table2.start;

  const newTable1Guests = table1.guests.slice();
  const newTable2Guests = table2.guests.slice();
  newTable1Guests[t1GuestIdx] = guests[idx2];
  newTable2Guests[t2GuestIdx] = guests[idx1];

  const nextScore = scoreTable(newTable1Guests, mode) + scoreTable(newTable2Guests, mode);
  const scoreDelta = nextScore - initialScore;

  const newGuests = guests.slice();
  newGuests[idx1] = guests[idx2];
  newGuests[idx2] = guests[idx1];

  return {
    nextState: { guests: newGuests, score: state.score + scoreDelta },
    energyDelta: -scoreDelta, // negate: library minimizes, SA maximizes score
  };
};

// Acceptance function that matches the original shouldAcceptChange behavior:
// scales temperature relative to maxTemperature into a 0-10 range
const makeAcceptance = (maxTemperature) => (energyDelta, temperature) => {
  if (energyDelta < 0) return true; // improvement (negated score means score got better)
  if (temperature <= 0) return false;
  const scaledTemperature = (temperature / maxTemperature) * scaleMax;
  const acceptanceMargin = Math.exp(-energyDelta / scaledTemperature);
  return Math.random() < acceptanceMargin;
};

export const optimizeSeating = (guests, initialScore, tableSize, maxTemperature, mode, relay) => {
  const initialState = { guests: guests.slice(), score: initialScore };

  relay.start();

  let batchCount = 0;

  const config = {
    initialTemperature: maxTemperature,
    coolingSchedule: linearCooling(1),
    neighbor: makeNeighbor(tableSize, mode),
    acceptance: makeAcceptance(maxTemperature),
  };

  // Use a custom async loop matching the original optimizer's batch/rate/delay behavior
  return new Promise((resolve) => {
    let state = initialState;
    let temperature = maxTemperature;
    let step = 0;

    function runBatch() {
      if (temperature < 1) {
        relay.finish(state.guests);
        resolve(state);
        return;
      }

      const batchEnd = Math.max(temperature - BATCH_SIZE, 0);
      for (let t = temperature; t > batchEnd; t--) {
        const transition = config.neighbor(state, t);
        if (transition !== null && config.acceptance(transition.energyDelta, t)) {
          state = transition.nextState;
        }
        step++;
      }

      batchCount++;
      temperature = batchEnd;

      const throttled = batchCount % BATCH_RATE;
      if (!throttled) {
        const ratio = (maxTemperature - temperature) / maxTemperature;
        relay.update(state.guests, ratio);
      }

      const nextDelay = throttled ? BATCH_DELAY : UPDATE_DELAY;
      setTimeout(runBatch, nextDelay);
    }

    setTimeout(runBatch, 0);
  });
};
