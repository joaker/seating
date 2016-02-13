import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.ObjectId;

export const guestSchema = mongoose.Schema({
    name: String,
    friends: [{ type : ObjectId, ref: 'Guest' }],
    enemies: [{type: ObjectId, ref: 'Guest'}]
});

guestSchema.methods.likes = (otherID) => this.friends && this.friends.includes(otherID);
guestSchema.methods.hates = (otherID) => this.enemies && this.enemies.includes(otherID);


const Guest = mongoose.model('Guest', guestSchema);

export default Guest;
