import { useDispatch } from 'react-redux';
import { startOptimization, endOptimization, setVenueGuests, scoreVenue } from '../app/action-creators';
import { optimizeSeating } from '../app/optimization/seating-adapter';
import * as params from '../data/venue';
import { OptimizationMode } from '../app/types';

/**
 * Builds the optimization dispatch relay and wraps the call to optimizeSeating.
 * Consumers call optimize() instead of wiring the relay manually.
 */
export const useOptimizer = () => {
  const dispatch = useDispatch();

  const optimize = (
    guests: any[],
    temperature: number = params.defaultTemperature,
    score: any,
    tableSize: number,
    mode: OptimizationMode = params.defaultMode,
  ) => {
    const relay = {
      start: () => dispatch(startOptimization()),
      update: (list: any[], ratio: number) => dispatch(setVenueGuests(list, ratio)),
      finish: (list: any[]) => {
        dispatch(setVenueGuests(list, 1));
        dispatch(endOptimization());
        dispatch(scoreVenue(tableSize));
      },
    };

    return optimizeSeating(guests, score, tableSize, temperature, mode, relay);
  };

  return optimize;
};

export default useOptimizer;
