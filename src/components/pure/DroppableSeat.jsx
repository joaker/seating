import styles from '../../style/dragdrop.scss';

import React,{PropTypes} from 'react';
import { connect } from 'react-redux';

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

//name: PropTypes.string.isRequired,
UnconnectedSeatContainer.propTypes = {

  guestID: PropTypes.number,
  seatNumber: PropTypes.number.isRequired,
  //guestList: PropTypes.object.isRequired,

  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired,
  className: PropTypes.string.isRequired,
  sourceGuestID: PropTypes.number.isRequired,
  sourceSeatNumber: PropTypes.number.isRequired,
};

// const mapStateToProps = (state) => {
//   return {
//     guestList: state.get('venueGuestList'),
//   };
// }
// const SeatContainer = connect(
//   mapStateToProps
// )(UnconnectedSeatContainer);


const DroppableSeat = DropTarget(DraggableTypes.guest, seatTarget, collectTarget)(
  // SeatContainer
  UnconnectedSeatContainer
);

export default DroppableSeat;
