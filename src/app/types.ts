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

export interface SeatingAppState {
  // Guest lists
  guests: Guest[];
  venueGuests: Guest[];
  venueGuestList?: Guest[];

  // Seating
  seats: Record<string | number, Guest>;

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
  focusedGuest?: Guest;
  venueDetailsExpanded?: boolean;
  draftConfig?: Record<string, number>;

  // Draft / relationships
  relationships?: Record<string, number[]>;
}
