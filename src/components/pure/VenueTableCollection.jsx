import styles from '../../style/venue.scss';
import dndstyles from '../../style/dragdrop.scss';

import { connect } from 'react-redux';
import {List, Map} from 'immutable';
import sequal from 'shallowequal';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import {focusGuest, clearFocusedGuest, scoreVenue, swapGuests as swapGuestsAction} from '../../app/action_creators';
import * as params from '../../data/venue.js';
import * as scorer from '../../app/scorer';
import React from 'react';
import cnames from 'classnames/dedupe';

import range from '../../util/range';
import DraggableGuest from './DraggableGuest';
import DroppableSeat from './DroppableSeat';

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
    const {seatNumber, guestID, hateScore, likeScore, focusState, focusReaction, hasGuest, focusGuest, clearFocusedGuest, swapGuests} = this.props;
    const emptySeat = !hasGuest;// || !guest.id;
    if(emptySeat) return (<EmptySeat/>);

    //const { hate: hateScore, like: likeScore } = score;

    const scoreClass = (hateScore && angryStyle) ||
      (likeScore && happyStyle) ||
      styles.neutral;


    //const scoreClass = score ? styles.angry : styles.neutral;

    const showGuest = true;
    const content = showGuest ? guestID : seatNumber;

    const hasFocus = focusState ? (styles.hasFocus || 'hasFocus') : 'unfocused';




    return (
      <DroppableSeat
        swapGuests={swapGuests}
        seatNumber={seatNumber}
        guestID={guestID}
        className={cnames(styles.seatAreaWrapper, focusReaction)}>
        <DraggableGuest {...this.props}
          guestID={guestID}
          seatNumber={seatNumber}
          setDragFocus={() => focusGuest(guestID, 'dragging')}
          clearFocusedGuest={() => clearFocusedGuest(guestID, 'dragging')}
          >
        <div
          data-guest-id={guestID}
          onMouseDown={() => focusGuest(guestID, 'guestChosen')}
          className={cnames(styles.seatArea, scoreClass, hasFocus, focusState)}
          >{''}
        </div>
      </DraggableGuest>
    </DroppableSeat>
    );
  }
}

const getEdgeSize = (seatCount) => Math.ceil(Math.sqrt(seatCount));

const getRowRange = (rowWidth, rowIndex = 0, startOffset = 0, max = Number.MAX_VALUE) =>{
  const rowStart = startOffset + rowIndex * rowWidth;
  const rowEnd = Math.min(rowStart + rowWidth, max);
  if(rowStart >= rowEnd) return [];
  return range(rowEnd, rowStart);
}

const isGuest = (guest) => {
  var validGuest = !(!guest || guest.id == null || guest.id == undefined);
  return validGuest;
}
const hasRelation = (source, target, type) => {
  const relates = (source[type] && source[type].includes(target.id));
  return relates;
}

const hasHate = (source, target) => hasRelation(source, target, 'hates');
const hasLike = (source, target) => hasRelation(source, target, 'likes');

// Get a style for the guest's reaction to the focused guest
const getFocusReaction = (guest, focusedGuest) => {
  const noReaction = '';
  if(!isGuest(focusedGuest)) return noReaction;

  if(hasHate(guest, focusedGuest)){
    return dndstyles.angry;
  }

  if(hasLike(guest, focusedGuest)){
    return dndstyles.happy;
  }

  return noReaction;
}

// Get a style for the focused guest's reaction to the guest
const getFocusState = (guest, focusedGuest) => {
  if(!isGuest(focusedGuest)) return '';

  if(guest.id == focusedGuest.id) return (styles.hasSelectFocus || 'hasSelectFocus');
  if(hasHate(focusedGuest, guest)) return (styles.hasHateFocus || 'hasHateFocus');
  if(hasLike(focusedGuest, guest)) return (styles.hasLikeFocus || 'hasLikeFocus');
  //if(focusedGuest.likes && focusedGuest.likes.includes(guest.id)) return (styles.hasLikeFocus || 'hasLikeFocus');

  return '';
}

const UnconnectedSeatMatrix = (props) => {
  const {number, seatsPerTable, guestCount, start, end, edge} = props;
  const {seatData = {}, focusGuest, swapGuests, clearFocusedGuest} = props;
  const rows = range(edge).map(rowIndex => {
    return (
      <div key={'row' + rowIndex} className={cnames('matrixRow', styles.matrixRow)}>
        {getRowRange(edge, rowIndex, start, end).map(seatNumber => {
          const data = seatData[seatNumber] || {};
          const {guest, score = {}, focusState, focusReaction} = data;
          const {hate: hateScore, like: likeScore} = score;
          const guestID = guest && guest.id;
          const info = { seatNumber, guestID, hateScore, likeScore, focusState, focusReaction, focusGuest, swapGuests, clearFocusedGuest};
          return (
            <Seat  key={seatNumber} {...info} hasGuest={!!guest}/>
          );
        })}
      </div>
    );
  });

  return (<div className={cnames(styles.seatMatrix)} >{rows}</div>);
}

// const getFocusState = (guest, focusedGuest) => {
//   if(!focusedGuest || focusedGuest.id == null || focusedGuest.id == undefined) return '';
//
//   if(guest.id == focusedGuest.id) return (styles.hasSelectFocus || 'hasSelectFocus');
//   if(focusedGuest.hates && focusedGuest.hates.includes(guest.id)) return (styles.hasHateFocus || 'hasHateFocus');
//   if(focusedGuest.likes && focusedGuest.likes.includes(guest.id)) return (styles.hasLikeFocus || 'hasLikeFocus');
//
//   return '';
// }

const mapStateForMatrix = (state = Map(), {start, end, }) => {

  const focusedGuest = state.get('focusedGuest', Map()).toJS();
  const mode = state.get('optimizationMode', params.defaultMode);

  const tableSeats = state.get('venueGuests', List()).slice(start, end).toJS();
  const guestIDs = scorer.toIDs(tableSeats);

  const seatData = {};
  const scores = [];
  tableSeats.forEach((guest, tableIndex) => {
    const seatIndex = start + tableIndex;
    // TODO: what to do
    const score = scorer.getGuestScores(guest, guestIDs, mode);
    const focusState = getFocusState(guest, focusedGuest);
    const focusReaction = getFocusReaction(guest, focusedGuest);
    scores.push(score);
    seatData[seatIndex] = {
      guest,
      score,
      focusState,
      focusReaction,
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
  swapGuests: (source, target) => {
    dispatch(swapGuestsAction(source, target));
    dispatch(scoreVenue());
  },
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const nextProps = Object.assign({}, stateProps, dispatchProps, ownProps);

  const keys = Object.keys(nextProps);

  return nextProps;
}

const SeatMatrix = connect(
  mapStateForMatrix,
  mapDispatchForMatrix,
  mergeProps,
  {pure: true}
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
