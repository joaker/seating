import range from '../util/range';

const defaultLikeCount = 3;
const defaultHateCount = 3;

const getRelationshipSize = (max) => Math.floor(Math.random() * max+1);
const relate = (count) => {
  const size = Math.round(Math.random() * count);
  const relationships = range(size);
  return relationships;
};

class GuestFactory {
  constructor(guestCount, maxHatred = defaultHateCount, maxLiking = defaultLikeCount){
    this.guestCount = guestCount;
    this.grumpyFactor = maxHatred;
    this.friendlyFactor = maxLiking;
  }

  randomGuestID(id){
    const guestID = Math.floor(Math.random() * this.guestCount);
    const randomID = guestID != id ? guestID : (guestID + 1);
    return randomID;
  }

  getRandomID(){
    const randomID = Math.floor(Math.random() * this.guestCount);
    return randomID;
  }

  createUniqueRandomID(currentIDs){
    let nextID = -1;
    while(nextID < 0 || currentIDs.includes(nextID)){
      nextID = this.getRandomID();
    }
    return nextID;
  }

  createRelationships(id, max){
    const size = getRelationshipSize(max);
    const relates = [id];
    while(relates.length < (size + 1)){
      const nextGuestID = this.createUniqueRandomID(relates);
      relates.push(nextGuestID);
    }
    // Remove the "id" relationship;
    relates.shift();
    return relates;
  }

  create(id){
    const hates = this.createRelationships(id, this.grumpyFactor);
    const likes = this.createRelationships(id, this.friendlyFactor);

    const guest = {
      id: id,
      hates: hates,
      likes: likes
    };
    return guest;
  }

  createAll(){
    const guests = range(this.guestCount).map(i => this.create(i));
    return guests;
  }
}

export default GuestFactory;
