import range from '../util/range';

const defaultLikeCount = 4;
const defaultHateCount = 4;
const defaultGuestCount = 100;

const relate = (count) => {
  const size = Math.round(Math.random() * count);
  const relationships = range(size);
  return relationships;
};

class GuestFactory {
  constructor(guestCount){
    const hateCount = defaultHateCount, likeCount = defaultLikeCount;
    this.guestCount = guestCount;
    this.hates = relate(hateCount);
    this.likes = relate(likeCount);
  }

  randomGuestID(id){
    const guestID = Math.round(Math.random() * this.guestCount);
    const randomID = guestID != id ? guestID : (guestID + 1);
    return randomID;
  }

  create(id){
    const hates = this.likes.map(() => this.randomGuestID(id));
    const likes = this.likes.map(() => this.randomGuestID(id));

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
