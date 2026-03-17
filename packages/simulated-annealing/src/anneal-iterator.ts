import { metropolisAcceptance } from './acceptance';
import type { AnnealConfig, AnnealSnapshot } from './types';

export function* annealIterator<S>(
  initialState: S,
  initialEnergy: number,
  config: AnnealConfig<S>,
): Generator<AnnealSnapshot<S>> {
  const accept = config.acceptance ?? metropolisAcceptance;
  let state = initialState;
  let energy = initialEnergy;
  let bestState = initialState;
  let bestEnergy = initialEnergy;
  let temperature = config.initialTemperature;
  let step = 0;

  while (temperature > 0 && (config.maxSteps === undefined || step < config.maxSteps)) {
    const transition = config.neighbor(state, temperature);
    if (transition !== null && accept(transition.energyDelta, temperature)) {
      state = transition.nextState;
      energy += transition.energyDelta;
      if (energy < bestEnergy) {
        bestEnergy = energy;
        bestState = state;
      }
    }
    temperature = config.coolingSchedule(temperature, step);
    step++;
    yield { state, energy, temperature, step, bestState, bestEnergy };
  }
}
