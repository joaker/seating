import styles from '../../style/venue.css';

import { connect } from 'react-redux';
import {List, Map} from 'immutable';
import {focusGuest} from '../../app/action_creators';


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

    // do any bindings to "this" that are needed in the constructor
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

    const hasFocus = data.focusState ? (styles.hasFocus || 'hasFocus') : 'unfocused';



    return (<div
      data-guest-id={guest.id}
      onClick={() => this.props.focusGuest(guest)}
      className={cnames(styles.seatArea, scoreClass, hasFocus, data.focusState)}
      >{''}</div>);
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

const getFocusState = (guest, focusedGuest) => {
  if(!focusedGuest || focusedGuest.id == null || focusedGuest.id == undefined) return '';

  if(guest.id == focusedGuest.id) return (styles.hasSelectFocus || 'hasSelectFocus');
  if(focusedGuest.hates && focusedGuest.hates.includes(guest.id)) return (styles.hasHateFocus || 'hasHateFocus');
  if(focusedGuest.likes && focusedGuest.likes.includes(guest.id)) return (styles.hasLikeFocus || 'hasLikeFocus');

  return '';
}

const mapStateForMatrix = (state = Map(), {start, end, }) => {

  const focusedGuest = state.get('focusedGuest', Map()).toJS();

  const tableSeats = state.get('venueGuests', List()).slice(start, end).toJS();
  const guestIDs = scorer.toIDs(tableSeats);

  const seatData = {};
  const scores = [];
  tableSeats.forEach((guest, tableIndex) => {
    const seatIndex = start + tableIndex;
    const score = scorer.scoreGuest(guest, guestIDs);
    const focusState = getFocusState(guest, focusedGuest);
    scores.push(score);
    seatData[seatIndex] = {
      guest,
      score,
      focusState,
    };
  });

  const tableScore = scores.join(',');
  //console.log('score for table ' + (start/9) + ': <' + tableScore + '>');

  return {
    seatData,
  };
}

const mapDispatchForMatrix = (dispatch) => ({
  focusGuest: (guest) => dispatch(focusGuest(guest)),
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

export default VenueTableCollection;
