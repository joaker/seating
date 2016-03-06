import styles from '../../style/venue.scss';

import { connect } from 'react-redux';
import {List, Map} from 'immutable';
import sequal from 'shallowequal';


import {focusGuest} from '../../app/action_creators';
import * as params from '../../data/venue.js';
import * as scorer from '../../app/scorer';
import React from 'react';
import cnames from 'classnames/dedupe';

import range from '../../util/range';

const EmptyList = List();
const EmptyMap = Map();


const angryStyle = styles.angry || 'angryGuest';
const happyStyle = styles.happy || 'happyGuest';

const EmptySeat = () => (<div className={cnames(styles.seatAreaWrapper)}><div className={cnames(styles.seatArea, styles.emptySeat)}/></div>);
// const Seat = (props = {}) => {
//const Seat = ({seatNumber, guestID, score, focusState, hasGuest, focusGuest}) => {
class Seat extends React.Component{
  constructor(props){
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState){

    const next = Object.assign({}, nextProps)
    const thisun = Object.assign({}, this.props);

    delete next.focusGuest;
    delete thisun.focusGuest;

    var skipUpdate = sequal(next, thisun);

    return !skipUpdate;

  }
    // const {seatNumber, seatData = {}} = this.props;
    // const data = seatData[seatNumber];
    // if(!data) return (<EmptySeat/>);
    // const {guest, score} = seatData[seatNumber];

  render(){
    const {seatNumber, hasGuest, seatState, focusedGuest, guestList, focusGuest} = this.props;

    //const info = {seatState, hasGuest, focusedGuest, mode, table};
    const emptySeat = !hasGuest;// || !guest.id;
    if(emptySeat) return (<EmptySeat/>);

    const guestID = seatState.getIn(['guest', 'id']);

    const focusState = getSeatFocus(seatState, focusedGuest);
    const seatScores = (seatState.get('score')).toJS() || {};

    const { hate: hateScore, like: likeScore } = seatScores;

    const scoreClass = (hateScore && angryStyle) ||
      (likeScore && happyStyle) ||
      styles.neutral;


    //const scoreClass = score ? styles.angry : styles.neutral;

    const showGuest = true;
    const content = showGuest ? guestID : seatNumber;

    const hasFocus = focusState ? (styles.hasFocus || 'hasFocus') : 'unfocused';




    return (
      <div className={cnames(styles.seatAreaWrapper)}>
        <div
          data-guest-id={guestID}
          onClick={() => focusGuest(guestID)}
          className={cnames(styles.seatArea, scoreClass, hasFocus, focusState)}
          >{''}
        </div>
      </div>
    );
  }
}

const EmptyRelation = List();
const getSeatFocus = (seat, focusedGuest) => {
  if(!seat || !seat.hasIn(['guest', 'id'])) return '';
  if(!focusedGuest || !focusedGuest.has('id')) return '';


  const seatGuestID = seat.getIn(['guest', 'id']);
  if(focusedGuest.get('id') == seatGuestID) return (styles.hasSelectFocus || 'hasSelectFocus');
  if(focusedGuest.get('hates', EmptyRelation).includes(seatGuestID)) return (styles.hasHateFocus || 'hasHateFocus');
  if(focusedGuest.get('likes', EmptyRelation).includes(seatGuestID)) return (styles.hasLikeFocus || 'hasLikeFocus');

  return '';
}


const getEdgeSize = (seatCount) => Math.ceil(Math.sqrt(seatCount));

const getRowRange = (rowWidth, rowIndex = 0, startOffset = 0, max = Number.MAX_VALUE) =>{
  const rowStart = startOffset + rowIndex * rowWidth;
  const rowEnd = Math.min(rowStart + rowWidth, max);
  if(rowStart >= rowEnd) return [];
  return range(rowEnd, rowStart);
}

const UnconnectedSeatMatrix = (props) => {
  const { focusedGuest, mode, table, guestList} = props;
  const { number, seatsPerTable, guestCount, start, end, edge} = props;
  const {seatData = {}, focusGuest} = props;

  let seatCounter = 0;
  const rows = range(edge).map(rowIndex => {
    return (
      <div key={'row' + rowIndex} className={cnames('matrixRow', styles.matrixRow)}>
        {getRowRange(edge, rowIndex, start).map(seatNumber => {
          // const data = seatData[seatNumber] || {};
          // const {guest, score, focusState} = data;
          // const guestID = guest && guest.id;
          // const info = { seatNumber, guestID, score, focusState, focusGuest };
          const seatState = table.get(seatCounter++);
          const hasGuest = seatState && seatState.get('guest');
          const info = {seatState, hasGuest, focusedGuest, mode, guestList, focusGuest};
          return (
            <Seat  key={seatNumber} {...info} />
          );
        })}
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

const mapStateForMatrix = (state = Map(), {start, end, number}) => {

  const table = state.get('venueTables', EmptyList).get(number, EmptyList);
  const guestList = state.get('venueGuestList');

  const focusedGuest = state.get('focusedGuest', EmptyMap);//.toJS();
  const mode = state.get('optimizationMode', params.defaultMode);


  const focusedGuestID = focusedGuest.get('id');
  console.log(focusedGuestID);

  return {
    table,
    focusedGuest,
    mode,
    guestList,
  };
}

const mapDispatchForMatrix = (dispatch) => ({
  focusGuest: (guest) => dispatch(focusGuest(guest)),
});

// const mergeProps = (stateProps, dispatchProps, ownProps) => {
//   const nextProps = Object.assign({}, stateProps, dispatchProps, ownProps);
//
//   const keys = Object.keys(nextProps);
//
//   return nextProps;
// }

const SeatMatrix = connect(
  mapStateForMatrix,
  mapDispatchForMatrix
  // mergeProps,
  // {pure: true}
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
  const {tableCount = 0, guestCount, seatsPerTable = 25} = props;
  const edge = getEdgeSize(seatsPerTable);
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
