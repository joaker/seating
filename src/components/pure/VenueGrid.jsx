import styles from '../../style/venue.scss';
import cnames from 'classnames/dedupe';
import React from 'react';
import range from '../../util/range';

import VenueSeat from './VenueSeat';

const VenueGrid = ({height, width, table}) => {

  const margin = 0;
  const marginPercent = 2 + '%';
  const allMargin = margin * 4;

  const size = (100.0 - (width*allMargin)) / width;
  const sizePercent = size + '%';
  const seatStyle = {
    display: 'inline-block',
    textAlign: 'center',
    width: sizePercent,
    height: '1em',
    backgroundColor: 'transparent',
    border: '1px solid white',
    // marginLeft: marginPercent,
    // marginBottom: margin-Percent,
    // margin: marginPercent,
  };

  const tableStart = height * width * table;
  const tableEnd = tableStart + (height*width); // Exclusive
  const rows = range(height).map(row => {
    const rowStart = row * width;
    const seats = range(width).map(col => {
      const seatNumber = rowStart + col;
      return (
        <div key={col} className={styles.seatWrapper} style={seatStyle}>
          <VenueSeat seat={seatNumber} tableStart={tableStart} tableEnd={tableEnd}/>
        </div>);
    });
    return(
      <div key={row} className={styles.tableRow}>
        {seats}
      </div>
    );
  });
  return (
    <div className={cnames(styles.seatRow)} style={{textAlign: 'center'}}>
      {rows}
    </div>
  );
}

export default VenueGrid;
