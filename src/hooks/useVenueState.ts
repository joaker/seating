import { useSelector } from 'react-redux';
import * as params from '../data/venue';
import { SeatingAppState, Guest, OptimizationMode } from '../app/types';

export interface VenueState {
  guests: Guest[];
  guestCount: number;
  lastRunTime: number | undefined;
  seatsPerTable: number;
  score: number | undefined;
  hasScore: boolean | undefined;
  optimizing: Date | false;
  progressRatio: number | undefined;
  difficulty: number;
  expanded: boolean | undefined;
  temperature: number;
  mode: OptimizationMode;
}

/**
 * Encapsulates all useSelector calls for the venue state slice.
 */
export const useVenueState = (): VenueState => {
  const guests = useSelector((state: SeatingAppState) => state.venueGuests ?? []);
  const guestCount = useSelector((state: SeatingAppState) => state.guestCount);
  const lastRunTime = useSelector((state: SeatingAppState) => state.lastRunTime);
  const seatsPerTable = useSelector((state: SeatingAppState) => state.seatsPerTable);
  const score = useSelector((state: SeatingAppState) => state.venueScore);
  const hasScore = useSelector((state: SeatingAppState) => state.hasVenueScore);
  const optimizing = useSelector((state: SeatingAppState) => state.optimizing);
  const progressRatio = useSelector((state: SeatingAppState) => state.optimizeProgressRatio);
  const difficulty = useSelector((state: SeatingAppState) => state.difficulty);
  const expanded = useSelector((state: SeatingAppState) => state.venueDetailsExpanded);
  const temperature = useSelector((state: SeatingAppState) => state.temperature ?? params.defaultTemperature);
  const mode = useSelector((state: SeatingAppState) => state.optimizationMode ?? params.defaultMode);

  return {
    guests,
    guestCount,
    lastRunTime,
    seatsPerTable,
    score,
    hasScore,
    optimizing,
    progressRatio,
    difficulty,
    expanded,
    temperature,
    mode,
  };
};

export default useVenueState;
