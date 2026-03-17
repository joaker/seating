import { OptimizationMode, Guest } from './types';

interface ActionMeta {
  remote: boolean;
}

export const setState = (state: any) => ({
  meta: { remote: false } as ActionMeta,
  type: 'SET_STATE' as const,
  state,
});

export const setGuests = (guests: Guest[]) => ({
  meta: { remote: false } as ActionMeta,
  type: 'SET_GUESTS' as const,
  guests,
});

export const setRelationships = (relationships: object) => ({
  meta: { remote: false } as ActionMeta,
  type: 'SET_RELATIONSHIPS' as const,
  relationships,
});

export const addGuest = (guest: Guest) => ({
  meta: { remote: true } as ActionMeta,
  type: 'ADD_GUEST' as const,
  guest,
});

export const seatGuest = (guest: any, seat: any) => ({
  meta: { remote: true } as ActionMeta,
  type: 'SEAT_GUEST' as const,
  seating: { guest, seat },
});

export const clearSeat = (seat: any) => ({
  meta: { remote: true } as ActionMeta,
  type: 'CLEAR_SEAT' as const,
  seat,
});

export const clearTable = () => ({
  meta: { remote: true } as ActionMeta,
  type: 'CLEAR_TABLE' as const,
});

export const setVenueGuests = (guests: any[], ratio: number = 0) => ({
  meta: { remote: false } as ActionMeta,
  type: 'SET_VENUE_GUESTS' as const,
  guests,
  ratio,
});

export const populateVenue = (guestCount: number) => ({
  meta: { remote: false } as ActionMeta,
  type: 'POPULATE_VENUE' as const,
  guestCount,
});

export const scoreVenue = (tableSize: number) => ({
  meta: { remote: false } as ActionMeta,
  type: 'SCORE_VENUE' as const,
  tableSize,
});

export const startOptimization = () => ({
  meta: { remote: false } as ActionMeta,
  type: 'START_VENUE_OPTIMIZATION' as const,
});

export const endOptimization = () => ({
  meta: { remote: false } as ActionMeta,
  type: 'END_VENUE_OPTIMIZATION' as const,
});

export const setMaxDifficulty = (difficulty: number) => ({
  meta: { remote: false } as ActionMeta,
  type: 'SET_MAX_DIFFICULTY' as const,
  difficulty,
});

export const toggleVenueDetails = () => ({
  meta: { remote: false } as ActionMeta,
  type: 'TOGGLE_VENUE_DETAILS' as const,
});

export const setTemperature = (temperature: number) => ({
  meta: { remote: false } as ActionMeta,
  type: 'SET_TEMPERATURE' as const,
  temperature,
});

export const focusGuest = (guestID: number, force: boolean = false) => ({
  meta: { remote: false } as ActionMeta,
  type: 'FOCUS_GUEST' as const,
  guestID,
  force,
});

export const clearFocusedGuest = () => ({
  meta: { remote: false } as ActionMeta,
  type: 'CLEAR_FOCUSED_GUEST' as const,
});

export const setDraftProperty = (property: string, value: any) => ({
  meta: { remote: false } as ActionMeta,
  type: 'SET_DRAFT_PROPERTY' as const,
  property,
  value,
});

export const commitDraft = () => ({
  meta: { remote: false } as ActionMeta,
  type: 'COMMIT_DRAFT' as const,
});

export const setMode = (mode: OptimizationMode) => ({
  meta: { remote: false } as ActionMeta,
  type: 'SET_OPTIMIZATION_MODE' as const,
  mode,
});

export const swapGuests = (source: number, target: number) => ({
  meta: { remote: false } as ActionMeta,
  type: 'SWAP_GUESTS' as const,
  source,
  target,
});
