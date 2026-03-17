import * as params from '../data/venue';
import { Guest, OptimizationMode, ModePart } from './types';

export const sameTable = (guest1Index: number, guest2Index: number, tableSize: number): boolean => {
  const start1 = guest1Index - (guest1Index % tableSize);
  const start2 = guest2Index - (guest2Index % tableSize);
  const same = start1 === start2;
  return same;
};

export const hateWeight = 1;
export const likeWeight = 0;
export const selectHate = (guest: Guest): number[] => guest && guest.hates;
export const selectLike = (guest: Guest): number[] => guest && guest.likes;

export const toIDs = (guests: Guest[]): number[] => {
  return guests.map(g => g.id);
};

const modePartChooser: Record<ModePart, (guest: Guest) => number[]> = {
  hate: selectHate,
  like: selectLike,
};

const modeToParts: Record<OptimizationMode, ModePart[]> = {
  hate: ['hate'],
  like: ['like'],
  best: ['hate', 'like'],
};

const modePartWeights: Record<ModePart, number> = {
  hate: -1,
  like: 1,
};

export const getGuestScores = (
  guest: Guest,
  neighborIDs: number[],
  mode: OptimizationMode = params.defaultMode,
): Record<ModePart, number> => {
  const scores = {} as Record<ModePart, number>;
  const modeParts = modeToParts[mode];

  for (const modePart of modeParts) {
    const modePartWeight = modePartWeights[modePart];
    const rawPartScore = scoreGuest(guest, neighborIDs, modePart);
    const weightedPartScore = rawPartScore * modePartWeight;
    scores[modePart] = weightedPartScore;
  }

  return scores;
};

export const scoreGuest = (
  guest: Guest,
  neighborIDs: number[],
  modePart: ModePart = params.defaultModePart,
): number => {
  const chooser = modePartChooser[modePart] || selectHate;
  const relates = chooser(guest);
  const score = neighborIDs.filter(gid => relates.includes(gid)).length;
  return score;
};

const countMatches = (guests: Guest[], ids: number[] | null, modePart: ModePart): number => {
  if (!ids) ids = toIDs(guests);

  const matchCounts = guests.map(g => {
    const guestScore = scoreGuest(g, ids as number[], modePart);
    return guestScore;
  });

  const totalMatches = matchCounts.reduce((total, c) => (total + c), 0);
  return totalMatches;
};

const makeCounter = (table: Guest[]) => {
  const guestIDs = toIDs(table);
  const counter = (mode: ModePart): number => countMatches(table, guestIDs, mode);
  return counter;
};

export const scoreTable = (table: Guest[], mode: OptimizationMode): number => {
  const counter = makeCounter(table);
  const modeParts = modeToParts[mode];
  const partialScores = modeParts.map(mp => counter(mp));

  const score = partialScores.reduce((total, partial, index) => {
    const modePart = modeParts[index];
    const partWeight = modePartWeights[modePart];
    const nextTotal = total + partial * partWeight;
    return nextTotal;
  }, 0);

  return score;
};
