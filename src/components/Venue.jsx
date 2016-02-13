import styles from '../style/venue.css';

import cnames from 'classnames/dedupe';
import {List, Map} from 'immutable';
import React from 'react';
import {Link} from 'react-router';
import { connect } from 'react-redux';

import range from '../util/range';

const maxColumns = 12;
const offsetColumns = 2;
const contentColumns = 10;

const tablesPerRow = 10;
const guestsPerTable = 16;
const tableCount = 100;
const rowCount = tableCount / tablesPerRow + Math.round(tableCount / tablesPerRow);

const tableColumnCount = 3;
const tableRowCount = 3;
const seatsPerTable = tableColumnCount * tableRowCount;


const rows = range(rowCount).map(rowIndex => {
  const rowStart = rowIndex * tablesPerRow;
  const rowEnd = rowStart + tablesPerRow;
  const row = range(rowEnd, rowStart);
  return row;
});

const UnconnectedSeat = ({seat, happy}) => {
  const moodClass = happy ? styles.happy : styles.unhappy;
  return (
    <div className={cnames("GuestSeat", styles.seat, moodClass)}>

  </div>)
}

const mapStateSeat = (props, ownProps) => {
  return {
    ownProps,
    happy: (ownProps.seat % 2)
  };
}

const mapDispatchSeat = (dispatch) => ({
});

const Seat = connect(
  mapStateSeat,
  mapDispatchSeat
)(UnconnectedSeat);
//export default Seat;

const Grid = ({height, width, table}) => {

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

  const guestStart = height * width * table;
  const rows = range(height).map(row => {
    const rowStart = row * width;
    const seats = range(width).map(col => {
      const seatNumber = rowStart + col;
      return (<div key={col} className={styles.seatWrapper} style={seatStyle}>
        <Seat seat={seatNumber}/>
      </div>);
    })
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

const VTable = ({table}) => {
  return (
    <div className={styles.table}>
      <div><label>Table {table}</label></div>
      <Grid height={tableRowCount} width={tableColumnCount} table={table}></Grid>
    </div>
  );
};

const VenueCell = ({children, table, isBuffer}) => {
  return (
    isBuffer ? <div className={cnames('venueCell', styles.cell, 'col-xs-1', styles.buffer)}></div> :
    <div className={cnames('venueCell', styles.cell, 'col-xs-1')}>
      <VTable table={table}>{children}</VTable>
    </div>);
}

const VenueRow = ({row}) => {
  const tables = row.map(table => (<VenueCell key={table} table={table}>Table #{table}</VenueCell>));
  return (
    <div className={cnames('venueRow', 'row')}>
      <VenueCell key={"buffer"} isBuffer={true}></VenueCell>
      {tables}
    </div>
  );
}

class Venue extends React.Component {
  constructor(props) {
    super(props);
    //this.state = {count: props.initialCount};

    // Bind instance methods that need the "this" context
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
    var state = this.state || {};
    this.setState({ newGuest: event.target.value });
  }

  render(){
    const vRows = rows.map( (row, index) => (<VenueRow key={index} row={row} />));
    return (
      <div className={cnames(styles.venue, "Venue")}>
        <div className={cnames('headerTable', 'container-fluid')}>
          <div className={cnames('row')}>
            <div className={cnames('col-xs-12')}>
              <h2 style={{display: 'block'}}>
                Venue
              </h2>
            </div>
          </div>
        </div>
        <div className={cnames(styles.venueGrid, 'container-fluid')}>
          {vRows}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state = Map(), props = {}) => {
  return {
    guests: state.get('venueGuests', Map()).toJS(),
  };
};

const populate = {
  type: 'POPULATE_VENUE',
}
const mapDispatchToProps = (dispatch) => ({
  populate: () => dispatch(populate)
});

const ConnectedVenue = connect(
  mapStateToProps,
  mapDispatchToProps
)(Venue)
export default ConnectedVenue;
