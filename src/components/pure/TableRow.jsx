import styles from '../../style/table.css';
import guestStyles from '../../style/guests.css';

import cnames from 'classnames/dedupe';
import {List, Map} from 'immutable';
import React from 'react';
import {Link} from 'react-router';
import { connect } from 'react-redux';

import { seatGuest } from '../../app/action_creators';
import range from '../../util/range';

import {BufferCell, TableCell, SeatCell} from './Cells';


// A row of seats along a table
const TableRow = (props = {}) => {
  let {seatsPerSide, rowIndex = 0, table} = props;

  const start = seatsPerSide * rowIndex;
  const end = start + seatsPerSide;

  const bufferStart = start - 1;
  const bufferEnd = end; // this is an inclusive index

  const r = range;
  const cells = range(bufferEnd, bufferStart);

  const rowSeats = cells.map(i => {
    if((i == bufferStart || i == bufferEnd)) return <BufferCell key={i} />;
    const cell = table ?
      (<TableCell key={i} {...props} />) :
      (<SeatCell key={i} {...props} seatIndex={i}/>);
    return cell;
  });

  const rowClass = table ? 'tableTableRow' : 'seatingRow';

  return (
    <div className={cnames(rowClass, styles.tableRow, 'row')}>
      {rowSeats}
    </div>
  );
};

export default TableRow;
