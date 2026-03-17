import styles from '../../../style/venue.module.scss';
import React from 'react';
import cnames from 'classnames/dedupe';

import range from '../../../util/range';
import TableArea from './TableArea';

const getEdgeSize = (seatCount: number) => Math.ceil(Math.sqrt(seatCount));

const tableMinSize = (seatsPerTable: number): string => {
  if (seatsPerTable <= 4) return '80px';
  if (seatsPerTable <= 9) return '100px';
  if (seatsPerTable <= 16) return '140px';
  if (seatsPerTable <= 25) return '180px';
  return '320px';
};

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

  const gridStyle = {
    '--table-min-size': tableMinSize(seatsPerTable),
  } as React.CSSProperties;

  return (
    <div
      className={cnames(styles.tableCollection)}
      style={gridStyle}
    >
      {tables}
    </div>
  );
});

export default Layout;
