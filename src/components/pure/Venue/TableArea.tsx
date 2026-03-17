import styles from '../../../style/venue.module.scss';

import React from 'react';
import cnames from 'classnames/dedupe';
import SeatMatrix from './SeatMatrix';

interface TableAreaProps {
  number: number;
  guestCount: number;
  seatsPerTable?: number;
  [key: string]: any;
}

const PureTableArea = React.memo((props: TableAreaProps) => {
  const { number, guestCount, seatsPerTable = 16 } = props;
  const start = number * seatsPerTable;
  const end = Math.min(start + seatsPerTable, guestCount);

  return (
    <div className={cnames(styles.tableArea)}>
      <div className={cnames(styles.tableName)}><label>Table {props.number}</label></div>
      <SeatMatrix {...props} start={start} end={end} />
    </div>
  );
});

export const TableArea = PureTableArea;

export default TableArea;
