import { metropolisAcceptance } from './acceptance';
import type { AnnealConfig, AnnealSnapshot, BatchConfig } from './types';

export function annealAsync<S>(
  initialState: S,
  initialEnergy: number,
  config: AnnealConfig<S>,
  batchConfig: BatchConfig<S>,
): Promise<AnnealSnapshot<S>> {
  const accept = config.acceptance ?? metropolisAcceptance;
  let state = initialState;
  let energy = initialEnergy;
  let bestState = initialState;
  let bestEnergy = initialEnergy;
  let temperature = config.initialTemperature;
  let step = 0;

  return new Promise((resolve) => {
    function runBatch() {
      const batchEnd = Math.max(temperature - batchConfig.batchSize, 0);

      while (temperature > batchEnd) {
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

        if (config.maxSteps !== undefined && step >= config.maxSteps) {
          const snapshot: AnnealSnapshot<S> = { state, energy, temperature, step, bestState, bestEnergy };
          batchConfig.onProgress(snapshot);
          resolve(snapshot);
          return;
        }
      }

      const snapshot: AnnealSnapshot<S> = { state, energy, temperature, step, bestState, bestEnergy };
      batchConfig.onProgress(snapshot);

      if (temperature <= 0) {
        resolve(snapshot);
        return;
      }

      setTimeout(runBatch, 0);
    }

    setTimeout(runBatch, 0);
  });
}
