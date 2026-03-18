import shuffle from '../util/shuffle';
import GuestFactory from './GuestFactory';
import * as params from '../data/venue';
import { scoreTable } from './scorer';
import { SeatingAppState, OptimizationMode, Guest } from './types';

export const setState = (state: SeatingAppState, newState: any): SeatingAppState =>
  ({ ...state, ...newState });

export const resetState = (_state: SeatingAppState): SeatingAppState => ({} as SeatingAppState);

export const setGuests = (state: SeatingAppState, guests: any[]): SeatingAppState => {
  return { ...state, guests };
};

export const setRelationships = (state: SeatingAppState, relationships: Record<string, number[]> = {}): SeatingAppState => {
  return { ...state, relationships };
};

export const addGuest = (state: SeatingAppState, guest: any): SeatingAppState => {
  const guests = state.guests ?? [];
  return { ...state, guests: [...guests, guest] };
};

export const dropGuest = (state: SeatingAppState, guest: any): SeatingAppState => {
  const guests = state.guests ?? [];
  // TODO: Use a absolute equals
  return { ...state, guests: guests.filter((g: any) => g !== guest) };
};

export const seatGuest = (state: SeatingAppState, { guest = 'Unknown', seat = 0 }: { guest?: any; seat?: any }): SeatingAppState => {
  return (!guest || guest === 'Empty')
    ? clearSeat(state, seat)
    : { ...state, seats: { ...state.seats, [seat]: guest } };
};

export const clearSeat = (state: SeatingAppState, seat: any): SeatingAppState => {
  const { [seat]: _removed, ...remainingSeats } = state.seats ?? {};
  return { ...state, seats: remainingSeats };
};

export const clearTable = (state: SeatingAppState): SeatingAppState => {
  return { ...state, seats: {} };
};

export const setVenueGuests = (state: SeatingAppState, guests: any[] = [], ratio: number = 0): SeatingAppState => {
  return {
    ...state,
    venueGuests: guests,
    guestCount: guests.length,
    optimizeProgressRatio: ratio,
  };
};

const setVenueGuestList = (state: SeatingAppState, guests: any[] = []): SeatingAppState => {
  return { ...state, venueGuestList: guests };
};

export const populateVenue = (state: SeatingAppState): SeatingAppState => {
  const guestCount: number = state.guestCount;
  const maxHates: number = state.difficulty;
  const maxLikes: number = maxHates;
  const factory = new GuestFactory(guestCount, maxHates, maxLikes);
  const guests: Guest[] = factory.createAll();

  // note: shuffle mutates the list, so do this first
  const stateWithList = setVenueGuestList(state, guests);
  const randoGuests = shuffle(guests);

  const newState = { ...setVenueGuests(stateWithList, randoGuests), hasVenueScore: false };
  return newState;
};

export const scoreVenue = (state: SeatingAppState): SeatingAppState => {
  const guests: Guest[] = state.venueGuests ?? [];
  const tableSize: number = state.seatsPerTable;
  const mode: OptimizationMode = state.optimizationMode ?? params.defaultMode;

  if (!guests.length) return state;

  let score = 0;
  for (let i = 0; i < guests.length; i += tableSize) {
    score += scoreTable(guests.slice(i, i + tableSize), mode);
  }

  return { ...state, venueScore: score, hasVenueScore: true };
};

export const startOptimization = (state: SeatingAppState): SeatingAppState => {
  return { ...state, optimizing: new Date() };
};

export const endOptimization = (state: SeatingAppState): SeatingAppState => {
  const now = new Date();
  const stored = state.optimizing;
  const lastOptimization: Date = stored instanceof Date ? stored : now;

  const ms = now.getTime() - lastOptimization.getTime();
  const s = ms / 1000;
  const roundS = Math.round(s * 100) / 100;

  return { ...state, optimizing: false, lastRunTime: roundS };
};

export const setMaxDifficulty = (state: SeatingAppState, difficulty: number): SeatingAppState => {
  return { ...state, difficulty };
};

export const toggleVenueDetails = (state: SeatingAppState): SeatingAppState => {
  const nextExpansion = !state.venueDetailsExpanded;
  return { ...state, venueDetailsExpanded: nextExpansion };
};

export const setTemperature = (state: SeatingAppState, temperature: number): SeatingAppState => {
  return { ...state, temperature };
};

export const focusGuest = (state: SeatingAppState, guestID: number): SeatingAppState => {
  const guests: any[] = state.venueGuests ?? [];
  const guest = guests.find((g: any) => g.id === guestID);
  return { ...state, focusedGuest: guest };
};

export const clearFocusedGuest = (state: SeatingAppState): SeatingAppState => {
  const current = state.focusedGuest;
  if (!current) {
    return state;
  }
  const { focusedGuest: _removed, ...rest } = state;
  return rest as SeatingAppState;
};

export const setDraftProperty = (state: SeatingAppState, property: string, value: any): SeatingAppState => {
  const draft: Record<string, any> = state.draftConfig ?? {};
  const newDraft = { ...draft, [property]: value };
  return { ...state, draftConfig: newDraft };
};

export const commitDraft = (state: SeatingAppState): SeatingAppState => {
  const draft: Record<string, any> = state.draftConfig ?? {};
  const { draftConfig: _removed, ...stateWithoutDraft } = state;
  const stateWithDraft = { ...stateWithoutDraft, ...draft };

  const guestCount: number = stateWithDraft.guestCount || params.defaultVenueConfig.guestCount;
  const seatsPerTable: number = stateWithDraft.seatsPerTable || params.defaultVenueConfig.seatsPerTable;

  const tableCount = Math.ceil(guestCount / seatsPerTable);
  const seatCount = tableCount * seatsPerTable;

  return { ...stateWithDraft, tableCount, seatCount };
};

export const setMode = (state: SeatingAppState, mode: OptimizationMode): SeatingAppState => {
  return { ...state, optimizationMode: mode };
};

export const swapGuests = (state: SeatingAppState, source: number, target: number): SeatingAppState => {
  const list: any[] = state.venueGuests ?? [];
  const nextList = list.slice();
  nextList[source] = list[target];
  nextList[target] = list[source];
  return { ...state, venueGuests: nextList };
};
