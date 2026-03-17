import styles from '../../../style/venue.module.scss';
import React from 'react';
import cnames from 'classnames/dedupe';

import range from '../../../util/range';
import TableArea from './TableArea';

const getEdgeSize = (seatCount: number) => Math.ceil(Math.sqrt(seatCount));

interface LayoutProps {
  guestCount: number;
  seatsPerTable?: number;
  [key: string]: any;
}

const Layout = React.memo((props: LayoutProps) => {
  const { guestCount, seatsPerTable = 25 } = props;
  const edge = getEdgeSize(seatsPerTable);
  const tableCount = Math.ceil(guestCount / seatsPerTable);
  const tables = range(tableCount).map((number: number) => {
    const others = { key: number, tableCount, number, edge };
    return (
      <TableArea {...props} {...others} />
    );
  });
  const edgeClass = (styles as any)['edge-' + edge];
  return (
    <div className={cnames(styles.tableCollection, edgeClass, 'container-fluid')}>
      {tables}
    </div>
  );
});

export default Layout;
