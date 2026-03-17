import { Map, List } from 'immutable';

export interface Guest {
  id: number;
  hates: number[];
  likes: number[];
}

// A guest list paired with a numeric score from the optimizer
export interface ScoredGuestList {
  guests: Guest[];
  score: number;
}

export type OptimizationMode = 'hate' | 'like' | 'best';
export type ModePart = 'hate' | 'like';

export interface VenueConfig {
  guestCount: number;
  seatsPerTable: number;
  tableCount: number;
  seatCount: number;
  difficulty: number;
}

export interface BatchConfig {
  batchSize: number;
  batchRate: number;
  batchDelay: number;
  updateDelay: number;
}

// The Immutable.js Map shape held by the Redux store.
// .get() / .set() on ImmutableMap use `any` at the boundary per project rules.
export type ImmutableMap = Map<string, any>;

export interface SeatingAppState {
  // Guest lists
  guests: List<any>;
  venueGuests: List<any>;
  venueGuestList?: List<any>;

  // Seating
  seats: Map<string | number, any>;

  // Configuration
  guestCount: number;
  seatsPerTable: number;
  tableCount?: number;
  seatCount?: number;
  difficulty: number;
  temperature: number;
  optimizationMode?: OptimizationMode;

  // Optimization state
  optimizing: Date | false;
  optimizeProgressRatio?: number;
  lastRunTime?: number;

  // Scoring
  venueScore?: number;
  hasVenueScore?: boolean;

  // UI
  focusedGuest?: any;
  venueDetailsExpanded?: boolean;
  draftConfig?: Map<string, any>;

  // Draft / relationships
  relationships?: Map<string, any>;
}
