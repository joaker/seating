import styles from '../../../style/venue.module.scss';
import dndstyles from '../../../style/dragdrop.module.scss';

import React from 'react';
import cnames from 'classnames/dedupe';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';

import { focusGuest, scoreVenue, swapGuests as swapGuestsAction } from '../../../app/action_creators';
import * as params from '../../../data/venue.js';
import * as scorer from '../../../app/scorer';

import range from '../../../util/range';
import { Seat } from './Seat'

const getRowRange = (rowWidth, rowIndex = 0, startOffset = 0, max = Number.MAX_VALUE) => {
  const rowStart = startOffset + rowIndex * rowWidth;
  const rowEnd = Math.min(rowStart + rowWidth, max);
  if (rowStart >= rowEnd) return [];
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
  if (!isGuest(focusedGuest)) return noReaction;

  if (hasHate(guest, focusedGuest)) {
    return dndstyles.angry;
  }

  if (hasLike(guest, focusedGuest)) {
    return dndstyles.happy;
  }

  return noReaction;
}

// Get a style for the focused guest's reaction to the guest
const getFocusState = (guest, focusedGuest) => {
  if (!isGuest(focusedGuest)) return '';

  if (guest.id == focusedGuest.id) return (styles.hasSelectFocus || 'hasSelectFocus');
  if (hasHate(focusedGuest, guest)) return (styles.hasHateFocus || 'hasHateFocus');
  if (hasLike(focusedGuest, guest)) return (styles.hasLikeFocus || 'hasLikeFocus');
  //if(focusedGuest.likes && focusedGuest.likes.includes(guest.id)) return (styles.hasLikeFocus || 'hasLikeFocus');

  return '';
}

const UnconnectedSeatMatrix = (props) => {
  const { number, seatsPerTable, guestCount, start, end, edge } = props;
  const { seatData = {}, focusGuest, swapGuests, clearFocusedGuest } = props;
  const rows = range(edge).map(rowIndex => {
    return (
      <div key={'row' + rowIndex} className={cnames('matrixRow', styles.matrixRow)}>
        {getRowRange(edge, rowIndex, start, end).map(seatNumber => {
          const data = seatData[seatNumber] || {};
          const { guest, score = {}, focusState, focusReaction } = data;
          const { hate: hateScore, like: likeScore } = score;
          const guestID = guest && guest.id;
          const info = { seatNumber, guestID, hateScore, likeScore, focusState, focusReaction, focusGuest, swapGuests, clearFocusedGuest };
          return (
            <Seat key={seatNumber} {...info} hasGuest={!!guest} />
          );
        })}
      </div>
    );
  });

  return (<div className={cnames(styles.seatMatrix)} >{rows}</div>);
}

const mapStateForMatrix = (state = Map(), { start, end, }) => {

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

const SeatMatrix = connect(
  mapStateForMatrix,
  mapDispatchForMatrix
)(UnconnectedSeatMatrix);

export default SeatMatrix;
