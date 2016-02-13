import mongoose from 'mongoose';
//import assert from 'assert';


export const dbname = 'seatable';

export const dbURL = 'mongodb://localhost:27017/' + dbname;

const db = {
  execute: (action) => {
    mongoose.connect(dbURL);
    const connection = mongoose.connection;

    connection.on('error', () => {
      console.log('Mongoose encountered an error connecting to the data store');
    });

    connection.once('open', action);
  }
}

export default db;
