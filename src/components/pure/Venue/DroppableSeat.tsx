import styles from '../../../style/dragdrop.module.scss';

import React from 'react';

import cnames from 'classnames/dedupe';
import { DropTarget } from 'react-dnd';

const DraggableTypes = {
  guest: 'guest',
};

const seatTarget = {
  canDrop: () => {
    const result = true && true;
    return result;
  },
  drop: (props: any, monitor: any) => {
    const item = monitor.getItem();
    const droppedSeatNumber = (item || {}).seatNumber;
    props.swapGuests(droppedSeatNumber, props.seatNumber);
  }
};

function collectTarget(connect: any, monitor: any) {
  const item = monitor.getItem() || {};
  const { guestID: sourceGuestID = -1, seatNumber: sourceSeatNumber = -1 } = item;
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    sourceGuestID,
    sourceSeatNumber,
  };
}

interface SeatContainerProps {
  guestList?: any;
  guestID?: number;
  sourceGuestID?: number;
  connectDropTarget: (el: React.ReactElement) => React.ReactElement | null;
  isOver: boolean;
  canDrop: boolean;
  className?: string;
  swapGuests?: (source: number, target: number) => void;
  seatNumber?: number;
  children?: React.ReactNode;
}

const getDescriptor = (guestList: any, guestID: number, sourceGuestID: number): string => {
  if (!(guestList && guestID >= 0 && sourceGuestID >= 0)) return '';

  const guest = guestList.get(guestID);

  const angry = guest.get('hates').includes(sourceGuestID);
  if (angry) {
    return styles.angry;
  }
  const happy = guest.get('likes').includes(sourceGuestID);
  if (happy) {
    return styles.happy;
  }

  return '';
};

const SeatContainer = React.memo((props: SeatContainerProps) => {
  const { guestList, guestID = -1, sourceGuestID = -1, connectDropTarget, isOver, className } = props;
  const descriptor = getDescriptor(guestList, guestID, sourceGuestID);
  const overClass = isOver ? styles.over : '';
  return connectDropTarget(
    <div className={cnames(className, styles.droppableSeat, descriptor, overClass)} style={{}}>
      {props.children}
    </div>
  );
});

// Cast to ComponentType<any> — react-dnd v2 HOC loses prop types at this boundary
const DroppableSeat: React.ComponentType<any> = React.memo(
  DropTarget(DraggableTypes.guest, seatTarget, collectTarget)(SeatContainer as any)
);

export default DroppableSeat;
