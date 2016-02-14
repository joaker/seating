import range from '../util/range';

const defaultLikeCount = 2;
const defaultHateCount = 2;
const defaultGuestCount = 100;

class GuestFactory {
  constructor(guestCount){
    const hateCount = defaultHateCount, likeCount = defaultLikeCount;
    this.guestCount = guestCount;
    this.hates = range(hateCount);
    this.likes = range(likeCount);
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
