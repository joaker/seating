import styles from '../../../style/dragdrop.scss';

import React from 'react';

import cnames from 'classnames/dedupe';
import { DropTarget } from 'react-dnd';

import purify from '../Pure'

const DraggableTypes = {
  guest: 'guest',
};

const seatTarget = {
  canDrop: () => {
    const result = true && true;
    return result;
  },
  drop: (props, monitor) => {
    const item = monitor.getItem();
    const droppedSeatNumber = (item || {}).seatNumber;
    props.swapGuests(droppedSeatNumber, props.seatNumber );
  }
};


function collectTarget(connect, monitor) {
  const item = monitor.getItem() || {};
  const {guestID: sourceGuestID = -1, seatNumber: sourceSeatNumber = -1 } = item;
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    sourceGuestID,
    sourceSeatNumber,
  }
}

const getTargetOpinion = (guestID) => {
  if(guestID < 0) return '';
}

class UnconnectedSeatContainer extends React.Component {
  getDescriptor(guestList, guestID, sourceGuestID){
    if(!(guestList && guestID >= 0 && sourceGuestID >= 0)) return '';

    const guest = guestList.get(guestID);

    const angry = guest.get('hates').includes(sourceGuestID);
    if(angry){
      return styles.angry;
    }
    const happy = guest.get('likes').includes(sourceGuestID);
    if(happy){
      return styles.happy;
    }

    return '';
  }

  render() {
    const { guestList, guestID = -1, sourceGuestID, connectDropTarget, isOver, canDrop, className } = this.props;
    const descriptor = this.getDescriptor(guestList, guestID, sourceGuestID);
    const overClass = isOver ? styles.over : '';
    return connectDropTarget(
      <div className={cnames(className, styles.droppableSeat, descriptor, overClass)} style={{
      }}>
        {this.props.children}
      </div>
    );
  }
}

const DroppableSeat = DropTarget(DraggableTypes.guest, seatTarget, collectTarget)(
  // SeatContainer
  UnconnectedSeatContainer
);

export default purify(DroppableSeat);
