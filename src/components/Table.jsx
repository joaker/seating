import styles from '../style/table.css';
import guestStyles from '../style/guests.css';

import cnames from 'classnames/dedupe';
import {List, Map} from 'immutable';
import React from 'react';
import {Link} from 'react-router';
import { connect } from 'react-redux';

import { seatGuest } from '../app/action_creators';

const maxColumns = 12;
const offsetColumns = 2;
const maxSeatCount = (maxColumns - offsetColumns) * 2;
const defaultSeatCount = 14;

const placeholder = 'Empty';

const EmptyPlace = (props) => (<div className={cnames(styles.emptyPlace)}>{placeholder}</div>);
const GuestPlace = (props) => (<div className={cnames(styles.guestPlace, 'glyphicon','glyphicon-user')} aria-hidden="true"></div>)

const showAvailableGuests = (seatIndex, history, location) => {
  const current = (location && location.pathname) || '/Table';
  const next = (current + '/' + seatIndex);
  history.push(next);
}

const PlaceIcon = ({guest}) => {
  return (
    <div className={cnames(styles.placeSeat, styles.place)}>
      {guest ? (<GuestPlace />) : (<EmptyPlace />)}
    </div>
  );
}

const PlaceName = ({guest}) => {
  var name = guest || 'Open Seat';
  return (
    <div className={cnames(styles.placeName, styles.place, 'noselect')}>
      {name}
    </div>
  );
}

const Seat = ({seatIndex, seats, columnsPerSeat, rowIndex, history, location}) => {
  const colClass = "col-md-" + columnsPerSeat;
  const guest = seats[seatIndex];
  const seatingStyle = guest ? styles.seated : styles.unseated;

  let lines = [
    (<PlaceName guest={guest} key="b" />),
    (<PlaceIcon guest={guest} key="a" />),
    ];

  // if the row is facing down, flip the order
  if(rowIndex) lines = lines.reverse();

  return (
    <div className={cnames(styles.seat, seatingStyle, colClass)} onClick={showAvailableGuests.bind(this, seatIndex, history, location)}>
      {lines}
    </div>
  );
};

const TableCell = ({seatIndex, seats = {}, columnsPerSeat = 1}) => {
  var colClass = "col-md-" + columnsPerSeat;
  return (
    <div className={cnames(styles.tableCell, 'tableCell', colClass)}>
        <div className="hidden">Table Cell</div>
    </div>
  );
};

const BufferCell = () => {
  return (
    <div className={cnames('bufferCell col-md-1')}>

    </div>
  );
};


// A row of seats along a table
const TableSeatingRow = (props = {}) => {
  let {seatsPerSide, rowIndex = 0} = props;
  let rowSeats = [];

  const start = seatsPerSide * rowIndex;
  const end = start + seatsPerSide;

  for(let i = start; i < end; i++){
    rowSeats.push(<Seat key={i} {...props} seatIndex={i}/>)
  }

  return (
    <div className={cnames('seatingRow', styles.tableRow, 'row')}>
      <BufferCell/>
      {rowSeats}
      <BufferCell/>
    </div>
  );
};

// A row representing a table itself
const TableTableRow = (props = {}) => {
  let {seatsPerSide, rowIndex = 0} = props;
  let rowSeats = [];

  const start = seatsPerSide * rowIndex;

  for(let i = 0; i < seatsPerSide; i++){
    rowSeats.push(<TableCell key={i} {...props} />)
  }

  return (
    <div className={cnames('tableTableRow', styles.tableRow, 'row')}>
      <BufferCell/>
      {rowSeats}
      <BufferCell/>
    </div>
  );
};


class Table extends React.Component {
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

    return (
      <div className="Table">
        <h3>Table</h3>
      <div className={cnames('seatingTable', styles.seatingTable)}></div>
        <TableSeatingRow {...this.props} rowIndex={0} />
        <TableTableRow {...this.props} />
        <TableSeatingRow {...this.props} rowIndex={1} />

        <ul className="guests">
          {
            this.props.guests.map(g => (
              <li key={g} className={cnames(guestStyles.guest)}>
                <Link to={`/Guest/` + g }>{g}</Link>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

const getSeatCount = (state) => Math.min((state.get('seatCount') || defaultSeatCount), maxSeatCount);

const mapStateToProps = (state = Map(), props = {}) => {
  var seatCount = getSeatCount(state);
  var seatsPerSide = seatCount / 2;
  var columnsPerSeat = Math.floor((maxColumns-2)/seatsPerSide);

  return {
    seatCount: seatCount,
    seatsPerSide: seatsPerSide,
    columnsPerSeat: columnsPerSeat,
    seats: state.get('seats', Map()).toJS() || {},
    guests: state.get('guests', List()).toJS() || []
  };
};

const mapDispatchToProps = (dispatch) => ({
  seatGuest: (guest,seat) => dispatch(addGuest( guest, seat ))
});

const ConnectedTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(Table)
export default ConnectedTable;
