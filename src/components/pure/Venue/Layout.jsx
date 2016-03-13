import styles from '../../../style/venue.scss';
import dndstyles from '../../../style/dragdrop.scss';

import { connect } from 'react-redux';
import {List, Map} from 'immutable';
import sequal from 'shallowequal';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import {focusGuest, clearFocusedGuest, scoreVenue, swapGuests as swapGuestsAction} from '../../../app/action_creators';
import * as params from '../../../data/venue.js';
import * as scorer from '../../../app/scorer';
import React from 'react';
import cnames from 'classnames/dedupe';

import range from '../../../util/range';
import purify from '../Pure';
import TableArea from './TableArea';

const getEdgeSize = (seatCount) => Math.ceil(Math.sqrt(seatCount));

const Layout = (props) => {
  const {guestCount, seatsPerTable = 25} = props;
  const edge = getEdgeSize(seatsPerTable);
  const tableCount = Math.ceil(guestCount / seatsPerTable);
  const tables = range(tableCount).map((number ) => {
    const others = {key: number, tableCount, number, edge, };
    return (
      <TableArea {...props} {...others} />
    );
  });
  const edgeClass = styles['edge-' + edge];
  return (
    <div className={cnames(styles.tableCollection, edgeClass, 'container-fluid')}>
      {tables}
    </div>
  );
}

export default purify(Layout);
