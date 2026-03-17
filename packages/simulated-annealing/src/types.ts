export interface Transition<S> {
  nextState: S;
  energyDelta: number; // negative = improvement (minimization convention)
}

export type NeighborFn<S> = (state: S, temperature: number) => Transition<S> | null;

export type AcceptanceFn = (energyDelta: number, temperature: number) => boolean;

export type CoolingSchedule = (temperature: number, step: number) => number;

export interface AnnealConfig<S> {
  initialTemperature: number;
  coolingSchedule: CoolingSchedule;
  neighbor: NeighborFn<S>;
  acceptance?: AcceptanceFn;
  maxSteps?: number;
}

export interface AnnealSnapshot<S> {
  state: S;
  energy: number;
  temperature: number;
  step: number;
  bestState: S;
  bestEnergy: number;
}

export interface BatchConfig<S> {
  batchSize: number;
  onProgress: (snapshot: AnnealSnapshot<S>) => void;
}
