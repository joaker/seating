import styles from '../style/table.css';
import guestStyles from '../style/guests.css';

import cnames from 'classnames/dedupe';
import {List, Map} from 'immutable';
import React from 'react';
import {Link} from 'react-router';
import { connect } from 'react-redux';

import { seatGuest } from '../app/action_creators';
import range from '../util/range';

import TableRow from './pure/TableRow';

const maxColumns = 12;
const offsetColumns = 2;
const maxSeatCount = (maxColumns - offsetColumns) * 2;
const defaultSeatCount = 14;

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
        <div className={cnames('seatingTable', styles.seatingTable)}>
          <TableRow {...this.props} rowIndex={0} />
          <TableRow {...this.props} table={true} />
          <TableRow {...this.props} rowIndex={1} />
        </div>
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
    guests: state.get('guests', List()).toJS() || [],
    relationships: state.get('relationships', Map()).toJS()
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
