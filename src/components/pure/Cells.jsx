import styles from '../../style/table.css';
import guestStyles from '../../style/guests.css';

import cnames from 'classnames/dedupe';
import {List, Map} from 'immutable';
import React from 'react';
import {Link} from 'react-router';
import { connect } from 'react-redux';

import { seatGuest } from '../../app/action_creators';
import range from '../../util/range';


export const BufferCell = () => (<div className={cnames('bufferCell col-md-1')}></div>);

export const TableCell = ({seatIndex, seats = {}, columnsPerSeat = 1}) => (
    <div className={cnames(styles.tableCell, 'tableCell', ("col-md-" + columnsPerSeat))}>
        <div className="hidden">Table Cell</div>
    </div>
);

const placeholder = 'Empty';

const EmptyPlace = (props) => (<div className={cnames(styles.emptyPlace)}>{placeholder}</div>);
const GuestPlace = (props) => (<div className={cnames(styles.guestPlace, 'glyphicon','glyphicon-user')} aria-hidden="true"></div>)

const showAvailableGuests = (seatIndex, history, location) => {
  const current = (location && location.pathname) || '/Table';
  const next = (current + '/' + seatIndex);
  history.push(next);
}

const PlaceIcon = ({guest}) => (
  <div className={cnames(styles.placeSeat, styles.place)}>
    {guest ? (<GuestPlace />) : (<EmptyPlace />)}
  </div>
);

const PlaceName = ({guest}) => (
  <div className={cnames(styles.placeName, styles.place, 'noselect')}>
    {guest || 'Open Seat'}
  </div>
);

export const SeatCell = ({seatIndex, seats, columnsPerSeat, rowIndex, history, location}) => {
  const colClass = "col-md-" + columnsPerSeat;
  const guest = seats[seatIndex];
  const seatingStyle = guest ? styles.seated : styles.unseated;

  let lines = [
    (<PlaceName guest={guest} key="b" />),
    (<PlaceIcon guest={guest} key="a" />),
    ];

  // if the row is facing down, flip the order
  if(rowIndex) lines = lines.reverse();

  return (
    <div className={cnames(styles.seat, seatingStyle, colClass)} onClick={showAvailableGuests.bind(this, seatIndex, history, location)}>
      {lines}
    </div>
  );
};
