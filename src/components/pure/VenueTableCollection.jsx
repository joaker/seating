import styles from '../../style/venue.css';

import { connect } from 'react-redux';
import {List, Map} from 'immutable';

import * as params from '../../data/venue.js';
import * as scorer from '../../app/scorer';
import React from 'react';
import cnames from 'classnames/dedupe';

import range from '../../util/range';
import VenueGrid from './VenueGrid';

const EmptySeat = () => (<div className={cnames(styles.seatArea, styles.emptySeat)}/>);
// const Seat = (props = {}) => {
class Seat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    // Bind instance methods that need the "this" context
    this.toggleFocus = this.toggleFocus.bind(this);
  }

  toggleFocus(){
    const lastFocus = this.state.focus;
    const nextFocus = !lastFocus;

    this.setState({focused: nextFocus});
  }

  render(){
    const {seatNumber, seatData = {}} = this.props;
    const data = seatData[seatNumber];
    if(!data) return (<EmptySeat/>);
    const {guest, score} = seatData[seatNumber];



    const emptySeat = !guest;// || !guest.id;
    if(emptySeat) return (<EmptySeat/>);

    const scoreClass = score ? styles.angry : styles.neutral;

    const showGuest = true;
    const content = showGuest ? guest.id : seatNumber;

    const focused = this.state.focus;
    const focusClass = focused ? styles.focused : styles.unfocused;

    return (<div onClick={() => this.toggleFocus()} className={cnames(styles.seatArea, scoreClass, focusClass)}>{''}</div>);
  }
}

const getEdgeSize = (seatCount) => Math.ceil(Math.sqrt(seatCount));

const getRowRange = (rowWidth, rowIndex = 0, startOffset = 0, max = Number.MAX_VALUE) =>{
  const rowStart = startOffset + rowIndex * rowWidth;
  const rowEnd = Math.min(rowStart + rowWidth, max);
  if(rowStart >= rowEnd) return [];
  return range(rowEnd, rowStart);
}

const UnconnectedSeatMatrix = (props) => {
  const {number, seatsPerTable, guestCount, start, end, edge} = props;

  const rows = range(edge).map(rowIndex => {
    return (
      <div key={'row' + rowIndex} className={cnames('matrixRow', styles.matrixRow)}>
        {getRowRange(edge, rowIndex, start, end).map(seatNumber => (
          <Seat {...props} key={seatNumber} seatNumber={seatNumber} />
        ))}
      </div>
    );
  });

  return (<div className={cnames(styles.seatMatrix)} >{rows}</div>);
}

const mapStateForMatrix = (state = Map(), {start, end, }) => {

  const tableSeats = state.get('venueGuests', List()).slice(start, end).toJS();
  const guestIDs = scorer.toIDs(tableSeats);

  const seatData = {};
  const scores = [];
  tableSeats.forEach((guest, tableIndex) => {
    const seatIndex = start + tableIndex;
    const score = scorer.scoreGuest(guest, guestIDs);
    scores.push(score);
    seatData[seatIndex] = {
      guest,
      score
    };
  });

  const tableScore = scores.join(',');
  console.log('score for table ' + (start/9) + ': <' + tableScore + '>');

  return {
    seatData,
  };
}

const mapDispatchForMatrix = (dispatch) => ({
});

const SeatMatrix = connect(
  mapStateForMatrix,
  mapDispatchForMatrix
)(UnconnectedSeatMatrix);

const TableArea = (props) => {
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

const VenueTableCollection = (props) => {
  const {guestCount, seatsPerTable = 15} = props;
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

export default VenueTableCollection;
