import type { CoolingSchedule } from './types';

export function linearCooling(rate = 1): CoolingSchedule {
  return (temperature) => temperature - rate;
}

export function geometricCooling(alpha = 0.99): CoolingSchedule {
  return (temperature) => temperature * alpha;
}

export function logarithmicCooling(c = 1): CoolingSchedule {
  return (temperature, step) => c / Math.log(1 + step);
}
