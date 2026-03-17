import Immutable, { List, Map } from 'immutable';
import shuffle from '../util/shuffle';
import GuestFactory from './GuestFactory';
import * as params from '../data/venue';
import { scoreTable } from './scorer';
import { ImmutableMap, OptimizationMode, Guest } from './types';

export const setState = (state: ImmutableMap, newState: any): ImmutableMap =>
  state.merge(newState);

export const resetState = (_state: ImmutableMap): ImmutableMap => Map();

export const setGuests = (state: ImmutableMap, guests: any[]): ImmutableMap => {
  return state.set('guests', List(guests));
};

export const setRelationships = (state: ImmutableMap, relationships: object = {}): ImmutableMap => {
  return state.set('relationships', Immutable.fromJS(relationships));
};

export const addGuest = (state: ImmutableMap, guest: any): ImmutableMap => {
  return state.update(
    'guests',
    List(),
    (guests: any) => guests.push(guest),
  );
};

export const dropGuest = (state: ImmutableMap, guest: any): ImmutableMap => {
  return state.update(
    'guests',
    List(),
    // TODO: Use a absolute equals
    (guests: any) => guests.filter((g: any) => g !== guest),
  );
};

export const seatGuest = (state: ImmutableMap, { guest = 'Unknown', seat = 0 }: { guest?: any; seat?: any }): ImmutableMap => {
  return (!guest || guest === 'Empty')
    ? clearSeat(state, seat)
    : state.setIn(['seats', seat], guest);
};

export const clearSeat = (state: ImmutableMap, seat: any): ImmutableMap => {
  return state.deleteIn(['seats', seat]);
};

export const clearTable = (state: ImmutableMap): ImmutableMap => {
  return state.set('seats', Map());
};

export const setVenueGuests = (state: ImmutableMap, guests: any[] = [], ratio: number = 0): ImmutableMap => {
  const venueGuests = Immutable.fromJS(guests);
  const newState = state
    .set('venueGuests', venueGuests)
    .set('guestCount', guests.length)
    .set('optimizeProgressRatio', ratio);
  return newState;
};

export const setVenueGuestList = (state: ImmutableMap, guests: any[] = []): ImmutableMap => {
  const venueGuestList = Immutable.fromJS(guests);
  const newState = state.set('venueGuestList', venueGuestList);
  return newState;
};

export const populateVenue = (state: ImmutableMap): ImmutableMap => {
  const guestCount: number = state.get('guestCount');
  const maxHates: number = state.get('difficulty');
  const maxLikes: number = maxHates;
  const factory = new GuestFactory(guestCount, maxHates, maxLikes);
  const guests: Guest[] = factory.createAll();

  // note: shuffle mutates the list, so do this first
  const stateWithList = setVenueGuestList(state, guests);
  const randoGuests = shuffle(guests);

  const newState = setVenueGuests(stateWithList, randoGuests).set('hasVenueScore', false);
  return newState;
};

export const scoreVenue = (state: ImmutableMap): ImmutableMap => {
  const guests: Guest[] = state.get('venueGuests').toJS();
  const tableSize: number = state.get('seatsPerTable');
  const mode: OptimizationMode = state.get('optimizationMode', params.defaultMode);

  if (!guests.length) return state;

  let score = 0;
  for (let i = 0; i < guests.length; i += tableSize) {
    score += scoreTable(guests.slice(i, i + tableSize), mode);
  }

  const newState = state.set('venueScore', score).set('hasVenueScore', true);
  return newState;
};

export const startOptimization = (state: ImmutableMap): ImmutableMap => {
  const newState = state.set('optimizing', new Date());
  return newState;
};

export const endOptimization = (state: ImmutableMap): ImmutableMap => {
  const now = new Date();
  const stored = state.get('optimizing');
  const lastOptimization: Date = stored instanceof Date ? stored : now;

  const ms = now.getTime() - lastOptimization.getTime();
  const s = ms / 1000;
  const roundS = Math.round(s * 100) / 100;

  const newState = state.set('optimizing', false).set('lastRunTime', roundS);
  return newState;
};

export const setMaxDifficulty = (state: ImmutableMap, difficulty: number): ImmutableMap => {
  const newState = state.set('difficulty', difficulty);
  return newState;
};

export const toggleVenueDetails = (state: ImmutableMap): ImmutableMap => {
  const nextExpansion = !state.get('venueDetailsExpanded');
  const newState = state.set('venueDetailsExpanded', nextExpansion);
  return newState;
};

export const setTemperature = (state: ImmutableMap, temperature: number): ImmutableMap => {
  const newState = state.set('temperature', temperature);
  return newState;
};

export const focusGuest = (state: ImmutableMap, guestID: number, force: boolean = false): ImmutableMap => {
  const guests: any = state.get('venueGuests', List());
  const immutableGuest = guests.find((g: any) => g.get('id') === guestID);
  const newState = state.set('focusedGuest', immutableGuest);
  return newState;
};

export const clearFocusedGuest = (state: ImmutableMap): ImmutableMap => {
  const current = state.get('focusedGuest');
  if (!current) {
    return state;
  }
  const unfocusedState = state.delete('focusedGuest');
  return unfocusedState;
};

export const setDraftProperty = (state: ImmutableMap, property: string, value: any): ImmutableMap => {
  const draft: any = state.get('draftConfig', Map());
  const newDraft = draft.set(property, value);
  const newState = state.set('draftConfig', newDraft);
  return newState;
};

const defaultConfig = {
  guestCount: params.guestCount,
  seatsPerTable: params.seatsPerTable,
  difficulty: params.difficulty,
};

export const commitDraft = (state: ImmutableMap): ImmutableMap => {
  const draft: any = state.get('draftConfig', Map());
  const stateWithDraft = state.merge(draft).delete('draftConfig');

  const guestCount: number = stateWithDraft.get('guestCount') || defaultConfig.guestCount;
  const seatsPerTable: number = stateWithDraft.get('seatsPerTable') || defaultConfig.seatsPerTable;

  const tableCount = Math.ceil(guestCount / seatsPerTable);
  const seatCount = tableCount * seatsPerTable;

  const tableProps = Immutable.fromJS({ tableCount, seatCount }) as ImmutableMap;
  const newState = stateWithDraft.merge(tableProps) as ImmutableMap;
  return newState;
};

export const setMode = (state: ImmutableMap, mode: OptimizationMode): ImmutableMap => {
  const newState = state.set('optimizationMode', mode);
  return newState;
};

export const swapGuests = (state: ImmutableMap, source: number, target: number): ImmutableMap => {
  const list: any = state.get('venueGuests');
  const nextList = list.set(source, list.get(target)).set(target, list.get(source));
  const swappedState = state.set('venueGuests', nextList);
  const nextState = swappedState;
  return nextState;
};
