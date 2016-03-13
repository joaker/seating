import styles from '../../../style/venue.scss';
import dndstyles from '../../../style/dragdrop.scss';

import React from 'react';
import cnames from 'classnames/dedupe';
import { connect } from 'react-redux';
import {List, Map} from 'immutable';
import sequal from 'shallowequal';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import {focusGuest, clearFocusedGuest, scoreVenue, swapGuests as swapGuestsAction} from '../../../app/action_creators';
import * as params from '../../../data/venue.js';
import * as scorer from '../../../app/scorer';

import range from '../../../util/range';
import purify from '../Pure';
import SeatMatrix from './SeatMatrix';

const getEdgeSize = (seatCount) => Math.ceil(Math.sqrt(seatCount));

const PureTableArea = (props) => {
  const {number, guestCount, seatsPerTable} = props;
  const start = number * seatsPerTable;
  const end = Math.min(start + seatsPerTable, guestCount);

  return (
    <div className={cnames(styles.tableArea)}>
      <div className={cnames(styles.tableName)}><label>Table {props.number}</label></div>
      <SeatMatrix {...props} start={start} end={end}/>
    </div>
  );
};

export const TableArea = purify(PureTableArea);

export default TableArea;
