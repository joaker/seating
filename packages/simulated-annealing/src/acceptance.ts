import type { AcceptanceFn } from './types';

export const metropolisAcceptance: AcceptanceFn = (energyDelta, temperature) => {
  if (energyDelta < 0) return true;
  if (temperature <= 0) return false;
  return Math.random() < Math.exp(-energyDelta / temperature);
};
