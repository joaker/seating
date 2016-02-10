import express from 'express';
import {createStore} from 'redux';
import Server from 'socket.io';

import {setState, setGuests, setRelationships} from '../src/app/action_creators';
import {action_message} from '../src/app/messages';
import reducer from '../src/app/reducer';
import port from '../src/app/port';

import initialGuests from '../src/data/guests';
import relationships from '../src/data/relationships';
import logger from './logger';

const ioport = port + 1;

const ioserver = {
  start: (ioParam) => {

    logger('Creating IO.  ioParam is: ' + ioParam);

    const io = ioParam ? new Server(ioParam) : new Server().attach(ioport);


    logger('Starting IO server');

    const store = createStore(reducer);
    const sendState = (channel) => {
      logger('Sending state...');
      channel.emit(action_message, setState(store.getState()));
    };




    // Listen up for socket events
    io.on('connection', function (socket) {

      logger('Connection has been made!  Sending state.')

      // Send the initial state
      sendState(socket);

      // When actions are received, apply them
      socket.on(action_message, data => {

        store.dispatch(data);
      });
    });

    // When the store updates, notify all sockets
    // TODO: slice up the state updates instead of sending entire state
    store.subscribe(() => {
      console.log('server state changed...');
      sendState(io);
    });

    store.dispatch(setGuests(initialGuests));
    store.dispatch(setRelationships(relationships));
  }
};

export default ioserver;
