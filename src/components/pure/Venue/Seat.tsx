import styles from '../../../style/venue.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import cnames from 'classnames/dedupe';
import sequal from 'shallowequal';
import DraggableGuest from './DraggableGuest';
import DroppableSeat from './DroppableSeat';

const angryStyle = styles.angry || 'angryGuest';
const happyStyle = styles.happy || 'happyGuest';

export const EmptySeat = () => (
  <div className={cnames(styles.seatAreaWrapper)}>
    <div className={cnames(styles.emptySeatCircle)} />
  </div>
);

interface SeatProps {
  seatNumber: number;
  guestID?: number;
  hateScore?: boolean;
  likeScore?: boolean;
  focusState?: string;
  focusReaction?: string;
  isDimmed?: boolean;
  hasGuest: boolean;
  focusGuest: (id: number, type: string) => void;
  clearFocusedGuest: (id: number, type: string) => void;
  swapGuests: (source: number, target: number) => void;
  [key: string]: any;
}

// Custom comparator: mirrors the original shouldComponentUpdate which ignored the
// `focusGuest` *callback* prop when deciding whether to re-render.
const areSeatPropsEqual = (prevProps: SeatProps, nextProps: SeatProps): boolean => {
  const prev = Object.assign({}, prevProps);
  const next = Object.assign({}, nextProps);
  delete (prev as any).focusGuest;
  delete (next as any).focusGuest;
  return sequal(prev, next);
};

export const Seat = React.memo((props: SeatProps) => {
  const { seatNumber, guestID, hateScore, likeScore, focusState, focusReaction, isDimmed, hasGuest, focusGuest, clearFocusedGuest, swapGuests } = props;
  const [justFocused, setJustFocused] = useState(false);
  const prevFocusRef = useRef(focusState);

  // Detect when this seat becomes focused and trigger pulse
  useEffect(() => {
    if (focusState && !prevFocusRef.current) {
      setJustFocused(true);
      const t = setTimeout(() => setJustFocused(false), 300);
      prevFocusRef.current = focusState;
      return () => clearTimeout(t);
    }
    prevFocusRef.current = focusState;
  }, [focusState]);

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
      className={cnames(styles.seatAreaWrapper, focusReaction, hasFocus, focusState, { [styles.dimmed]: isDimmed, [styles.justFocused]: justFocused })}>
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
        />
      </DraggableGuest>
    </DroppableSeat>
  );
}, areSeatPropsEqual);

export default Seat;
