import styles from '../../../style/venue.module.scss';
import React from 'react';
import cnames from 'classnames/dedupe';
import sequal from 'shallowequal';
import DraggableGuest from './DraggableGuest';
import DroppableSeat from './DroppableSeat';

const angryStyle = styles.angry || 'angryGuest';
const happyStyle = styles.happy || 'happyGuest';

export const EmptySeat = () => (
  <div className={cnames(styles.seatAreaWrapper)}>
    <div className={cnames(styles.seatArea, styles.emptySeat)} />
  </div>
);

interface SeatProps {
  seatNumber: number;
  guestID?: number;
  hateScore?: boolean;
  likeScore?: boolean;
  focusState?: string;
  focusReaction?: string;
  hasGuest: boolean;
  focusGuest: (id: number, type: string) => void;
  clearFocusedGuest: (id: number, type: string) => void;
  swapGuests: (source: number, target: number) => void;
  // focusGuest prop is intentionally excluded from memo comparison (see below)
  [key: string]: any;
}

// Custom comparator: mirrors the original shouldComponentUpdate which ignored the
// `focusGuest` *callback* prop when deciding whether to re-render.
const areSeatPropsEqual = (prevProps: SeatProps, nextProps: SeatProps): boolean => {
  const prev = Object.assign({}, prevProps);
  const next = Object.assign({}, nextProps);
  // The original class deleted `focusGuest` from both sides before comparing,
  // so changes to that callback alone never trigger a re-render.
  delete (prev as any).focusGuest;
  delete (next as any).focusGuest;
  return sequal(prev, next);
};

export const Seat = React.memo((props: SeatProps) => {
  const { seatNumber, guestID, hateScore, likeScore, focusState, focusReaction, hasGuest, focusGuest, clearFocusedGuest, swapGuests } = props;

  const emptySeat = !hasGuest;
  if (emptySeat) return (<EmptySeat />);

  const scoreClass = (hateScore && angryStyle) ||
    (likeScore && happyStyle) ||
    styles.neutral;

  const hasFocus = focusState ? (styles.hasFocus || 'hasFocus') : 'unfocused';

  return (
    <DroppableSeat
      swapGuests={swapGuests}
      seatNumber={seatNumber}
      guestID={guestID}
      className={cnames(styles.seatAreaWrapper, focusReaction, hasFocus, focusState)}>
      <DraggableGuest
        {...props}
        guestID={guestID}
        seatNumber={seatNumber}
        setDragFocus={() => focusGuest(guestID!, 'dragging')}
        clearFocusedGuest={() => clearFocusedGuest(guestID!, 'dragging')}
      >
        <div
          data-guest-id={guestID}
          onMouseDown={() => focusGuest(guestID!, 'guestChosen')}
          className={cnames(styles.guest, 'fa', 'fa-user', scoreClass)}
        >{''}</div>
      </DraggableGuest>
    </DroppableSeat>
  );
}, areSeatPropsEqual);

export default Seat;
