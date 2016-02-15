import range from '../util/range';

const defaultLikeCount = 3;
const defaultHateCount = 3;
const defaultGuestCount = 100;

const relate = (count) => {
  const size = Math.round(Math.random() * count);
  const relationships = range(size);
  return relationships;
};

class GuestFactory {
  constructor(guestCount, hateProb = defaultHateCount, likeProb = defaultLikeCount){
    // const hateCount = defaultHateCount, likeCount = defaultLikeCount;
    this.guestCount = guestCount;
    this.grumpyFactor = hateProb;
    this.friendlyFactor = likeProb;
    // this.hates = relate(hateCount);
    // this.likes = relate(likeCount);
  }

  randomGuestID(id){
    const guestID = Math.floor(Math.random() * this.guestCount);
    const randomID = guestID != id ? guestID : (guestID + 1);
    return randomID;
  }

  create(id){
    const hates = relate(this.grumpyFactor).map(() => this.randomGuestID(id));//this.likes.map(() => this.randomGuestID(id));
    const likes = relate(this.friendlyFactor).map(() => this.randomGuestID(id));//this.likes.map(() => this.randomGuestID(id));

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
