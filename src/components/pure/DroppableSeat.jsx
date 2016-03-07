import React,{PropTypes} from 'react';

import cnames from 'classnames/dedupe';
import { DragSource, DropTarget } from 'react-dnd';

const DraggableTypes = {
  guest: 'guest',
};


// This should trigger a swap action;
const swapGuest = () => console.log('guest was dropped...')

const seatTarget = {
  canDrop: (props) => {
    const result = true && true;
    // console.log('has result?');
    // console.log(result);
    return result;
  },
  //drop: (props) => props.swapGuest(props.seatNumber),
  drop: (props, monitor) => {
    const item = monitor.getItem();
    const droppedSeatNumber = (item || {}).seatNumber;
    props.swapGuests(droppedSeatNumber, props.seatNumber );
  }
  //drop: (props) => swapGuest(),
};


function collectTarget(connect, monitor) {
  const item = monitor.getItem() || {};
  const {sourceGuestID = -1, seatNumber: sourceSeatNumber = -1 } = item;
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

class SeatContainer extends React.Component {
  render() {
    const { connectDropTarget, isOver, canDrop, className } = this.props;

    return connectDropTarget(
      <div className={className} style={{
        opacity: isOver ? 0.5 : 1,
        backgroundColor: (isOver? (canDrop ? 'blue': 'red'): 'transparent'),
        cursor: 'move'
      }}>
        {this.props.children}
      </div>
    );
  }
}

//name: PropTypes.string.isRequired,
SeatContainer.propTypes = {

  seatNumber: PropTypes.number.isRequired,

  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired,
  className: PropTypes.string.isRequired,
  sourceGuestID: PropTypes.number.isRequired,
  sourceSeatNumber: PropTypes.number.isRequired,
};

const DroppableSeat = DropTarget(DraggableTypes.guest, seatTarget, collectTarget)(SeatContainer);

export default DroppableSeat;
