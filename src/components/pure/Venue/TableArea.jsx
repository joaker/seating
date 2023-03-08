import styles from '../../../style/venue.scss';

import React from 'react';
import cnames from 'classnames/dedupe';
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
