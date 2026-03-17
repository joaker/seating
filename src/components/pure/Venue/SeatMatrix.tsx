import styles from '../../../style/venue.module.scss';
import dndstyles from '../../../style/dragdrop.module.scss';

import React from 'react';
import cnames from 'classnames/dedupe';
import { useSelector, useDispatch } from 'react-redux';
import { List, Map } from 'immutable';

import { focusGuest, scoreVenue, swapGuests as swapGuestsAction } from '../../../app/action-creators';
import * as params from '../../../data/venue';
import * as scorer from '../../../app/scorer';
import { OptimizationMode } from '../../../app/types';

import range from '../../../util/range';
import { Seat } from './Seat';

const getRowRange = (rowWidth: number, rowIndex: number = 0, startOffset: number = 0, max: number = Number.MAX_VALUE): number[] => {
  const rowStart = startOffset + rowIndex * rowWidth;
  const rowEnd = Math.min(rowStart + rowWidth, max);
  if (rowStart >= rowEnd) return [];
  return range(rowEnd, rowStart);
};

const isGuest = (guest: any): boolean => {
  var validGuest = !(!guest || guest.id == null || guest.id == undefined);
  return validGuest;
};

const hasRelation = (source: any, target: any, type: string): boolean => {
  const relates = (source[type] && source[type].includes(target.id));
  return relates;
};

const hasHate = (source: any, target: any) => hasRelation(source, target, 'hates');
const hasLike = (source: any, target: any) => hasRelation(source, target, 'likes');

// Get a style for the guest's reaction to the focused guest
const getFocusReaction = (guest: any, focusedGuest: any): string => {
  const noReaction = '';
  if (!isGuest(focusedGuest)) return noReaction;

  if (hasHate(guest, focusedGuest)) {
    return dndstyles.angry;
  }

  if (hasLike(guest, focusedGuest)) {
    return dndstyles.happy;
  }

  return noReaction;
};

// Get a style for the focused guest's reaction to the guest
const getFocusState = (guest: any, focusedGuest: any): string => {
  if (!isGuest(focusedGuest)) return '';

  if (guest.id == focusedGuest.id) return (styles.hasSelectFocus || 'hasSelectFocus');
  if (hasHate(focusedGuest, guest)) return (styles.hasHateFocus || 'hasHateFocus');
  if (hasLike(focusedGuest, guest)) return (styles.hasLikeFocus || 'hasLikeFocus');

  return '';
};

interface SeatMatrixProps {
  number?: number;
  seatsPerTable?: number;
  guestCount?: number;
  start: number;
  end: number;
  // edge is passed through Layout→TableArea spread; optional here because
  // TypeScript can't see it through the index signature on TableAreaProps
  edge?: number;
  [key: string]: any;
}

const SeatMatrix = (props: SeatMatrixProps) => {
  const { seatsPerTable = params.seatsPerTable, start, end, edge = 1 } = props;

  const dispatch = useDispatch();

  // Inline mapStateForMatrix — Immutable.js boundary, use any per project rules
  const focusedGuest: any = useSelector((state: any) =>
    state.get('focusedGuest', Map()).toJS()
  );
  const mode = useSelector((state: any) =>
    state.get('optimizationMode', params.defaultMode) as OptimizationMode
  );
  const tableSeats: any[] = useSelector((state: any) =>
    state.get('venueGuests', List()).slice(start, end).toJS()
  );

  const guestIDs = scorer.toIDs(tableSeats);

  const seatData: Record<number, any> = {};
  tableSeats.forEach((guest: any, tableIndex: number) => {
    const seatIndex = start + tableIndex;
    const score = scorer.getGuestScores(guest, guestIDs, mode);
    const focusState = getFocusState(guest, focusedGuest);
    const focusReaction = getFocusReaction(guest, focusedGuest);
    seatData[seatIndex] = {
      guest,
      score,
      focusState,
      focusReaction,
    };
  });

  // Inline mapDispatchForMatrix
  const focusGuestFn = (guest: any) => dispatch(focusGuest(guest));
  const swapGuests = (source: number, target: number) => {
    dispatch(swapGuestsAction(source, target));
    dispatch(scoreVenue(seatsPerTable));
  };

  const rows = range(edge).map((rowIndex: number) => {
    return (
      <div key={'row' + rowIndex} className={cnames('matrixRow', styles.matrixRow)}>
        {getRowRange(edge, rowIndex, start, end).map((seatNumber: number) => {
          const data = seatData[seatNumber] || {};
          const { guest, score = {}, focusState, focusReaction } = data;
          const { hate: hateScore, like: likeScore } = score;
          const guestID = guest && guest.id;
          const info = { seatNumber, guestID, hateScore, likeScore, focusState, focusReaction, focusGuest: focusGuestFn, swapGuests, clearFocusedGuest: focusGuestFn };
          return (
            <Seat key={seatNumber} {...info} hasGuest={!!guest} />
          );
        })}
      </div>
    );
  });

  return (<div className={cnames(styles.seatMatrix)}>{rows}</div>);
};

export default SeatMatrix;
