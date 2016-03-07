import React,{PropTypes} from 'react';

import cnames from 'classnames/dedupe';
import { DragSource, DropTarget } from 'react-dnd';

const DraggableTypes = {
  guest: 'guest',
};

const guestSource = {
  beginDrag(props) {
    return {seatNumber: props.seatNumber};
  }
};

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

class GuestContainer extends React.Component {
  render() {
    const { connectDragSource, isDragging } = this.props;
    return connectDragSource(
      <div style={{
        opacity: isDragging ? 0.5 : 1,
        color: isDragging ? 'blue': '',
        cursor: 'move'
      }}>
        {this.props.children}
      </div>
    );
  }
}

//name: PropTypes.string.isRequired,
GuestContainer.propTypes = {

  seatNumber: PropTypes.number.isRequired,

  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
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
    props.swapGuests(props.seatNumber, droppedSeatNumber );
  }
  //drop: (props) => swapGuest(),
};


function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }
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
};

export const DraggableGuest = DragSource(DraggableTypes.guest, guestSource, collectSource)(GuestContainer);

export const DroppableSeat = DropTarget(DraggableTypes.guest, seatTarget, collectTarget)(SeatContainer);

// const DraggableGuest = GuestDragSource;
//export default DraggableGuest;
