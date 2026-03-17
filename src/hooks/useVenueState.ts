import { useSelector } from 'react-redux';
import { List } from 'immutable';
import * as params from '../data/venue';

export interface VenueState {
  guests: any[];
  guestCount: number;
  lastRunTime: any;
  seatsPerTable: number;
  score: any;
  hasScore: any;
  optimizing: any;
  progressRatio: any;
  difficulty: any;
  expanded: any;
  temperature: number;
  mode: string;
}

/**
 * Encapsulates all useSelector calls for the venue state slice.
 * Immutable.js boundary — all .get() calls return any per project rules.
 */
export const useVenueState = (): VenueState => {
  const guests = useSelector((state: any) => state.get('venueGuests', List()).toJS());
  const guestCount = useSelector((state: any) => state.get('guestCount'));
  const lastRunTime = useSelector((state: any) => state.get('lastRunTime'));
  const seatsPerTable = useSelector((state: any) => state.get('seatsPerTable'));
  const score = useSelector((state: any) => state.get('venueScore'));
  const hasScore = useSelector((state: any) => state.get('hasVenueScore'));
  const optimizing = useSelector((state: any) => state.get('optimizing'));
  const progressRatio = useSelector((state: any) => state.get('optimizeProgressRatio'));
  const difficulty = useSelector((state: any) => state.get('difficulty'));
  const expanded = useSelector((state: any) => state.get('venueDetailsExpanded'));
  const temperature = useSelector((state: any) => state.get('temperature', params.defaultTemperature));
  const mode = useSelector((state: any) => state.get('optimizationMode', params.defaultMode));

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
