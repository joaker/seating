import styles from '../../../style/venue.module.scss';
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
