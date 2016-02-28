import styles from '../../style/venue.scss';

import * as params from '../../data/venue.js';

import React from 'react';
import cnames from 'classnames/dedupe';

import range from '../../util/range';
import VenueGrid from './VenueGrid';

const Table = ({table}) => {
  return (
    <div className={styles.table}>
      <div><label>Table {table}</label></div>
      <VenueGrid height={params.tableRowCount} width={params.tableColumnCount} table={table}></VenueGrid>
    </div>
  );
};

const Cell = ({children}) => {
  const cellType = children ? styles.content : styles.buffer;
  return (
    <div className={cnames('venueCell', styles.cell, 'col-xs-1', cellType)}>
      {children}
    </div>
  );
}

const Row = ({numbers}) => {
  const tables = numbers.map(table => (
    <Cell key={table}><Table table={table}/></Cell>
  ));
  return (
    <div className={cnames('venueRow', 'row')}>
      <Cell key={"buffer-left"} />
      {tables}
    </div>
  );
}

const getMatrix = (rowCount, columnCount) => range(rowCount).map(rowIndex => {
  const rowStart = rowIndex * columnCount;
  const rowEnd = rowStart + columnCount;
  const row = range(rowEnd, rowStart);
  return row;
});



const VenueLayout = ({rowCount, columnCount}) => {
  const matrix = getMatrix(rowCount, columnCount);
  const rows = matrix.map( (numbers, index) => (<Row key={index} numbers={numbers} />));

  return (
    <div className={cnames(styles.venueGrid, 'container-fluid')}>
      {rows}
    </div>
  );
}

export default VenueLayout;
