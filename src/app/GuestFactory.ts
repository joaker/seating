import range from '../util/range';
import { Guest } from './types';

const defaultLikeCount = 3;
const defaultHateCount = 3;

const getRelationshipSize = (max: number): number => Math.floor(Math.random() * max + 1);

class GuestFactory {
  guestCount: number;
  grumpyFactor: number;
  friendlyFactor: number;

  constructor(guestCount: number, maxHatred: number = defaultHateCount, maxLiking: number = defaultLikeCount) {
    this.guestCount = guestCount;
    this.grumpyFactor = maxHatred;
    this.friendlyFactor = maxLiking;
  }

  randomGuestID(id: number): number {
    const guestID = Math.floor(Math.random() * this.guestCount);
    const randomID = guestID !== id ? guestID : (guestID + 1);
    return randomID;
  }

  getRandomID(): number {
    const randomID = Math.floor(Math.random() * this.guestCount);
    return randomID;
  }

  createUniqueRandomID(currentIDs: number[]): number {
    let nextID = -1;
    while (nextID < 0 || currentIDs.includes(nextID)) {
      nextID = this.getRandomID();
    }
    return nextID;
  }

  createRelationships(id: number, max: number): number[] {
    const size = getRelationshipSize(max);
    const relates: number[] = [id];
    while (relates.length < (size + 1)) {
      const nextGuestID = this.createUniqueRandomID(relates);
      relates.push(nextGuestID);
    }
    relates.shift();
    return relates;
  }

  create(id: number): Guest {
    const hates = this.createRelationships(id, this.grumpyFactor);
    const likes = this.createRelationships(id, this.friendlyFactor);
    const guest: Guest = { id, hates, likes };
    return guest;
  }

  createAll(): Guest[] {
    const guests = range(this.guestCount).map(i => this.create(i));
    return guests;
  }
}

export default GuestFactory;
